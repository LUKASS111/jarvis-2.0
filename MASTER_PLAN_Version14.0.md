# Jarvis 2.0: The Master Plan

**Document Version:** 14.0
**Status:** Ratified
**Last Updated:** 2025-10-03

## 1. Core Vision & Guiding Principles

### 1.1. Mission Statement

To architect and build a **robust, private, local-first personal intelligence system**. Jarvis 2.0 is an offline-native, cognitive-reactive engine where the user has absolute sovereignty over their data. This system prioritizes architectural integrity, performance, and the capacity for continuous, real-time self-improvement within a framework of safety and transparency.

### 1.2. Core Architectural Tenets

1.  **Local-First & Offline-Native:** The system must be 100% functional without an internet connection.
2.  **Federated Memory Architecture:** Jarvis operates on a sharded memory model, dynamically loading domain-specific knowledge into RAM to ensure massive scalability.
3.  **CRDT as the Unified State:** `@automerge/automerge` is the single source of truth, persisted across multiple sharded, incrementally-saved files.
4.  **Cognitive-Reactive Orchestration:** A central **Orchestrator** acts as a universal interpreter for procedural "blueprints," capable of hypothesis testing, dynamic reflection, and multi-level learning.
5.  **Self-Contained Environments:** The system is entirely responsible for managing its own isolated execution environments for all workers, ensuring zero external dependency conflicts.
6.  **UI as a Function of State:** The user interface is not a set of pages, but a single, morphing canvas that visually represents the system's current cognitive state.
7.  **Total Introspection & Explainability:** Every significant action and "thought" taken by the system is recorded, linked, and fully auditable through a hierarchical context.

### 1.3. The Knowledge Fingerprint: A Universal Identifier

The "Knowledge Fingerprint" is a universal, structured, and chronologically sortable identifier assigned to every core entity within the system. It is the central mechanism for establishing provenance, quality, and an auditable timeline of the system's "thoughts" and "skills".

**Format:** `[TT][VV][QQ]-[SEQUENCE]`

*   **TT (2 chars) - Type:** Defines the entity type (`KU` for KnowledgeUnit, `BP` for Blueprint, `CX` for CognitiveContext).
*   **VV (2 chars) - Version:** The schema version of the fingerprint itself (e.g., `v1`).
*   **QQ (2 chars) - Quality Qualifier:** Encodes the context of the entity's creation. This allows the system to instantly distinguish between validated knowledge, hypotheses, failures, and trusted sources.
    *   `PR`: **Primary Result** - The final, "winning" outcome, validated by the system (e.g., through an `evaluate` node). This is trusted, successful knowledge.
    *   `HY`: **Hypothesis** - An intermediate result from an `explore` node, not selected as the final outcome. This is a "what if" scenario.
    *   `FL`: **Failure** - A recorded result of a failed attempt. This is a "negative memory" or "scar," crucial for avoiding repeated mistakes.
    *   `MN`: **Manual** - A resource (typically a Blueprint) created directly by a human user. Inherently trusted.
    *   `GN`: **Genesis** - Innate knowledge provided with the system distribution. The system's foundational, built-in knowledge.
*   **SEQUENCE (6+ chars):** A zero-padded, monotonically increasing counter, unique within its own category (TT+QQ). This makes fingerprints chronologically sortable by default.

---

## 2. The Pillars of Jarvis's Cognitive Architecture

Jarvis 2.0 is built upon interconnected pillars that together create a system capable of complex thought, learning, and autonomous operation that is efficient, safe, and transparent.

---

### **Pillar 1: Myślenie Ewolucyjne (Evolutionary Thinking)**
*The ability to learn from outcomes.*

**Role:** This pillar defines the Orchestrator's capacity to test multiple approaches to a problem, evaluate their results, and learn from the outcome, including failures.

