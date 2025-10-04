# Jarvis 2.0: The Master Plan

**Document Version:** 23.0
**Status:** Finalized for Implementation
**Last Updated:** 2025-10-04

## 1. Core Vision & Guiding Principles

### 1.1. Mission Statement

To architect and build a **robust, private, local-first personal intelligence system**. Jarvis 2.0 is an offline-native, cognitive-reactive engine where the user has absolute sovereignty over their data. This system prioritizes architectural integrity, performance, and the capacity for continuous, real-time self-improvement within a framework of safety, reliability, and resilience. This version marks the transition from high-level architecture to a detailed implementation specification, defining the concrete structures and protocols necessary for development. This version formalizes the operational boundaries of the system, defining the non-negotiable distinction between complex cognitive processes and simple data retrieval, ensuring architectural purity and performance. This final version introduces the principle of Conscious Decomposition, ensuring every complex thought process is transparent, auditable, and hierarchically structured. This ultimate version introduces the principle of Skill Inheritance from Archetypes, enabling the system to learn efficiently by composing new skills from proven, foundational patterns. This final specification completes the architecture by defining mechanisms for intelligent ambiguity resolution and proactive knowledge evolution, ensuring a true long-term partnership between the user and the system. This final document completes the specification by including detailed data structures, API contracts, and a testing strategy, making it a complete guide for implementation.

### 1.2. Core Architectural Tenets

1.  **Local-First & Offline-Native:** The system must be 100% functional without an internet connection.
2.  **Federated Memory Governed by Universal Ontology:** Jarvis's memory is sharded according to a strict, universal ontology defined in Chapter 4. Its organization and lifecycle are managed by the Orchestrator.
3.  **Guaranteed Eventual Consistency:** Because atomic transactions across shards are impossible, the system abandons the illusion of immediate consistency in favor of **guaranteed eventual consistency**. Every write operation is a carefully orchestrated, multi-stage "saga" overseen by the Orchestrator, with built-in self-healing mechanisms.
4.  **CRDT as the Unified State:** `@automerge/automerge` is the single source of truth, persisted across multiple sharded, incrementally-saved files.
5.  **Cognitive-Reactive Orchestration:** A central **Orchestrator** acts as a universal interpreter for procedural "blueprints."
6.  **Self-Contained Environments:** The system is entirely responsible for managing its own isolated execution environments for all workers.
7.  **UI as a Function of State:** The user interface is a single, morphing canvas that visually represents the system's current cognitive state.
8.  **Total Introspection & Explainability:** Every action is recorded, linked, and auditable through a hierarchical context.
9.  **Memory Encapsulation:** The only authorized entity that can modify memory shard files is the Jarvis process itself, acting exclusively through the `Storage` class.

### 1.3. The Knowledge Fingerprint: A Universal Identifier

The "Knowledge Fingerprint" is a universal, structured, and chronologically sortable identifier assigned to every core entity within the system.

**Format:** `[TT][VV][QQ]-[SEQUENCE]`
*   **TT (Type):** `KU` (KnowledgeUnit), `BP` (Blueprint), `CX` (CognitiveContext).
*   **VV (Version):** `v1`.
*   **QQ (Quality Qualifier):**
    *   `PR`: **Primary Result** - Validated, successful outcome.
    *   `HY`: **Hypothesis** - Intermediate, unevaluated result.
    *   `FL`: **Failure** - A recorded "negative memory" or "scar."
    *   `MN`: **Manual** - Created by a human user.
    *   `GN`: **Genesis** - Innate, built-in knowledge.
    *   `AR`: **Archetype** - A foundational, reusable template Blueprint. These are not directly executable but serve as patterns for creating new skills.
*   **SEQUENCE:** A zero-padded, monotonically increasing counter.

---

## 2. The Pillars of Jarvis's Cognitive Architecture

Jarvis 2.0 is built upon twelve interconnected pillars that together create a system capable of complex thought, learning, and autonomous operation.

*(Pillars 0 through 10 remain as defined in previous versions, establishing the core principles of Unified Process, Evolutionary Thinking, Dynamic Reflection, Transactional Memory, Safety, Skill Tree, Two-Stage Querying, Managed Memory Lifecycle, Transactional Integrity, and Self-Healing.)*

