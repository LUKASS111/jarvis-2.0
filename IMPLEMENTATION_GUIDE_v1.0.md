# Jarvis 2.0: Implementation Guide v1.0

**Document Version:** 1.0
**Status:** Ready for Development
**Last Updated:** 2025-10-04
**Related Document:** `MASTER_PLAN_Version23.0.md`

## 1. Introduction

**Purpose:** This document is the technical companion to the `MASTER_PLAN_Version23.0.md`. It provides concrete code patterns, class structures, and configuration examples to guide the developer during the implementation phase. It answers the question, "How, specifically, should this be coded?" without cluttering the high-level architectural plan.

---

## 2. Core Module Implementation Details

### 2.1. Orchestrator: TaskQueue Implementation

**Requirement:** The `Orchestrator` must process incoming tasks sequentially to avoid race conditions.
**Guidance:** As noted in the `MASTER_PLAN`, this will be handled by a task queue. This queue should be implemented as a simple, encapsulated class within the `orchestrator` package to manage the state cleanly.

**Proposed Location:** `/packages/orchestrator/src/TaskQueue.ts`
```typescript
export class TaskQueue<T> {
  private queue: T[] = [];

  /** Adds a task to the end of the queue. */
  add(task: T): void {
    this.queue.push(task);
  }

  /** Retrieves and removes the next task from the front of the queue. */
  next(): T | undefined {
    return this.queue.shift();
  }

  /** Checks if there are any pending tasks. */
  hasPending(): boolean {
    return this.queue.length > 0;
  }

  /** Returns the number of pending tasks. */
  get length(): number {
    return this.queue.length;
  }
}
```
The `Orchestrator` will instantiate this class and its `startListening()` method will use an `async` loop to pull tasks from it.

### 2.2. Orchestrator: Blueprint Registry for Command Mapping

**Requirement:** The `_findMasterBlueprintForCommand` method needs a reliable way to map user commands to specific `Blueprint` fingerprints.
**Guidance:** A simple JSON configuration file is the most straightforward and maintainable approach. This file should be loaded by the `Orchestrator` on startup.

**Proposed Location:** `/config/blueprint-registry.json`
```json
{
  "research-topic": "BPv1GN-00001",
  "process-file": "BPv1GN-00002",
  "learn-new-skill": "master-learn-new-skill-from-archetype"
}
```

### 2.3. Orchestrator: Blueprint Execution Runtime

**Requirement:** The `executeBlueprint` method needs a structured way to execute the individual nodes defined in a `BlueprintDoc`.
**Guidance:** To adhere to the Single Responsibility Principle, it is recommended to create a dedicated `BlueprintRuntime` class within the `orchestrator` package. The `Orchestrator` will be responsible for managing the overall `CognitiveContext`, while the `BlueprintRuntime` will handle the logic of executing a single node within that context.

**Proposed Location:** `/packages/orchestrator/src/BlueprintRuntime.ts`
```typescript
import { BlueprintNode } from '@jarvis/shared-schema';
import { CognitiveContext } from './CognitiveContext'; // Assuming this class holds the state
import { LLMAdapter } from '@jarvis/llm-adapter';
import { Storage } from '@jarvis/memory-core';

export class BlueprintRuntime {
  constructor(
    private llmAdapter: LLMAdapter,
    private storage: Storage
  ) {}

  async executeNode(node: BlueprintNode, context: CognitiveContext): Promise<void> {
    // This method will contain the switch statement to handle different node types
    switch (node.type) {
      case 'query':
        const result = await this.llmAdapter.query(node.querySpec.model, node.querySpec.prompt);
        context.setVariable(node.querySpec.outputVariable, result);
        break;
      case 'task':
        // Logic for executing a storage task, e.g., saving a KU
        break;
      case 'generate-relationships':
        // Logic for calling the LLM to generate relationships
        break;
      // ... other cases
    }
  }
}
```