*   **The Evolutionary Loop (Fingerprint-Aware):**
    1.  **Hypothesis Phase (`explore` node):** The Orchestrator executes all hypotheses. Each resulting KnowledgeUnit is created with a `HY` (Hypothesis) fingerprint (e.g., `KUv1HY-000123`).
    2.  **Evaluation Phase (`evaluate` node):** The Orchestrator selects a "winning" result.
    3.  **Adaptation Phase (Learning & Promotion):** In a single transaction, the Orchestrator finds the winning KnowledgeUnit and **promotes** its fingerprint's quality qualifier from `HY` to `PR` (Primary Result). The "losing" hypotheses remain as `HY` units, and any that failed are explicitly marked with `FL` fingerprints. This creates a rich memory of what worked, what didn't, and what was simply an alternative path.

---

### **Pillar 2: Dynamiczna Refleksja (Dynamic Reflection)**
*The ability to learn efficiently in the moment.*

**Role:** This pillar transforms Blueprints from static recipes into dynamic dialogues with the system's own experience, enabling real-time optimization *during* execution.

*   **The Reflective Execution Cycle (Fingerprint-Aware):**
    *   **Strategic Reflection:** At the start of a batch operation, the Orchestrator performs a reflection query. This query is now specifically designed to leverage fingerprints. For example, a query for "Find last successful execution of similar task" is translated into a storage query for KnowledgeUnits where the fingerprint matches `KUv1PR-*`. Crucially, it also queries for `KUv1FL-*` to actively avoid repeating known failures. It explicitly ignores `HY` (Hypothesis) units for decision-making, ensuring the system learns only from its validated successes and documented failures.

---

### **Pillar 3: Inteligencja Pamięci i Wyjaśnialność (Memory Intelligence & Explainability)**
*The ability to manage, recall, and explain the evolution of knowledge.*

**Role:** This pillar provides the scalable foundation for the system's knowledge and an auditable history of its skills and decisions.

*   **Federated Storage Manager:** Manages a directory of sharded Automerge documents.
*   **Atomic Fingerprint Generation:**
    *   **Problem:** `randomUUID()` is insufficient. A central, transactional mechanism is needed to create sequential, unique fingerprints.
    *   **Solution:** The `system.automerge.doc` shard will contain a new map: `fingerprintCounters`. This map will hold `Automerge.Counter` objects for every valid TT+QQ combination. A new internal method in the `Storage` class, `generateFingerprint(type, quality)`, will be called *inside* an `Automerge.change` transaction. This method atomically increments the correct counter and returns a complete, unique fingerprint.
*   **Modified Save Logic:** The `saveKnowledgeUnit` method must be updated. Instead of assigning a `randomUUID`, it must now call `generateFingerprint` to create the new ID. At this point, it must also fully populate the `provenance` field of the new `KnowledgeUnit`.

---

### **Pillar 4: Bezpieczeństwo i Samowystarczalność (Innate Safety & Self-Sufficiency)**
*The ability to operate safely and autonomously from the first moment.*

**Role:** This pillar ensures Jarvis is useful and safe "out of the box" by providing it with innate knowledge and an unshakeable ethical compass.

*   **Innate Knowledge:** The Jarvis distribution includes a starter set of common Blueprints and KnowledgeUnits, all with `GN` (Genesis) fingerprints.
*   **Core Ethics (The Safety Mechanism):**
    *   **Mandatory Verification (Fingerprint-Aware):** Before executing any action generated by a Blueprint that does **not** have a `MN` (Manual) or `GN` (Genesis) qualifier in its fingerprint, the Orchestrator is required to run the `core-ethics-check.blueprint`. This creates a system of trust: manually created and innate Blueprints are trusted more than those generated or modified by the system itself.

---

### **Pillar 5: Interfejs Morfujący i Hierarchiczna Introspekcja (Morphing Interface & Hierarchical Introspection)**
*The ability to communicate its inner state and explain its reasoning.*

**Role:** This pillar defines the UI as a window into the system's "mind," capable of not just showing what it's doing, but explaining *why*.

