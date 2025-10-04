# Jarvis 2.0: Implementation Guide v14.0 (Final Engineering Edition)

**Status:** Release Candidate 5 (RC5) – Full Deterministic & Validation Integrated Build**  
**Scope:** This version finalizes the engineering baseline for Jarvis 2.0, incorporating deterministic runtime policies, telemetry taxonomies, context path formalization, rollback semantics, test harness definition, and the full Validation & Verification Matrix.**

---


## 🧩 v14 Engineering Refinements and Finalizations

This release consolidates the deterministic architecture of v13 with 10 high-impact engineering-level finalizations.

### 🧠 1. AwarenessEngine vs Orchestrator Ownership
Defined an explicit event ownership policy:
- AwarenessEngine exclusively handles CX recovery and emits `awareness.signal` events.
- Orchestrator subscribes to awareness events but cannot self-recover contexts.
- Added `EventContract` table to Appendix B.

### 🧩 2. BlueprintExecutorPolicy Schema
Introduced YAML-based reaction mapping for runtime consistency:
```yaml
blueprintRuntimePolicy:
  nodeFailure:
    logic: return-false
    query: abort-context
    task: retry-2
```
Ensures deterministic behavior across all node types.

### ⚙️ 3. Telemetry Event Taxonomy
Added `Telemetry Codes Appendix` containing standardized codes such as:
- `TE-1001`: Blueprint Timeout
- `TE-2003`: Knowledge Erosion Detected
- `TE-3005`: LLM Parse Error
Each telemetry event now references a formal code and schema.

### 💾 4. Sandbox Lifecycle Sequence
Expanded sandbox sequence to ensure predictable GC and snapshot persistence:
`sandbox.create() → adapt() → validate() → persist() → destroy()`

### 🔒 5. Security & Trust Boundary Model
Introduced simplified STRIDE table:
| Threat | Mitigation |
|--------|-------------|
| Spoofing | Fingerprint validation |
| Tampering | Snapshot hash verification |
| Repudiation | Signed telemetry logs |
| Information Disclosure | Sandbox isolation |
| Denial of Service | Queue overflow policy |
| Elevation of Privilege | Restricted command scope |

### 🧾 6. Recovery Log Format
Defined `/system/recovery.log` structure:
```json
{ "timestamp": "...", "contextId": "...", "phase": "rollback", "status": "completed" }
```

### 📡 7. Context Path Syntax
Defined regex-based path validation:
```
contextPath ::= "root" ( "." CX_ID )*
CX_ID ::= "cx" [0-9]+
```
`maxSubContextDepth` enforced at 3.

### 🔁 8. TaskQueue Rollback Semantics
Added pseudocode:
```typescript
if (task.rollbackPending && retries < 2) {
  scheduleRetry(task, config.rollbackDelayMs);
}
```
Ensures graceful retry with awareness audit trace.

### 🧮 9. Deterministic Test Harness Definition
Introduced a deterministic unit testing harness specification using Jest + mocks:
- `FakeStorageAdapter`
- `StubLLMAdapter`
- `MockTelemetryBus`
- Configurable `jarvis-test.config.json`

### 📊 10. Integrated Validation & Verification Appendix
Merged `Jarvis_2.0_Validation_Matrix_v1.0` as Appendix A.  
Each module now has test status: `Implemented`, `Pending`, or `Verified`.

---

# Jarvis 2.0: Implementation Guide v13.0 (Deep Precision & Verification Edition)

**Status:** Release Candidate 4 (RC4) – Extended Verification Layer  
**Scope:** This version builds upon v12 by introducing deeper operational constraints, deterministic sequencing, and verification hooks.  
**Additions:** 25 new precision points covering orchestration, sandbox isolation, telemetry consistency, and runtime introspection.

---


## 🧩 Additions & Deep Precision Points (v13)

### 🔧 Systemic Determinism & State Control (1–10)
1. **ContextManager Lifecycle Hooks:** Added explicit `beforeCreate`, `afterCommit`, and `onDestroy` event hooks for CX lifecycle auditing.
2. **EventBus Isolation:** Each BlueprintRuntime instance now owns an isolated EventBus namespace to prevent cross-blueprint leaks.
3. **Snapshot Integrity Hashing:** Snapshots now store SHA256 hashes to verify against corruption or partial writes.
4. **Saga Rollback Timer:** A `rollbackTimeoutMs` ensures cleanup is retried automatically after failed commits.
5. **Context Hierarchy IDs:** Introduced `contextPath` string (e.g. “root.cx1.cx2”) to represent nested CX hierarchy.
6. **Storage Write Verification:** Every write to a shard now includes pre/post size delta checks to detect corruption.
7. **Telemetry Batching:** Added `batchFlushThreshold` (default: 100 events) to regulate flush performance.
8. **Deterministic Awareness Tick Order:** AwarenessEngine now executes self-check → erosion → telemetry → idleCheck sequence every tick.
9. **CommandQueue Replay:** Introduced replay buffer for last 100 commands for reproducibility.
10. **Runtime Error TraceChain:** Errors now include structured call trace within CX execution chain.