### Pillar 11: The State of Conscious Idleness
*The ability to be aware without being active.*

**Role:** This pillar defines the default operational state of the system. Jarvis is not in a continuous, autonomous rush. It is in a state of passive, energy-efficient readiness.

**Implementation:**

1.  **Default State:** After startup, the main Jarvis process enters an `Idle` state. The Orchestrator is not executing any Blueprints.
2.  **Passive Awareness:** In this state, only the `AwarenessEngine` is active in the background (with minimal resource usage, e.g., <5% CPU). Its task is to:
    a. Monitor the system's health (`runSelfHealingChecks`, `startResourceMonitoring`).
    b. Maintain contextual awareness: it knows which shards are loaded, what the latest `TelemetryEvents` are, and which Blueprints are available.
    c. **(NEW) Monitor Knowledge Erosion:** Passively analyzes `TelemetryEvents` generated after Blueprint executions. If the `AwarenessEngine` detects a statistically significant pattern where Blueprints inheriting from a specific Archetype notoriously fail at the same step, it generates an internal "KnowledgeErosionSignal." Based on this signal, during the next relevant interaction, the system can proactively suggest that the user initiate a meta-learning task to evolve or replace the obsolete archetype.
3.  **User Initiative:** The system does not undertake complex actions (Blueprints) without an explicit command from the user. Commands such as "analyze pending tasks" or "research topic X" are necessary to activate the Orchestrator. The system can suggest actions in the UI, but the user is the ultimate decision-maker.

### Pillar 12: Skill Inheritance from Archetypes
*The ability to build new knowledge on the foundation of proven wisdom.*

**Role:** This pillar solves the "cold start" problem for new skills. Instead of learning every task from scratch through costly trial and error, the system is equipped with a set of reusable, abstract procedural patterns called "Skill Archetypes." When it faces a new, unknown task, its first step is to adapt the appropriate archetype.

**Definition of a Skill Archetype:**
*   **What it is:** An Archetype is a special type of Blueprint stored in the `skills.automerge` shard, marked with the new, dedicated `AR` (Archetype) quality fingerprint.
*   **Characteristics:** It is an abstract template that describes general logic, not concrete steps. It uses variables and placeholders.
*   **Archetype Examples (`BPv1AR-...`):**
    *   `BP-Archetype-StandardGUIInteraction`: Contains nodes for typical GUI interactions, such as "Find 'File' menu," "Click 'Open'," "Select file in dialog box."
    *   `BP-Archetype-WebDataExtraction`: Defines the pattern "Find search field," "Enter phrase," "Wait for results," "Extract list of items."
    *   `BP-Archetype-FileManipulation`: Describes the logic "Check file existence," "Read content," "Process," "Save to new location."

**The Adaptation and Inheritance Process in a Sandbox Environment:**
When the Orchestrator receives a task for which no ready-made Blueprint exists (e.g., "Automate report in 'SuperAnalytics'"), it initiates the following advanced thought process:

1.  **Reflection and Archetype Selection:** The Orchestrator performs a `knowledgeQuery` on the `skills.automerge` shard, searching for Blueprints with a `BPv1AR-*` fingerprint that match the task's context (e.g., tags `gui`, `automation`).
2.  **NEW - Interactive Disambiguation Phase:** In the event that the Reflection Phase returns more than one matching Skill Archetype, the system must not arbitrarily choose one. Instead, the Orchestrator pauses the process and initiates a dialogue with the user to resolve the ambiguity.
    *   **Logic:** The system analyzes the differences between the competing archetypes (e.g., based on their tags: `gui`, `web`, `cli`) and generates a precise question.
    *   **Example Dialogue:** "I've detected several potential patterns for this task. To choose the best one, please tell me: is the program you want to automate a classic desktop application, a web application, or a command-line tool?"
    *   **Goal:** The process continues until the user's response allows for the unambiguous selection of a single archetype. This principle guarantees that the system does not embark on a costly, incorrect learning path and reinforces the user's role as the ultimate decision-maker.