*   **Cognitive Context Fingerprint (`cognitiveContextFingerprint`):** When a top-level task begins, the Orchestrator creates a unique fingerprint with a `CX` type (e.g., `CXv1PR-000001`). This fingerprint is the root identifier for the entire "thought process" and is propagated to all children entities via the `provenance` field.
*   **The Cognitive Tree View:** The Blueprint Visualizer allows a user to provide a `cognitiveContextFingerprint` to see a complete, interactive, hierarchical tree of the entire thought process, linking every action, decision, and piece of generated knowledge back to its origin.

---

### **NEW - Pillar 6: Drzewo Umiejętności (The Skill Tree) - A Living Cognitive Map**
*The ability to structure procedural knowledge as an evolving, hierarchical network.*

**Role:** This new pillar fundamentally redefines Blueprints from static, isolated scripts into a dynamic, interconnected network of procedural knowledge. The Skill Tree is a cognitive map of everything Jarvis "knows how to do," including both successful and failed pathways.

#### **Key Principles**

1.  **Hierarchical Composition:** A Blueprint is formally defined as an entity that can be a "child" of another Blueprint. This parent-child relationship is explicitly recorded in the `provenance` field of each Blueprint.
    *   **Example:** A Blueprint with the fingerprint `BPv1MN-000123` and description `"Run sharpening filter in Photoshop"` has a `parentFingerprint` field pointing to `BPv1MN-000088`, which corresponds to the `"Use Photoshop"` Blueprint. This, in turn, might have a parent pointing to `"Use graphic design software"`. This creates a browsable, logical hierarchy of skills.

2.  **Evolution through Branching (Branching Evolution):** Blueprints do not have linear versions (v1, v2). They grow. When the system encounters a new problem within an existing Blueprint, the `explore` node allows it to dynamically test new hypotheses. The results of these tests—both successes (`PR`) and failures (`FL`)—are permanently added as new "branches" to the Skill Tree, associated with the parent Blueprint. The original Blueprint isn't replaced; it is expanded.

3.  **Persistence of Negative Knowledge:** Failed pathways, marked with `FL` fingerprints, are not discarded. They are integral and valuable parts of the Skill Tree. They serve as "negative memories" or "scars" that the system actively uses during the Dynamic Reflection phase to avoid repeating mistakes, making its learning process more robust and efficient.

---

## 3. Data Schema & Structure Updates

### 3.1. The `Provenance` Interface
This new interface is the connective tissue of the Skill Tree and is mandatory for all fingerprinted entities.

```typescript
// New structure, essential for explainability and building the Skill Tree
interface Provenance {
  fingerprint: string;                  // The entity's own unique fingerprint (e.g., "KUv1PR-000456")
  parentFingerprint?: string;            // Fingerprint of the Blueprint that created it (the "branch" it grew from)
  cognitiveContextFingerprint?: string;  // The root fingerprint of the entire thought process
}
```

### 3.2. `KnowledgeUnit` and `BlueprintDefinition` Updates
The following interfaces must be updated to include the `provenance` field.

```typescript
// packages/shared-schema/src/types.ts
export interface KnowledgeUnit {
  // ... all existing fields from shared-schema
  provenance: Provenance;
}

// Stored in system.automerge.doc
interface BlueprintDefinition {
  // ... all existing fields
  provenance: Provenance;
}
```

### 3.3. `system.automerge.doc` Structure Update
The system shard must be updated to include the central counters for generating fingerprints.

```typescript
// Inside the Automerge document for the 'system' shard
interface SystemShardDoc {
  // ... existing structures (taskQueue, systemLog, etc.)
  fingerprintCounters: Automerge.Map<{
    'KUv1PR': Automerge.Counter;
    'KUv1HY': Automerge.Counter;
    'KUv1FL': Automerge.Counter;
    'BPv1MN': Automerge.Counter;
    // ... and so on for every valid TT+QQ combination
  }>;
}
```