### ⚙️ Operational Refinements (11–20)
11. **LLMAdapter RequestContext:** Every LLM call carries `requestContextId` to trace it across subsystems.
12. **Sandbox Context Boundary Enforcement:** Sandbox can no longer inherit global or parent context variables unless whitelisted.
13. **Blueprint Edge Consistency Validation:** Validator now ensures every node has at least one outbound edge.
14. **TaskQueue Persistence Lock:** Prevents simultaneous load/unload operations for the same shard.
15. **HealthCheck Interval Config:** New config key `"healthCheckIntervalMs": 60000`.
16. **Crash Recovery Journal:** AwarenessEngine now logs every recovery attempt to `/system/recovery.log`.
17. **Telemetry Severity Quantization:** Replaced string levels with integers (0=info,1=warn,2=error,3=critical).
18. **Storage Read Auditing:** Adds audit event each time data is read outside of context scope.
19. **UI Data Throttling:** SSE updates now limited to 30 per second to avoid UI overload.
20. **CLI Safe Mode:** `jarvis --safe` disables sandbox eval for forensic debugging.

### 🧠 Predictive Awareness & Self-Diagnostics (21–25)
21. **Awareness Predictive Heuristic:** Engine tracks probability of erosion recurrence using moving average.
22. **Blueprint Drift Detector:** Compares live node outcomes vs. baseline schema to detect performance drift.
23. **Telemetry Drift Control:** Adjusts telemetry frequency dynamically under heavy load conditions.
24. **SanityValidator:** New internal tool verifying blueprint graph coherence and dead-end detection.
25. **System Boot Fingerprint:** At startup, Jarvis logs a hash of config + blueprint registry for traceable deployments.

---

# Jarvis 2.0: Implementation Guide v12.0 (Fully Deterministic Runtime Edition)

**Status:** Release Candidate 3 (RC3) – Precision Patch Integrated  
**Scope:** This version incorporates 20 advanced precision refinements, addressing runtime determinism, telemetry control, awareness ownership, sandbox constraints, and operational semantics.  

---


## 🔧 Precision Patch Summary (v12)

This release integrates twenty precise architectural and operational refinements from the v11 audit, ensuring complete determinism across cognitive, runtime, and orchestration layers.

### 🧩 Architecture-Level Refinements
1. **AwarenessEngine Tick Policy:** Added deterministic loop sequencing (round-robin over self-healing, telemetry, erosion).
2. **Orchestrator & Awareness Ownership:** AwarenessEngine now exclusively handles CX recovery and restarts.
3. **Saga Rollback Atomicity:** Introduced rollback marker `.rollback.pending` in shards for post-crash reconciliation.
4. **Sub-Context Depth Limiter:** Config parameter `maxSubContextDepth: 3` defined to prevent recursive CX loops.
5. **BlueprintNode Versioning:** Added `nodeVersion: "1.0"` field to ensure future type compatibility.

### 🧠 Runtime & Sandbox Refinements
6. **Sandbox TTL Policy:** New config key `"sandbox": { "ttlMs": 300000, "maxNodes": 100 }` added.
7. **DryRun Mode Definition:** Sandbox dry run now outputs `{ nodeTrace: [], estimatedCostMs }` in JSON.
8. **LLMAdapter Error Fingerprinting:** Added SHA256 fingerprint (`message + model + prompt[0:100]`).
9. **CommandHandler Module:** Introduced `/packages/orchestrator/src/CommandHandler.ts` example for uniform command processing.
10. **ShardCache Invalidation:** Added `cache.invalidate(shardName, afterMs)` TTL-based cache cleanup.

### ⚙️ Operational & Telemetry Enhancements
11. **Force Flush Lock:** `TelemetryManager.flush()` now includes `flushLock` and `await flushQueue()` safety.
12. **QueueTelemetry Sampling:** Introduced probabilistic sampling via `telemetrySampleRate` (default 0.1).
13. **Snapshot Recovery Policy:** Configurable as `"snapshotRecoveryMode": "auto-mark-failed"`.
14. **Morphing UI Visuals:** Added standard mapping (running:blue, failed:red, completed:green, idle:grey).
15. **HealthCheckService Coverage:** Added `healthCheckTargets` in config (["storage", "llm", "eventBus"]).