3.  **Sandbox Initialization:** Upon finding a matching archetype, the Orchestrator creates a temporary, volatile Cognitive Context (`CX`) in RAM. This "sandbox" is not yet persisted to any shard. It is a safe, isolated workspace ensuring that the process of creating a new skill is fast and does not pollute the permanent memory with intermediate artifacts.
4.  **Adaptation Phase (Structure Copying):** Within this temporary environment, the Orchestrator constructs a new Blueprint definition by intelligently copying the relevant nodes and connections from the selected archetype.
5.  **Concretization Phase:** The new, copied Blueprint skeleton is then customized for the specific task. The Orchestrator may use `query` type nodes to ask an LLM to fill in placeholders (e.g., query: "What is the default window title for the 'SuperAnalytics' program?" to concretize the "Find Window" step).
6.  **Validation and Persistence:** After successfully building and (optionally) testing the new Blueprint in the sandbox, the Orchestrator initiates the standard Transactional Saga (Pillar 9) to save it as a new, fully-fledged Blueprint (with a `BPv1PR-...` fingerprint) in the `skills.automerge` shard. The `provenance` of the new Blueprint will point to the fingerprint of the archetype it was copied from, creating a visible "genetic" link.

**Conclusion:** This process transforms learning from random exploration into a structured, engineering-like construction task, drastically accelerating the system's adaptation and ensuring the consistency of its procedural knowledge base.

---

## 3. Fundamental Operational Principles
*The non-negotiable rules governing system behavior.*

This chapter establishes three fundamental principles that define the system's boundaries and operational philosophy. They provide the overarching context for all subsequent technical specifications.

### 3.1. The Principle of Complexity Abstraction
**Directive:** Analytical processes (e.g., decomposing a file into Entities, Concepts, and Relationships) must be encapsulated within dedicated, atomic Blueprints.
**Implementation:** A high-level Blueprint (e.g., `process-new-file`) must not contain direct semantic analysis steps. It must delegate this work by invoking a single, subordinate Blueprint (e.g., `enrich-knowledge-from-source`). It is this subordinate Blueprint that contains the full complexity (e.g., by calling further, even smaller Blueprints for entity and relationship extraction).
**Purpose:** To maintain clarity and readability at a high level of abstraction. Complexity is organized hierarchically, not flattened.

### 3.2. The Principle of Relationships as Consequence
**Directive:** Relationships are an emergent property of knowledge, not a directly created entity.
**Implementation:** No method or Blueprint may exist in the system that allows for the creation of a `Relationship` object in isolation. `Relationship` objects may only be created as a byproduct of the analysis of at least two existing `KnowledgeUnits` (Entities, Concepts, or Events).
**Purpose:** To ensure the integrity of the knowledge graph. A relationship must connect something that already exists and is known to the system.

### 3.3. The Principle of Process vs. Query Distinction
**Directive:** The system must rigorously distinguish between "thinking" (a process) and "asking" (a query).
**Implementation:**
*   **"Thinking" (Process):** Complex, multi-stage tasks that create new knowledge or modify the system's state must be realized by the Orchestrator executing a Blueprint. This is a costly cognitive operation.
*   **"Asking" (Query):** Simple, fast retrieval of existing knowledge for read-only purposes must be realized by a direct method call on the `Storage` instance (e.g., `queryMasterIndex`, `getKnowledgeUnitsByFingerprints`). These operations must not involve the Orchestrator or Blueprints.
**Purpose:** To maximize performance and avoid wasting cognitive resources on simple tasks. The system must know when to "think" and when to simply "answer."

---

## 4. Universal Memory Ontology: The Pillars of Knowledge
*The structure of how Jarvis perceives reality.*

**Goal:** We are abandoning the previous, ambiguous, topic-based categorization of shards (finance, technology). We are introducing a new, universal ontology based on the fundamental nature of information. This structure is designed to allow the system to unambiguously categorize 99% of the world's information and perform highly optimized queries.

### 4.1. Definition of Knowledge Pillars (Shards)