### 2.4. LLM Integration: Abstraction Layer

**Requirement:** The `query` node type needs to communicate with a local Large Language Model.
**Guidance:** This interaction must be abstracted to decouple the core system from any specific LLM provider (e.g., Ollama, LM Studio). A dedicated `llm-adapter` package should be created for this purpose.

**Proposed Location:** `/packages/llm-adapter/src/LLMAdapter.ts`
```typescript
export class LLMAdapter {
  private apiUrl: string;

  constructor(apiUrl: string = 'http://localhost:11434/api/generate') {
    this.apiUrl = apiUrl;
  }

  async query(model: string, prompt: string): Promise<string> {
    // This method will contain the actual fetch() logic to an Ollama-compatible API
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream: false }),
    });

    if (!response.ok) {
      throw new Error(`LLM API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  }
}
```

### 2.5. Storage: Data Validation Layer

**Requirement:** The `commitKnowledgeUnit` method must be protected against storing malformed data in the Automerge documents.
**Guidance:** A schema validation library is required. `Zod` is recommended for its excellent TypeScript support. Schemas should be defined in the `shared-schema` package.

**Proposed Location:** `/packages/shared-schema/src/schemas.ts`
```typescript
import { z } from 'zod';

// Example schema for an Entity's content
export const EntityContentSchema = z.object({
  name: z.string(),
  type: z.enum(['person', 'organization', 'product']),
  properties: z.record(z.any()),
});
```
**Usage in Storage:**
```typescript
// In /packages/memory-core/src/storage.ts, inside commitKnowledgeUnit method
import { EntityContentSchema } from '@jarvis/shared-schema';

// ...
if (shardName === 'entities') {
  try {
    EntityContentSchema.parse(unit.content);
  } catch (error) {
    throw new Error(`Validation failed for entity ${unit.id}: ${error.message}`);
  }
}
// Proceed with commit...
```

### 2.6. Pillar 12: Local Sandboxing Implementation

**Requirement:** The "sandbox" for skill inheritance must be technically defined.
**Guidance:** For `v1.0`, the term "sandbox" refers to a **logical, in-memory construct**, not a physically isolated process. It means that the new `BlueprintDoc` object is built and modified entirely within a variable in the `Orchestrator`'s memory. It is not persisted to the `skills.automerge` shard until it has been fully constructed and validated. This approach is fast and avoids the complexity of process isolation libraries like `vm2` or `isolated-vm`, which can be considered for future versions if higher security is required.

---

## 3. API and UI Implementation Details

### 3.1. API: UI State Representation

**Requirement:** The `GET /contexts/:fingerprint` endpoint needs a defined data structure to enable the "Morphing Interface."
**Guidance:** The API should return a rich object that gives the UI all the information needed to visualize the current state and history of a cognitive process.

**Example JSON response for `GET /contexts/:fingerprint`:**
```json
{
  "fingerprint": "CXv1PR-00123",
  "status": "running",
  "currentBlueprintId": "BPv1PR-00202",
  "currentNodeId": "query-3",
  "history": [
    { "nodeId": "query-1", "status": "completed", "durationMs": 1200 },
    { "nodeId": "task-1", "status": "completed", "durationMs": 150 },
    { "nodeId": "query-2", "status": "completed", "durationMs": 1500 }
  ],
  "variables": {
    "topic": "3ds Max vs Blender",
    "features_3dsmax": "...",
    "features_blender": "..."
  },
  "telemetry": [
    { "timestamp": "2025-10-04T10:01:05.123Z", "type": "execution", "details": { "nodeId": "query-1", "status": "started" } },
    { "timestamp": "2025-10-04T10:01:06.323Z", "type": "execution", "details": { "nodeId": "query-1", "status": "completed" } }
  ]
}
```
This structure allows the UI to draw the Blueprint graph, highlight the currently active node, show the history of execution, and display the values of context variables in real-time.