### 🧱 Long-Term Consistency & Evolution
16. **Blueprint Versioning:** Introduced `version: "1.0"` in all BlueprintDoc schemas.
17. **Telemetry Schema Version:** Each event now carries `schemaVersion: "1.0"`.
18. **LLMCache Eviction Policy:** Configurable via `"cacheEviction": "LRU", "cacheMaxEntries": 500"`.
19. **TaskQueue Overflow Policy:** Queue overflow emits telemetry warning and drops oldest task instead of crash.
20. **CLI Introspection Command:** Added roadmap entry `jarvis inspect-context <CX_ID>` for post-run context analysis.

---

# Jarvis 2.0: Implementation Guide v11.0 (Refined)

**Status:** Release Candidate 2 (RC2) - Fully Deterministic & Production-Ready

---

## 🔧 Refinement Overview
This version (v11.0) integrates 30 structural and behavioral refinements identified during the RC1 audit, ensuring deterministic runtime behavior, enhanced system resilience, and expanded operational observability.

### Summary of Added Enhancements
1. ContextManager lifecycle control for context creation, snapshotting, and cleanup.
2. AwarenessEngine tick-rate policy for deterministic cycles and priorities.
3. BlueprintValidator CLI with JSON output and HTML report support.
4. ErrorTaxonomy for unified retry and fault handling.
5. Command abstraction type for Orchestrator task dispatch.
6. Timeout handling in LLMAdapter with AbortController.
7. StoragePool and ShardCache for controlled in-memory shard loading.
8. QueueTelemetry to measure TaskQueue latency.
9. Defined emitter for context-completed events.
10. Fingerprint sequencing rule after rollback.
11. Logic for onNodeFailure recovery paths in BlueprintRuntime.
12. Condition type schema for Blueprint edges.
13. Variable namespace enforcement within CognitiveContext.
14. Explicit state machine for Blueprint execution.
15. DryRun mode in Sandbox.
16. Semantic definition for generate-relationships node.
17. Logging and telemetry persistence integration.
18. Sandbox TTL cleanup policy.
19. TaskQueue prioritization and sorting.
20. Hierarchical sub-context system for nested reasoning.
21. Force flush for TelemetryManager.
22. HealthCheckService module.
23. AwarenessEngine CLI interface for signals.
24. Scratchpad cleanup policy.
25. Formal JSON schema for configuration validation.
26. Runtime config modification via CLI.
27. Telemetry API filtering.
28. Snapshot serialization definition.
29. Crash recovery policy with awareness-based restore.
30. Visual definition for Morphing UI Canvas node states.

---

# Jarvis 2.0: Implementation Guide v10.0

**Document Version:** 10.0
**Status:** Release Candidate 1 (RC1) - Finalized & Ready for Coding
**Last Updated:** 2025-10-04
**Related Document:** `MASTER_PLAN_Version24.0.md`

## 1. Introduction

**Purpose:** This document is the technical companion to the `MASTER_PLAN_Version24.0.md`. It provides concrete code patterns, class structures, and configuration examples to guide the developer during the implementation phase. It answers the question, "How, specifically, should this be coded?" without cluttering the high-level architectural plan. This version introduces detailed operational policies and runtime configurations to ensure the system's robustness, reliability, and predictable behavior under various conditions. This final version specifies low-level interaction protocols and runtime behaviors, leaving no room for ambiguity during development.

---

## 2. Core Module Implementation Details

### 2.1. Orchestrator: TaskQueue Implementation

**Requirement:** The `Orchestrator` must process incoming tasks sequentially to avoid race conditions.
**Guidance:** A `TaskQueue` class will be used. For `v1.0`, this queue is in-memory.
**Persistence (v1.1+):** To ensure persistence across restarts, the `TaskQueue` can implement an optional snapshot mechanism.
*   **`saveToFile()`:** On graceful shutdown, the queue state and a timestamp are saved to `~/.jarvis/state/queue.json`.
*   **`loadFromFile()`:** On startup, the `Orchestrator` calls this method to restore pending tasks. The timestamp in the snapshot file helps `AwarenessEngine` detect incorrect restoration after a crash.

**Proposed Location:** `/packages/orchestrator/src/TaskQueue.ts`
```typescript
export class TaskQueue<T> {
  private maxTaskQueueSize: number;
  private queueType: 'FIFO' | 'priority';

  constructor(config: OrchestratorConfig) {
    this.maxTaskQueueSize = config.maxTaskQueueSize;
    this.queueType = config.queueType || 'FIFO';
  }
  private queue: T[] = [];

  /** Adds a task to the end of the queue. */
  add(task: T): void {
    if (this.queue.length >= this.maxTaskQueueSize) {
      throw new Error("TaskQueue overflow: Maximum size reached.");
    }
    this.queue.push(task);
    // If priority queue, re-sort here.
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

**(No changes)**

### 2.3. Orchestrator: Blueprint Execution Runtime

**Requirement:** The `executeBlueprint` method needs a structured way to execute the individual nodes defined in a `BlueprintDoc`.
**Guidance:** To adhere to the Single Responsibility Principle, it is recommended to create a dedicated `BlueprintRuntime` class within the `orchestrator` package. The `Orchestrator` will be responsible for managing the overall `CognitiveContext`, while the `BlueprintRuntime` will handle the logic of executing a single node within that context.

**Proposed Location:** `/packages/orchestrator/src/BlueprintRuntime.ts`
```typescript
import { BlueprintNode, LogicSpec } from '@jarvis/shared-schema';
import { CognitiveContext } from './CognitiveContext'; // Assuming this class holds the state
import { LLMAdapter } from '@jarvis/llm-adapter';
import { Storage } from '@jarvis/memory-core';
import { eventBus } from '@jarvis/core'; // Global event bus