Jarvis's memory is divided into 7 Declarative/Procedural Knowledge Pillars and 3 System Pillars.

#### Declarative Knowledge Pillars (What is true?):

1.  **`entities.automerge` (Entities):**
    *   **Content:** Concrete, singular "things." Nouns. This is the "Who" and "What" shard. It stores KnowledgeUnits representing unique entities.
    *   **Examples:** A Person ("Steve Jobs"), an Organization ("Apple Inc."), a Product ("iPhone 15 Pro"), a Place ("Cupertino, California"), a specific document ("Invoice FV-2025/10/03").
    *   **Purpose:** Isolates all specific objects the system knows about.

2.  **`concepts.automerge` (Concepts):**
    *   **Content:** Abstract ideas, theories, definitions, processes, laws. This is the "How" and "Why" shard on a theoretical level.
    *   **Examples:** A concept ("Innovation"), a theory ("Theory of Relativity"), a mathematical formula ("Formula for the area of a circle"), a law ("Law of Supply and Demand").
    *   **Purpose:** Separates abstract, timeless knowledge from specific entities.

3.  **`events.automerge` (Events):**
    *   **Content:** Things that happened at a specific point in time and space. Verbs. This is the "When" and "What happened" shard.
    *   **Examples:** A historical event ("Presentation of the first iPhone (2007)"), a financial transaction ("Payment received for FV-2025/10/03"), a meeting ("'Jarvis' project meeting (yesterday, 15:00)").
    *   **Purpose:** Creates the timeline of the system's knowledge.

4.  **`relationships.automerge` (Relationships):**
    *   **Content:** The most important glue. This shard does not store full objects, but only lightweight linkage objects (graph edges) between entities, concepts, and events from other shards.
    *   **Examples:** `{ sourceFingerprint: 'ENv1PR-00123', targetFingerprint: 'ENv1PR-00456', relationType: 'isFounderOf', label: 'was a co-founder of' }`.
    *   **Purpose:** Enables the system to understand context and perform complex graph queries without loading all other shards. This is the heart of "understanding."

#### Procedural Knowledge Pillar (How to do something?):

5.  **`skills.automerge` (Skills):**
    *   **Content:** All Blueprints (execution instructions). This is the physical representation of the "Skill Tree."
    *   **Purpose:** The central repository for all of the system's procedural knowledge.

#### Subjective & Working Knowledge Pillars:

6.  **`personal.automerge` (Personal):**
    *   **Content:** Knowledge that is subjective, private, and relates directly to user interaction.
    *   **Examples:** User preferences ("User prefers summaries in bullet points."), private notes, goals, tasks.
    *   **Purpose:** Creates a model of the user and stores data that does not fit into objective categories.

7.  **`scratchpad.automerge` (Scratchpad):**
    *   **Content:** Temporary, volatile data, intermediate results, system's working notes.
    *   **Purpose:** Acts like RAM for the system's "thoughts," can be regularly cleared without loss of permanent knowledge.

#### System Pillars (Immutable):

8.  **`master_index.automerge`:** As defined in v17, but now indexes entries from the 7 pillars above.
9.  **`system.automerge`:** As defined in v14 (fingerprint counters, system flags, logs).
10. **`media_metadata.automerge`:** Metadata for large binary files (images, video) that are not themselves stored in Automerge.

### 4.2. Memory Directory Structure
All Jarvis system data will be stored in a single main directory, with the default location `~/.jarvis/memory`. The structure of this directory is as follows:
```
~/.jarvis/memory/
├── master_index.automerge
├── system.automerge
├── media_metadata.automerge
├── entities.automerge
├── concepts.automerge
├── events.automerge
├── relationships.automerge
├── skills.automerge
├── personal.automerge
└── scratchpad.automerge
```
Note: Each `.automerge` file will have an accompanying `.chunks` directory for incremental saves.

---

## 5. Module API Contracts
This chapter defines the precise method signatures for the system's key modules. It serves as a contract that all parts of the system must adhere to.

