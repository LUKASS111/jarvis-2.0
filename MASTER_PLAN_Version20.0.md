# Jarvis 2.0: The Master Plan

**Document Version:** 20.0
**Status:** Ratified
**Last Updated:** 2025-10-03

## 1. Core Vision & Guiding Principles

### 1.1. Mission Statement

To architect and build a **robust, private, local-first personal intelligence system**. Jarvis 2.0 is an offline-native, cognitive-reactive engine where the user has absolute sovereignty over their data. This system prioritizes architectural integrity, performance, and the capacity for continuous, real-time self-improvement within a framework of safety, reliability, and resilience. This version marks the transition from high-level architecture to a detailed implementation specification, defining the concrete structures and protocols necessary for development. This version formalizes the operational boundaries of the system, defining the non-negotiable distinction between complex cognitive processes and simple data retrieval, ensuring architectural purity and performance. This final version introduces the principle of Conscious Decomposition, ensuring every complex thought process is transparent, auditable, and hierarchically structured.

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

---

## 2. The Pillars of Jarvis's Cognitive Architecture

(Pillars 0 through 10 remain as defined in v17.0, establishing the core principles of Unified Process, Evolutionary Thinking, Dynamic Reflection, Transactional Memory, Safety, Skill Tree, Two-Stage Querying, Managed Memory Lifecycle, Transactional Integrity, and Self-Healing.)

### Pillar 11: Stan Świadomej Bezczynności (The State of Conscious Idleness)
*The ability to be aware without being active.*

**Role:** This pillar defines the default operational state of the system. Jarvis is not in a continuous, autonomous rush. It is in a state of passive, energy-efficient readiness.

**Implementation:**

1.  **Default State:** After startup, the main Jarvis process enters an `Idle` state. The Orchestrator is not executing any Blueprints.
2.  **Passive Awareness:** In this state, only the `AwarenessEngine` is active in the background (with minimal resource usage, e.g., <5% CPU). Its task is to:
    *   Monitor the system's health (`runSelfHealingChecks`, `startResourceMonitoring`).
    *   Maintain contextual awareness: it knows which shards are loaded, what the latest `TelemetryEvents` are, and which Blueprints are available.
3.  **User Initiative:** The system does not undertake complex actions (Blueprints) without an explicit command from the user. Commands such as "analyze pending tasks" or "research topic X" are necessary to activate the Orchestrator. The system can suggest actions in the UI, but the user is the ultimate decision-maker.

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
    quality: 'PR' | 'HY' | 'FL' | 'MN' | 'GN';
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
   * Internally, this will trigger a handler like _handleNewUserTask.
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
   *
   * @param task The high-level task from the user, e.g., { command: "research topic", details: "3ds max vs blender" }
   */
  private async _handleNewUserTask(task: any): Promise<void> {
    // 1. Find the Master Blueprint: Find the high-level Blueprint designed to handle this type of command.
    // This is a simple lookup, not a complex analysis.
    // e.g., command "research topic" maps to Blueprint "master-research-topic-and-synthesize"
    const masterBlueprintId = await this._findMasterBlueprintForCommand(task.command);
    if (!masterBlueprintId) {
      // Handle error: "I don't know how to do that."
      return;
    }

    // 2. Execute the Master Blueprint: The entire complex thought process starts here.
    // The master blueprint itself is responsible for all decomposition.
    await this.executeBlueprint({
      blueprintId: masterBlueprintId,
      input: task.details
    });
  }

  // Helper methods for the above logic (conceptual)
  private async _findMasterBlueprintForCommand(command: string): Promise<string | null> { /* ... */ }
}
```

### 5.3. AwarenessEngine - The Consciousness Core (`packages/awareness-engine/src/awareness-engine.ts`)
```typescript
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

export interface Provenance {
  fingerprint: string;
  parentFingerprint?: string;
  cognitiveContextFingerprint?: string;
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

// Extended BlueprintNode definition to support Conscious Decomposition
export interface BlueprintNode {
  nodeId: string;
  type: 'task' | 'blueprint' | 'logic' | 'explore' | 'evaluate' | 'query' | 'generate-relationships';

  // Existing fields for 'task', 'blueprint', 'logic', 'explore', 'evaluate'...

  // NEW FIELD for 'query' type:
  // Defines a direct, traceable query to an external model or API.
  querySpec?: {
    target: 'local-llm' | 'web-search-api'; // The query target
    model?: string; // e.g., 'Llama3-8B-TensorRT'
    prompt: string; // Prompt template, e.g., "Compare and contrast {topicA} and {topicB}"
    outputVariable: string; // The context variable name to store the result in
  };

  // NEW FIELD for 'generate-relationships' type:
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