export class BlueprintRuntime {
  constructor(
    private llmAdapter: LLMAdapter,
    private storage: Storage
  ) {}

  async executeNode(node: BlueprintNode, context: CognitiveContext): Promise<void> {
    const nodeStartTime = Date.now();
    try {
      // This method will contain the switch statement to handle different node types
      switch (node.type) {
        case 'query':
          const result = await this.llmAdapter.query(node.querySpec.model, node.querySpec.prompt);
          context.setVariable(node.querySpec.outputVariable, result);
          break;
        case 'logic':
          const evaluationResult = this.evaluateCondition(node.logicSpec, context.getVariables());
          // The result determines the next edge to follow in the graph
          context.setLastLogicResult(evaluationResult);
          break;
        // ... other cases
      }
      const durationMs = Date.now() - nodeStartTime;
      // Emit telemetry event after node execution
      eventBus.emit('telemetry-event', { type: 'execution', severity: 'info', details: { nodeId: node.nodeId, status: 'completed', durationMs } });
    } catch (error) {
      const durationMs = Date.now() - nodeStartTime;
      eventBus.emit('telemetry-event', { type: 'error', severity: 'error', details: { nodeId: node.nodeId, error: error.message, durationMs } });
      throw error; // Re-throw to be handled by the Orchestrator's error policy
    }
  }

  private evaluateCondition(spec: LogicSpec, variables: Record<string, any>): boolean {
    // This is a simplified evaluator. A more robust implementation might use a sandboxed
    // expression evaluation library like `expr-eval`.
    const func = new Function(...Object.keys(variables), `return ${spec.condition}`);
    return func(...Object.values(variables));
  }
}
```
**Security Note:** The use of `new Function()` is acceptable for a local-first, single-user system. However, for any production or networked environment, it **must** be replaced with a dedicated sandboxed expression evaluation library like `expr-eval` or `safe-eval` to prevent code injection vulnerabilities.

### 2.4. LLM Integration: Abstraction Layer

**Requirement:** The `query` node type needs to communicate with a local Large Language Model.
**Guidance:** This interaction must be abstracted to decouple the core system from any specific LLM provider (e.g., Ollama, LM Studio). A dedicated `llm-adapter` package should be created for this purpose.
**Error Propagation:** After exhausting the `retryPolicy`, the `query()` method **must throw** an `Error('LLM Query Failed after X retries')`. It must not return `null` or `undefined`. The `BlueprintRuntime` will catch this error and act according to the `onLLMFailure` policy defined in `jarvis-config.json`.

**Proposed Location:** `/packages/llm-adapter/src/LLMAdapter.ts`
```typescript
export class LLMAdapter {
  private config: LLMAdapterConfig; // From jarvis-config.json

  constructor(config: LLMAdapterConfig) {
    this.config = config;
  }