### 5.1. Storage - The Memory Core (`packages/memory-core/src/storage.ts`)
```typescript
export type ShardName =
  | 'system' | 'master_index' | 'media_metadata' | 'entities' | 'concepts'
  | 'events' | 'relationships' | 'skills' | 'personal' | 'scratchpad';

export class Storage extends EventEmitter {
  /**
   * Initializes Storage, loads configuration, and mandatory shards ('master_index', 'system').
   */
  async initialize(config: JarvisConfig): Promise<void>;

  // --- Transactional Saga (per Pillar 9) ---

  /**
   * Saga Stage 1: Reserves a spot in the index.
   * Creates an entry in master_index with status 'pending_creation'.
   * This is a small, fast, and atomic operation on a single shard.
   * @returns A unique fingerprint for the reserved entity.
   */
  async reserveFingerprint(params: {
    type: 'KU' | 'BP' | 'CX';
    quality: 'PR' | 'HY' | 'FL' | 'MN' | 'GN' | 'AR';
    shardName: ShardName;
    tags?: string[];
  }): Promise<{ fingerprint: string }>;

  /**
   * Saga Stage 2: Commits the full data to the target shard.
   * This operation writes to a potentially large data shard.
   * @throws {Error} If the write operation fails due to I/O error or other issues.
   * The Orchestrator is responsible for catching this error and initiating rollback.
   */
  async commitKnowledgeUnit(unit: KnowledgeUnit): Promise<void>;

  /**
   * Saga Stage 3: Confirms the successful completion of the operation.
   * Atomically changes the status in master_index from 'pending_creation' to 'active'.
   * This is the final step that makes the new knowledge "visible" to the rest of the system for queries.
   * @throws {Error} If the confirmation fails. Orchestrator must retry this operation.
   */
  async confirmCreation(fingerprint: string): Promise<void>;

  /**
   * Rolls back Saga Stage 1.
   * Called by the Orchestrator if Stage 2 (commitKnowledgeUnit) fails.
   * Atomically removes the 'pending_creation' entry from the master_index.
   */
  async abortCreation(fingerprint: string): Promise<void>;

  /** Promotes a hypothesis to a primary result. */
  async promoteKnowledgeUnit(fingerprint: string): Promise<void>;

  // --- Memory Lifecycle (per Pillar 8) ---

  /** Ensures the specified shards are loaded into RAM. */
  async loadShards(shards: ShardName[]): Promise<void>;

  /** Releases shards from RAM if they are no longer in use. */
  async unloadShards(shards: ShardName[]): Promise<void>;

  // --- Two-Stage Querying (per Pillar 7) ---

  /** Query Stage 1: Searches the master_index exclusively. */
  async queryMasterIndex(query: MasterIndexQuery): Promise<MasterIndexEntry[]>;

  /** Query Stage 2: Retrieves full KU objects based on fingerprints. */
  async getKnowledgeUnitsByFingerprints(fingerprints: string[]): Promise<KnowledgeUnit[]>;
}
```

### 5.2. Orchestrator - The Cognitive Core (`packages/orchestrator/src/orchestrator.ts`)
```typescript
export class Orchestrator {
  constructor(storage: Storage);

  /**
   * Main loop that listens for state changes (e.g., new tasks).
   * Implementation Note: The startListening() method will initialize a simple, in-memory TaskQueue (e.g., an array).
   * An asynchronous loop will continuously check this queue for new tasks to be processed by _handleNewUserTask,
   * ensuring sequential and orderly execution.
   */
  startListening(): void;

  /**
   * Begins the execution of a Blueprint, creating a new Cognitive Context (CX).
   * This is the main public method for initiating "thought".
   */
  async executeBlueprint(task: ExecuteBlueprintTask): Promise<{ cognitiveContextFingerprint: string }>;

  /**
   * Private method illustrating the Orchestrator's new core logic.
   * This is triggered when a high-level task is received (e.g., from the CLI or UI).
   * It no longer tries to "guess" the intent. It finds the master Blueprint and executes it.
   * For unknown tasks, it now triggers the Skill Inheritance process (Pillar 12).
   *
   * @param task The high-level task from the user, e.g., { command: "research topic", details: "3ds max vs blender" }
   */
  private async _handleNewUserTask(task: any): Promise<void> {
    // 1. Find the Master Blueprint: Find the high-level Blueprint designed to handle this type of command.
    const masterBlueprintId = await this._findMasterBlueprintForCommand(task.command);
    
    if (masterBlueprintId) {
      // 2a. If a known skill exists, execute it.
      await this.executeBlueprint({
        blueprintId: masterBlueprintId,
        input: task.details
      });
    } else {
      // 2b. If no skill exists, initiate the Skill Inheritance process.
      // This itself is a complex cognitive task, likely defined by a "learn-new-skill" master Blueprint.
      await this.executeBlueprint({
        blueprintId: 'master-learn-new-skill-from-archetype',
        input: { task }
      });
    }
  }

  // Helper methods for the above logic (conceptual)
  private async _findMasterBlueprintForCommand(command: string): Promise<string | null> { /* ... */ }
}
```

### 5.3. AwarenessEngine - The Consciousness Core (`packages/awareness-engine/src/awareness-engine.ts`)
```typescript
/**
 * The AwarenessEngine is the system's subconscious. It performs background tasks
 * related to health monitoring, self-healing, and now, long-term knowledge quality assessment.
 */
export class AwarenessEngine {
  constructor(storage: Storage);

  /**
   * Runs the self-healing process on system startup (per Pillar 10).
   */
  async runSelfHealingChecks(): Promise<void>;

  /**
   * Begins continuous monitoring of system resources.
   */
  startResourceMonitoring(): void;
}
```

---

## 6. Key Data Structures and Configuration

### 6.1. Project Structure (pnpm Monorepo)
A precise directory structure is critical for maintaining order.
```
/packages
  /jarvis-main:       Main startup file (`index.ts`) that wires all modules together.
  /memory-core:       The `Storage` class and all low-level Automerge logic.
  /orchestrator:      The `Orchestrator` class and Blueprint interpretation logic.
  /awareness-engine:  The `AwarenessEngine` class and self-healing logic.
  /shared-schema:     All key data types (`KnowledgeUnit`, etc.).
  /web-api:           Optional Express.js server for the UI.
  /cli:               Command-line tools for interacting with the system.
```
**Note on Multi-Repo Architecture:** The pnpm monorepo structure is non-negotiable. It ensures logical separation of concerns between modules (packages/*). This prevents monolithic code and guarantees that the system's components (like memory-core, orchestrator) can be developed, tested, and maintained independently, preventing architectural decay. Jarvis is a federation of collaborating packages, not a single block of code.

### 6.2. Configuration File (`jarvis-config.json`)
The `jarvis-config.json` file must exist in the `~/.jarvis/` directory. It is used for environment configuration.
```json
{
  "version": "1.0",
  "memory": {
    "directory": "~/.jarvis/memory",
    "shards": [
      "system", "master_index", "media_metadata", "entities", "concepts",
      "events", "relationships", "skills", "personal", "scratchpad"
    ]
  },
  "orchestrator": {
    "maxConcurrentContexts": 5
  },
  "awarenessEngine": {
    "resourceMonitoringIntervalMs": 5000
  }
}
```

### 6.3. Type Definitions (`packages/shared-schema/src/types.ts`)
This is the foundation of the entire system's typing. It must be absolutely precise.
```typescript
// packages/shared-schema/src/types.ts
import * as Automerge from '@automerge/automerge';

export type ShardName =
  | 'system' | 'master_index' | 'media_metadata' | 'entities' | 'concepts'
  | 'events' | 'relationships' | 'skills' | 'personal' | 'scratchpad';

// Updated Provenance definition to support Skill Inheritance
export interface Provenance {
  fingerprint: string;
  parentFingerprint?: string;
  cognitiveContextFingerprint?: string;
  // NEW FIELD: Tracks which pattern was used to create this entity.
  archetypeFingerprint?: string; // e.g., "BPv1AR-000001"
}

export interface MasterIndexEntry {
  fingerprint: string;
  shardName: ShardName;
  status: 'active' | 'pending_creation' | 'pending_update' | 'pending_deletion';
  tags: string[];
  createdAt: string; // ISO 8601
  modifiedAt: string; // ISO 8601
  title?: string;
  summary?: string;
  titleEmbedding?: number[];
}

export interface MasterIndexDoc {
  entries: Automerge.Map<string, MasterIndexEntry>; // Key is the fingerprint
}

export interface SystemDoc {
  fingerprintCounters: Automerge.Map<string, Automerge.Counter>;
  systemFlags: Automerge.Map<string, any>;
  systemLog: Automerge.List<any>;
}

export interface Relationship {
  id: string; // Its own fingerprint
  sourceFingerprint: string;
  targetFingerprint: string;
  relationType: string; // e.g., 'isA', 'partOf', 'createdBy'
  label: string; // human-readable label
  provenance: Provenance;
}

export interface KnowledgeUnit {
  id: string; // Same as provenance.fingerprint
  provenance: Provenance;
  content: any; // Structure depends on the KU type
  // ... other fields
}

// NEW Definition for Blueprint documents stored in the 'skills' shard.
export interface BlueprintDoc {
  id: string; // Fingerprint
  name: string;
  description: string;
  nodes: BlueprintNode[];
  edges: { from: string; to:string; condition?: string }[];
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

// NEW Definition for telemetry and logging.
export interface TelemetryEvent {
  timestamp: string; // ISO 8601
  type: 'execution' | 'error' | 'resource' | 'learning';
  contextFingerprint?: string;
  details: any; // e.g., { blueprintId, nodeId, status, durationMs } or { error: "..." }
}

// Extended BlueprintNode definition to support Conscious Decomposition
export interface BlueprintNode {
  nodeId: string;
  type: 'task' | 'blueprint' | 'logic' | 'explore' | 'evaluate' | 'query' | 'generate-relationships';

  // Existing fields for 'task', 'blueprint', 'logic', 'explore', 'evaluate'...

  // Field for 'query' type:
  // Defines a direct, traceable query to an external model or API.
  querySpec?: {
    target: 'local-llm' | 'web-search-api'; // The query target
    model?: string; // e.g., 'Llama3-8B-TensorRT'
    prompt: string; // Prompt template, e.g., "Compare and contrast {topicA} and {topicB}"
    outputVariable: string; // The context variable name to store the result in
  };

  // Field for 'generate-relationships' type:
  // Defines the logic for creating relationships based on existing data.
  relationshipSpec?: {
    contextSource: string; // Variable containing text or data for analysis
    entitiesSource: string[]; // Variables containing KUs to be connected
    generationPrompt: string; // LLM prompt, e.g., "Based on the text, describe the relationship between {entityA} and {entityB}"
  };
}
```
**Example of Conscious Decomposition: The "master-research-topic-and-synthesize" Blueprint**

This example illustrates how a high-level user command is broken down into a transparent sequence of auditable steps.

*User Command:* "Research topic: 3ds Max vs Blender"

*   **Node 1 (Type: `query`):**
    *   `querySpec`:
        *   `target`: `local-llm`
        *   `prompt`: "List the key features of 3ds Max."
        *   `outputVariable`: `features_3dsmax`
*   **Node 2 (Type: `query`):**
    *   `querySpec`:
        *   `target`: `local-llm`
        *   `prompt`: "List the key features of Blender."
        *   `outputVariable`: `features_blender`
*   **Node 3 (Type: `task`):**
    *   `taskSpec`: Saves the result from `features_3dsmax` as `KU-3dsMax-Features` in the `concepts.automerge` shard.
*   **Node 4 (Type: `task`):**
    *   `taskSpec`: Saves the result from `features_blender` as `KU-Blender-Features` in the `concepts.automerge` shard.
*   **Node 5 (Type: `generate-relationships`):**
    *   `relationshipSpec`:
        *   `contextSource`: "User asked to compare 3ds Max and Blender."
        *   `entitiesSource`: [`KU-3dsMax-Features`, `KU-Blender-Features`]
        *   `generationPrompt`: "Describe the relationship between these two sets of features."
    *   *Result:* Creates and saves a `Relationship` object in `relationships.automerge` like `{source: KU-3dsMax-Features, target: KU-Blender-Features, type: 'isComparableTo'}`.
*   **Node 6 (Type: `query`):**
    *   `querySpec`:
        *   `target`: `local-llm`
        *   `prompt`: "Based on these two lists of features: {features_3dsmax} and {features_blender}, write a final summary for the user."
        *   `outputVariable`: `final_summary`

*Outcome:* Every step of the "thought process" is now an explicit, traceable node in the Blueprint. The UI can visualize this as a tree, and a complete history of the reasoning process is preserved.

### 6.4. Command Line Interface (`/packages/cli`)
The CLI module is a key development and administration tool that implements the Principle of Process vs. Query Distinction at the user interface level.

**Architecture:** A Node.js application (using a library like `commander.js`) that directly imports and utilizes the `Storage` and `Orchestrator` classes.

**Example Commands:**

*   **Simple Queries (Directly to Storage):**
    *   `jarvis query --tag "invoice" --status "active"`: Executes `storage.queryMasterIndex()` and returns a list of matching `MasterIndexEntry` objects.
    *   `jarvis get KUv1PR-001234`: Executes `storage.getKnowledgeUnitsByFingerprints()` and returns the full KU object.
    *   `jarvis list-shards --loaded`: Displays a list of currently loaded shards in memory.

*   **Complex Processes (via Orchestrator):**
    *   `jarvis process-file /path/to/my/document.pdf`: Creates a task that the Orchestrator intercepts to run the `process-new-file` Blueprint. Returns the `cognitiveContextFingerprint` for tracking.
    *   `jarvis run-blueprint BPv1MN-000010 --input '{"url": "..."}'`: Directly instructs the Orchestrator to execute a specific Blueprint.

*   **Administrative Tools (via AwarenessEngine):**
    *   `jarvis system-check`: Manually triggers the self-healing process from the `AwarenessEngine` (`runSelfHealingChecks`).
    *   `jarvis system-status`: Displays the status of system resources monitored by the `AwarenessEngine`.

### 6.5. Conceptual Web API Endpoints
For UI interaction, the optional `/packages/web-api` module will expose a minimal set of RESTful endpoints:

*   **`POST /tasks`**: Submits a new high-level task to the Orchestrator (e.g., `{ command: "research topic", details: "..." }`).
*   **`GET /contexts`**: Lists all active and recent Cognitive Contexts (CX).
*   **`GET /contexts/:fingerprint`**: Retrieves the detailed state and history of a specific CX, allowing the UI to visualize the thought process.
*   **`GET /shards`**: Returns the status of memory shards (loaded/unloaded, size).

---

## 7. Testing and Validation Strategy
The reliability of the system is paramount. The following testing strategy is a minimum requirement:

*   **Unit Tests:** Each package within the monorepo (e.g., `memory-core`, `orchestrator`) must contain its own suite of unit tests covering its public methods.
*   **Integration Tests:** A dedicated `integration.test.ts` suite must exist at the root level. These tests will validate end-to-end flows without mocking the core modules.
*   **Saga Transaction Test:** A critical integration test must simulate the full Saga lifecycle (Reserve -> Commit -> Confirm) and then trigger the `AwarenessEngine`'s `runSelfHealingChecks` on a deliberately failed transaction to verify the self-healing mechanism.
*   **Skill Inheritance Test:** An integration test must verify the full Pillar 12 flow: submitting an unknown task, triggering archetype selection (with mock user input for disambiguation), and confirming that a new, valid Blueprint is created and saved.

---

## 8. Future Considerations (Post-v1.0)
This plan defines a complete, self-contained v1.0 system. The following critical topics are explicitly out of scope for the initial implementation but must be addressed in future major versions:

*   **Cross-Device Synchronization:** Implementing a secure, privacy-preserving mechanism for syncing memory shards between a user's devices.
*   **Data Security and Encryption:** While the system is local, future versions with sync capabilities will require robust, end-to-end encryption for all data at rest and in transit.
*   **User Permissions:** A granular permission system will be needed if the architecture ever evolves to support multi-user or shared contexts.