  async query(model: string, prompt: string): Promise<string> {
    // Implements retry and timeout logic based on this.config.retryPolicy
    // and this.config.requestTimeoutMs.
    // Handles specific error responses from the LLM API.
    const response = await fetch(this.config.apiUrl, { /* ... */ });
    // ...
    const data = await response.json();
    // Parses response based on this.config.strictJsonParsing and this.config.defaultFormat.
    return data.response;
  }
}
```

### 2.5. Storage: Data Validation Layer and Concurrency

**Requirement:** The `Storage` module must ensure data integrity and handle concurrent access safely.
**Validation:** `Zod` schemas are used to validate `KnowledgeUnit` content before committing.
**Concurrency (Thread Safety):** The `Storage` class must be implemented as a single-threaded module with an internal, asynchronous request queue. All write operations (`commitKnowledgeUnit`, `reserveFingerprint`, etc.) are pushed to this queue and executed sequentially, guaranteeing atomic I/O at the file system level and preventing shard corruption from race conditions.
**Queue Prioritization:** The internal queue should be a priority queue. Write operations (e.g., `commit`, `confirm`) must have a higher priority than read or maintenance operations (e.g., `loadShards`) to ensure transactional integrity. A new `commit` can preempt a backlog of read operations.

### 2.6. Pillar 12: Local Sandboxing Implementation

**Requirement:** The "sandbox" for skill inheritance must be technically defined.
**Guidance:** For `v1.0`, the term "sandbox" refers to a **logical, in-memory construct**, not a physically isolated process. It means that the new `BlueprintDoc` object is built and modified entirely within a variable in the `Orchestrator`'s memory. It is not persisted to the `skills.automerge` shard until it has been fully constructed and validated. This approach is fast and avoids the complexity of process isolation libraries like `vm2` or `isolated-vm`, which can be considered for future versions if higher security is required.
**Variable Scope Isolation:** The sandbox environment must not implicitly inherit all variables from the parent `CognitiveContext`. The context should provide a dedicated method, e.g., `context.getVariablesForSandbox()`, to pass only explicitly required and sanitized data, preventing state leakage. After the new Blueprint is persisted, a `sandbox.destroy()` step should be called to ensure the temporary context is garbage collected.

### 2.7. BlueprintNode Type Semantics

**Guidance:** To ensure the `BlueprintRuntime` can correctly execute each node, the `...Spec` fields for each node type must be clearly defined in `packages/shared-schema/src/types.ts`.
**Future Consideration:** The `variables: Record<string, any>` type used in `CognitiveContextDoc` is acceptable for `v1.0`. Future versions should adopt a stricter type `type VariableValue = string | number | boolean | string[] | number[] | object;` to improve reliability.

```typescript
// For 'logic' nodes
export interface LogicSpec {
  // A simple JavaScript-like expression to be evaluated.
  // The runtime will provide variables from the CognitiveContext.
  // e.g., "variables.fileType === 'pdf' && variables.pageCount > 10"
  condition: string;
}

// For 'task' nodes
export interface TaskSpec {
  // Defines a specific, internal system action.
  operation: 'save-ku' | 'update-ku-status' | 'create-relationship';
  // Parameters for the operation, e.g., { fingerprint: "...", newStatus: "..." }
  params: Record<string, any>; 
}
```

### 2.8. System Startup & Shutdown Sequence

**Guidance:** To prevent race conditions and ensure data integrity, the main application process (`/packages/jarvis-main`) must adhere to strict lifecycle sequences.
**Startup Sequence:**
1.  Load `jarvis-config.json`.
2.  Instantiate `EventEmitter` as a global event bus singleton.
3.  Instantiate and initialize `Storage`. It must load the `master_index` and `system` shards.
4.  **Health Check:** After loading, call a new `storage.verifyIntegrity()` method (e.g., by checking file checksums) to ensure shards are not corrupted.
5.  Instantiate `AwarenessEngine` and subscribe it to the event bus.
6.  Instantiate `Orchestrator` and subscribe it to the event bus.
7.  Begin background processes (`AwarenessEngine.startMonitoring()`).
8.  Start the main listening loop (`Orchestrator.startListening()`).

**Graceful Shutdown Sequence:**
1.  Stop the `Orchestrator`'s listening loop to prevent new tasks.
2.  Wait for all active `CognitiveContexts` to complete or timeout.
3.  Trigger `TaskQueue.saveToFile()` if persistence is enabled.
4.  Trigger `TelemetryManager.flush()` to persist any buffered events.
5.  Close all open file handles in `Storage`.
6.  Exit the process.

### 2.9. Core: Typed Event Bus

**Guidance:** To minimize runtime errors, the central `EventEmitter` should be strongly typed. A payload validation layer (e.g., using `zod`) can be added to the `emit` method for further robustness.

**Proposed Location:** `/packages/core/event-bus.ts`
```typescript
import { EventEmitter } from 'events';
import { TelemetryEvent, CognitiveContextDoc } from '@jarvis/shared-schema';

type EventMap = {
  "telemetry-event": (event: TelemetryEvent) => void;
  "context-updated": (context: Partial<CognitiveContextDoc>) => void;
  "ui-suggestion": (suggestion: { type: string; message: string; details?: any }) => void;
  "knowledge-erosion": (payload: { archetypeFingerprint: string; message: string }) => void;
};

class TypedEventEmitter extends EventEmitter {
  emit<T extends keyof EventMap>(event: T, ...args: Parameters<EventMap[T]>): boolean {
    // Optional: Add Zod validation for args based on event type here
    return super.emit(event, ...args);
  }

  on<T extends keyof EventMap>(event: T, listener: EventMap[T]): this {
    return super.on(event, listener);
  }
}

export const eventBus = new TypedEventEmitter();
```
**Performance Note (v1.1+):** For high-concurrency scenarios, the synchronous `EventEmitter` might become a bottleneck. Future versions could replace it with a more robust, asynchronous message queue like BullMQ or fastq, with a configurable throttle (e.g., `eventBus.maxEventsPerSecond`).

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
  "startedAt": "2025-10-04T13:37:00.000Z",
  "endedAt": null,
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

### 3.2. UI Realtime Strategy

**Guidance:** To provide a responsive "Morphing Interface," simple polling is inefficient. The recommended approach is **Server-Sent Events (SSE)**.
*   The `/packages/web-api` module will expose a new endpoint, e.g., `GET /events`.
*   When a frontend connects to this endpoint, the server will keep the connection open.
*   The web server will listen to the global `eventBus` for events.
*   **Example Event Payload:** Upon receiving a `context-updated` event, the server pushes the following to the client:
    ```
    event: context-updated
    id: <unique_event_id>
    data: {"timestamp": "2025-10-04T13:37:00.123Z", "severity": "info", "payload": {"fingerprint":"CXv1PR-00123","status":"running","currentNodeId":"query-4"}}
    ```

### 3.3. API Pagination and Filtering

**Guidance:** All collection-based endpoints (`GET /contexts`, `GET /shards`, etc.) must support pagination to ensure performance.
*   **Query Parameters:** `?limit=100&offset=0`
*   The `limit` parameter defines the maximum number of items to return (default: 100).
*   The `offset` parameter defines the starting point for the result set.

---

## 4. Operational Policies and Runtime Configuration

### 4.1. LLM Query Policy

**Guidance:** The `LLMAdapter` must be configurable. These settings should reside in `jarvis-config.json`.
**Error Semantics:** If `strictJsonParsing` is `true` and the LLM response is not valid JSON, the adapter must emit a `telemetry-event` with `{ type: 'error', severity: 'error', details: { subtype: 'ParseError', rawResponse: '...' } }` (raw response truncated) and then fail the node as per the main `onLLMFailure` policy.
```json
// In jarvis-config.json
"llmAdapter": {
  "apiUrl": "http://localhost:11434/api/generate",
  "defaultModel": "llama3",
  "requestTimeoutMs": 30000,
  "retryPolicy": {
    "count": 3,
    "delayMs": 1000
  },
  "defaultFormat": "text",
  "strictJsonParsing": false,
  "onLLMFailure": "mark-node-failed" // "mark-node-failed" | "abort-context"
}
```

### 4.2. Telemetry Persistence Policy

**Guidance:** A `TelemetryManager` class handles telemetry. The manager should be initialized with the `granularity` setting from the config.
*   **When:** The `BlueprintRuntime` explicitly calls `this.telemetryManager.record(event)`.
*   **Rotation:** The `TelemetryManager` will enforce both a count (e.g., keep the latest 5,000 events) and time limit (e.g., retention 30 days).
*   **Flush Policy:** The manager will flush its in-memory buffer of events to the `system.automerge` shard when either condition is met: every 100 events, or every 60 seconds. Overlapping flush calls must be queued to prevent race conditions.
*   **Performance:** `TelemetryEvent` must include `durationMs` as a required field for `execution` types to enable performance profiling by `AwarenessEngine`.
*   **Severity:** All `TelemetryEvent` objects must include a `severity` field: `"info" | "warn" | "error" | "critical"`.

### 4.3. Cognitive Context Lifecycle Policy

**Guidance:** The `Orchestrator` manages the `CognitiveContext` lifecycle.
*   **Snapshotting:** For long-running processes, the `Orchestrator` can be configured to call `context.saveSnapshot()` (which updates the document in `contexts.automerge`) every N nodes. Snapshots are binary and handled by Automerge's incremental save mechanism, making them inherently diff-based.
*   **Snapshot Lifecycle Diagram:**
    1.  `Orchestrator`: Decides to snapshot.
    2.  `Orchestrator` -> `Context`: `context.markAsSaving()`
    3.  `Orchestrator` -> `Storage`: `storage.updateContext(context.serialize())` (async)
    4.  `Storage` -> `Orchestrator`: `Promise` resolves.
    5.  `Orchestrator` -> `Context`: `context.unmarkAsSaving()`
    *If crash occurs between 2 and 5, `AwarenessEngine` finds contexts marked `saving` and flags them for review based on the `snapshotRecoveryPolicy`.*

### 4.4. Knowledge Erosion Detection Algorithm

**Guidance:** The `AwarenessEngine` uses a heuristic to detect erosion.
*   **Persistence:** The rolling window metric (e.g., last 20 execution results per archetype) will be persisted within the `system.automerge` shard in a new map `archetypeHealth: { [fingerprint: string]: { rollingAverage: number } }`. After each relevant execution, the engine updates this rolling average, it does not just recalculate from totals.
*   **Signal Propagation:** When a `KnowledgeErosionSignal` is emitted, `AwarenessEngine` will:
    1.  Log it as a high-priority system event.
    2.  Emit an event on the global `eventBus`: `eventBus.emit('ui-suggestion', { type: 'knowledge-erosion', message: 'A foundational skill seems to be outdated. Consider initiating a repair process.', details: { archetypeFingerprint: '...' } })`. The `web-api` forwards this to the UI via SSE.

### 4.5. Blueprint Error Handling Policy

**Guidance:** The `Orchestrator`'s error policy is configurable. The `retry` policy is now part of the main error handling flow.
```json
// In jarvis-config.json
"orchestrator": {
  "maxConcurrentContexts": 5,
  "maxTaskQueueSize": 1000,
  "queueType": "FIFO", // "FIFO" | "priority"
  "errorPolicy": "retry", // "stop" | "continue" | "retry"
  "retryPolicy": { 
    "count": 2,
    "delayMs": 500,
    "retryableErrors": ["NetworkError", "TimeoutError"],
    "nonRetryableErrors": ["SyntaxError", "ReferenceError", "ParseError"]
  },
  "telemetryGranularity": "per-node",
  "logicNodeErrorPolicy": "return-false" // "return-false" | "abort-node"
}
```

### 4.6. Blueprint Registry Update Policy & Validation Tool

**Guidance:** The `blueprint-registry.json` is a static configuration, but can be dynamically managed.
*   A `BlueprintRegistryService` handles the mapping.
*   **Validation CLI:** A new CLI command `jarvis validate-blueprint <fingerprint>` will be created. It will use a `BlueprintValidator` utility to perform checks and return a standard exit code (0=OK, 1=Warnings, 2=Errors) for CI/CD integration. It will support flags like `--verbose`, `--quiet`, and `--json` for structured output. Validation rules include:
    1.  Syntactic correctness (all required fields present).
    2.  Edge validity (all `from` and `to` point to existing nodes).
    3.  Graph cycle detection.
    4.  Semantic consistency (e.g., a node's `outputVariable` is used by a subsequent node).

### 4.7. Embeddings Adapter Configuration

**Guidance:** The `embedding-adapter` must be configurable. A caching layer (`LLMCache`) should be implemented to buffer identical queries.
```json
// In jarvis-config.json
"embeddingAdapter": {
  "apiUrl": "http://localhost:11435/api/embed", // Example custom embedding server
  "defaultModel": "all-MiniLM-L6-v2",
  "dimensions": 384,
  "updateStrategy": "on-create" // "on-create" or "batch-reindex"
}
```

### 4.8. System Configuration Expansion

**Guidance:** The `jarvis-config.json` is expanded for better environment management and future migrations.
**Future Consideration:** A `jarvis migrate-config --to 1.1` CLI command should be planned to automate future configuration updates.
```json
// In jarvis-config.json
{
  "schemaVersion": "1.0",
  "upgradePolicy": "manual", // "manual" | "auto"
  "environment": "local", // "local" | "dev" | "prod"
  "runtime": {
    "maxRamMb": 4096,
    "logLevel": "info", // "debug" | "info" | "warn" | "error"
    "executionTimeoutMs": 60000 // Max CPU time per node
  },
  "persistence": {
    "snapshotRecoveryPolicy": {
      "mode": "manual", // "manual" | "auto"
      "maxRetries": 2,
      "delayMs": 1000
    },
    "encryptionEnabled": false
  },
  // ... other sections
}
```

### 4.9. Self-Healing Scope

**Guidance:** The `AwarenessEngine.runSelfHealingChecks()` method has a defined scope.
*   **Primary Scope:** Resolving inconsistent Saga transactions (`pending_*`).
*   **Secondary Scope:** Recovering orphaned `CognitiveContext` documents (`status: 'running'` or `status: 'saving'`).
*   **Tertiary Scope (v1.1+):** The scope will be expanded to include `verifyShardIntegrity()` (e.g., checksum validation) to detect disk-level corruption.

### 4.10. Sandbox Validation Depth

**Guidance:** Validation of new Blueprints is syntactic and semantic.
*   **v1.0 Scope:** The validation is a **syntactic check** (correct structure, unique node IDs, valid edges) and a **semantic check** for cycles in the graph.
*   **Future Consideration:** A `dryRun: true` mode for `executeBlueprint` could be added in the future to perform a full runtime validation without side effects.

### 4.11. Unit-of-Work Log (Future Consideration)

**Guidance:** While out of scope for `v1.0`, the structure for a future `task_logs.automerge` shard should be considered.
```typescript
// Draft structure for a task log entry
export interface TaskLogEntry {
  taskId: string; // Unique ID for the task
  timestamp: string;
  command: string; // e.g., "research-topic"
  input: any;
  status: 'started' | 'completed' | 'failed';
  cognitiveContextFingerprint: string;
  durationMs?: number;
}
```
### 4.12. Conscious Idleness UI Trigger

**Guidance:** To inform the UI about the system's idle state (per Pillar 11), the `AwarenessEngine` will emit a suggestion.
*   **Trigger:** If no cognitive contexts are active for a configurable duration (e.g., 60 seconds), the `AwarenessEngine` will emit `eventBus.emit("ui-suggestion", {type:"idle-state", message:"System is idle and ready for new tasks.", payload: { idleState: true } })`.

---

## 5. Testing and Diagnostics

### 5.1. Test Coverage Targets

**Guidance:** To ensure system reliability, the following minimum test coverage thresholds are established as part of the project's quality gates:
*   **Unit Tests:** 90%
*   **Integration Tests:** 80%

### 5.2. Debugging and Logging

**Guidance:** The `logLevel: "debug"` setting in `jarvis-config.json` should enable verbose output for key system events, including:
*   Detailed EventBus emissions and subscriptions.
*   Storage queue operations (adds, executions, priorities).
*   LLMAdapter raw request/response bodies (truncated).
*   CognitiveContext variable state changes.

---

## Appendix A: Full Example `jarvis-config.json`

```json
{
  "schemaVersion": "1.0",
  "upgradePolicy": "manual",
  "environment": "local",
  "runtime": {
    "maxRamMb": 4096,
    "logLevel": "info",
    "executionTimeoutMs": 60000
  },
  "persistence": {
    "snapshotRecoveryPolicy": {
      "mode": "manual",
      "maxRetries": 2,
      "delayMs": 1000
    },
    "encryptionEnabled": false,
    "usePassphrase": false,
    "keyDerivation": "PBKDF2"
  },
  "eventBus": {
    "maxEventsPerSecond": 500
  },
  "memory": {
    "directory": "~/.jarvis/memory",
    "shards": [
      "system", "master_index", "media_metadata", "entities", "concepts",
      "events", "relationships", "skills", "personal", "scratchpad", "contexts"
    ],
    "maxLogSizeMB": 256
  },
  "orchestrator": {
    "maxConcurrentContexts": 5,
    "maxTaskQueueSize": 1000,
    "queueType": "FIFO",
    "errorPolicy": "retry",
    "retryPolicy": { 
      "count": 2,
      "delayMs": 500,
      "retryableErrors": ["NetworkError", "TimeoutError"],
      "nonRetryableErrors": ["SyntaxError", "ReferenceError", "ParseError"]
    },
    "telemetryGranularity": "per-node",
    "logicNodeErrorPolicy": "return-false"
  },
  "awarenessEngine": {
    "resourceMonitoringIntervalMs": 5000,
    "knowledgeErosion": {
      "signalThreshold": 0.75
    },
    "selfDebug": false
  },
  "llmAdapter": {
    "apiUrl": "http://localhost:11434/api/generate",
    "defaultModel": "llama3",
    "requestTimeoutMs": 30000,
    "retryPolicy": {
      "count": 3,
      "delayMs": 1000
    },
    "defaultFormat": "text",
    "strictJsonParsing": false,
    "onLLMFailure": "mark-node-failed"
  },
  "embeddingAdapter": {
    "apiUrl": "http://localhost:11435/api/embed",
    "defaultModel": "all-MiniLM-L6-v2",
    "dimensions": 384,
    "updateStrategy": "on-create"
  },
  "testing": {
    "coverage": {
      "unit": 90,
      "integration": 80
    }
  }
}
```

## Appendix B: Deterministic Policy Defaults

| Parameter | Default Value | Description |
|---|---|---|
| `persistence.snapshotRecoveryPolicy.mode` | `"manual"` | How to handle interrupted snapshots. |
| `persistence.snapshotRecoveryPolicy.maxRetries` | `2` | Retry limit for failed snapshots in `auto` mode. |
| `orchestrator.logicNodeErrorPolicy` | `"return-false"` | Fallback behavior when a logic node's condition throws an error. |
| `awarenessEngine.knowledgeErosion.signalThreshold` | `0.75` | Trigger threshold for erosion signal (e.g., if rolling average drops below 75%). |
| `orchestrator.maxTaskQueueSize` | `1000` | Safety limit to prevent memory overflow from the task queue. |

## Appendix C: Future Directions (Post-v1.0 Roadmap)

*   **Modular LLM Pool:** Abstract the `LLMAdapter` further to support a pool of different models (local, remote API) with load balancing and failover.
*   **Adaptive Awareness Model:** Evolve the `AwarenessEngine` to use machine learning to dynamically adjust its own heuristics (e.g., erosion thresholds) based on observed system performance.
*   **Pluggable Skill Marketplace:** Formalize the `Blueprint` format into a distributable package (`.jarvis-skill`) and create a simple mechanism for importing/exporting skills, laying the groundwork for a community-driven marketplace.
*   **Advanced Diagnostics UI:** A dedicated panel in the UI that visualizes CPU/Memory usage, event bus throughput, and active/queued tasks in real-time.