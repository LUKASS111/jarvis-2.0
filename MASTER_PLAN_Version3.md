# Jarvis 2.0: The Master Plan

**Document Version:** 3.0
**Status:** Ratified
**Last Updated:** 2025-10-03

## 1. Core Vision & Guiding Principles

### 1.1. Mission Statement

To architect and build a **robust, private, local-first personal intelligence system**. Jarvis 2.0 is an offline-native knowledge base and automation engine where the user has absolute sovereignty over their data. This system prioritizes architectural integrity, performance, and long-term reliability.

### 1.2. Core Architectural Tenets

1.  **Local-First & Offline-Native:** The system must be 100% functional without an internet connection. All core operations are performed on the local device.
2.  **Data Sovereignty:** All user data, encapsulated as `KnowledgeUnit` objects, resides exclusively on the user's hardware. There are no cloud dependencies for core functionality.
3.  **CRDT as the Single Source of Truth:** We explicitly use Conflict-free Replicated Data Types (CRDTs). `@automerge/automerge` manages the application's state, ensuring data consistency and enabling future peer-to-peer synchronization.
4.  **Extreme Modularity:** The system is composed of independent, decoupled modules communicating via well-defined APIs.
5.  **Schema-Driven Structure:** All information is transformed into a strongly-typed `KnowledgeUnit`. This is the foundation of all querying and intelligence.
6.  **Performance-Aware Design:** The system is designed to leverage modern hardware, intelligently scheduling tasks between the CPU and a dedicated NVIDIA GPU to maximize throughput and responsiveness.

---

## 2. Technology Stack & Hardware Environment

### 2.1. Target Environment

*   **Primary Platform:** A personal computer (PC) running a modern operating system (Windows, Linux).
*   **Hardware:** A modern multi-core CPU and a dedicated **NVIDIA GPU** (CUDA-enabled). The system architecture is designed to explicitly leverage this hardware configuration.

### 2.2. Core Technologies

*   **Language:** TypeScript
*   **Runtime:** Node.js
*   **Package & Monorepo Management:** pnpm Workspaces
*   **Core Data Layer:** `@automerge/automerge`
*   **API Framework:** Express.js

### 2.3. GPU Acceleration Strategy (NVIDIA CUDA)

The system will offload computationally intensive tasks to the NVIDIA GPU to ensure the main application remains responsive. This will be achieved via the CUDA platform.

*   **Key Principle:** CPU for I/O and orchestration; GPU for parallel computation.
*   **Integration Method:** Computationally heavy processors (e.g., for OCR, LLM inference) may be implemented as separate scripts (potentially in Python for superior library support) and invoked by the Node.js application. This maintains a clean separation of concerns.
*   **Targeted NVIDIA Libraries:**
    *   **CUDA:** For general-purpose parallel computing.
    *   **TensorRT:** For optimizing the inference performance of local Large Language Models (LLMs).
    *   **NVIDIA DALI (Data Loading Library):** For GPU-accelerated pre-processing of image and audio data.
    *   **cuDF:** For GPU-accelerated data manipulation, relevant for future large-scale analytics.

---

## 3. Module 1: The Memory Core

**Role:** The authoritative, transactional heart of the system. A local API server that manages the lifecycle of `KnowledgeUnit`s.
**Hardware Profile:** Primarily **CPU-bound**. Its tasks involve I/O, serialization, and in-memory data manipulation, which are not well-suited for GPU acceleration.

### 3.1. Storage Layer (`storage.ts`)

*   **Technology:** `@automerge/automerge`
*   **Persistence:** The entire knowledge graph is persisted to a single binary file: `jarvis.automerge.doc`.
*   **Document Structure (`JarvisDoc`):**
    ```typescript
    interface JarvisDoc {
      knowledgeUnits: Automerge.Map<KnowledgeUnit>;
      indexes: JarvisIndexes;
    }
    ```
*   **Operations:** On startup, loads the document into memory. All write operations are atomic, transactional, and save the entire document state back to disk.

### 3.2. CRDT-Native Indexing System

*   **Objective:** Provide fast, complex querying capabilities directly within the Automerge document.
*   **Implementation:** The `saveKnowledgeUnit` method is responsible for atomically updating both the data and its corresponding indexes in a single transaction.
*   **Index Structure (`JarvisIndexes`):**
    ```typescript
    interface JarvisIndexes {
      byType: { [type: string]: string[] }; // Map<type, ku_id[]>
      byTag: { [tag: string]: string[] };   // Map<tag, ku_id[]>
      byCreationDate: { [date: string]: string[] }; // Map<'YYYY-MM-DD', ku_id[]>
      invertedIndex: { [token: string]: string[] }; // Map<lowercase_token, ku_id[]>
    }
    ```

### 3.3. Memory Core API Contract (Express.js)

*   **`POST /knowledge-units`**: Creates a new Knowledge Unit.
*   **`GET /knowledge-units/:id`**: Retrieves a single Knowledge Unit.
*   **`PUT /knowledge-units/:id`**: Performs a full replacement of an existing KU, including transactional de-indexing and re-indexing.
*   **`DELETE /knowledge-units/:id`**: Tombstones a KU by setting `lifecycleStatus = 'deleted'` and de-indexing it.
*   **`GET /query/by-type/:type`**: Queries the `byType` index.
*   **`GET /query/by-tag/:tag`**: Queries the `byTag` index.

---

## 4. Module 2: The Ingestion Engine

**Role:** Autonomous services that find, process, and analyze information, converting it into structured `KnowledgeUnit`s for the Memory Core.
**Hardware Profile:** **Mixed CPU and GPU**. Watchers and basic file processors are CPU-bound. Advanced processors for images, video, and AI tasks are prime candidates for **GPU acceleration**.

### 4.1. Decoupled Architecture

*   **Watchers:** Lightweight, CPU-bound processes that monitor sources (e.g., file system, IMAP) and create jobs.
*   **Job Queue:** A simple, file-system-based queue (`queue/pending`, `queue/processing`, `queue/failed`).
*   **Processors:** The workhorses that consume jobs. They perform deep analysis and submit new KUs to the Memory Core.

### 4.2. Processor Development Roadmap & Tech Specification

1.  **`GenericFileProcessor` (CPU-Bound):**
    *   **Handles:** `.txt`, `.md`, unknown file types.
    *   **Analysis:** Populates `CoreAnalysis`. For text files, it places content into `rawContent` and runs basic `TextAnalysis`.

2.  **`ImageProcessor` (GPU-Accelerated):**
    *   **Libraries:** `sharp` (CPU for basic metadata), but heavy lifting like OCR and object detection will be offloaded.
    *   **GPU Tasks:**
        *   **OCR:** Use `tesseract.js` or a more powerful Python-based OCR engine accelerated with CUDA.
        *   **Object Detection:** Use a pre-trained model (e.g., YOLO) optimized with **TensorRT** for fast inference on the GPU.
        *   **Pre-processing:** Use **NVIDIA DALI** to decode and resize images on the GPU before analysis.

3.  **`PdfProcessor` (CPU-Bound):**
    *   **Library:** `pdf-parse`.
    *   **Analysis:** Extracts text and document metadata.

4.  **`EmailProcessor` (CPU-Bound):**
    *   **Library:** `imap-simple`, `mail-parser`.
    *   **Analysis:** Creates a primary KU for the email and, critically, **spawns new jobs** for each attachment, allowing them to be handled by specialized processors (like the `ImageProcessor`).

---

## 5. Module 3: The Automation Engine

**Role:** A proactive engine that observes the knowledge base and executes user-configured rules.
**Hardware Profile:** **Mixed CPU and GPU**. The core rule-matching engine is CPU-bound. However, actions that involve AI/LLM processing will be prime candidates for **GPU acceleration**.

### 5.1. Architecture: Trigger-Condition-Action (TCA)

*   **Triggers:** Events that initiate a rule check (e.g., "New Knowledge Unit Created").
*   **Conditions:** Logical checks performed on the triggering KU.
*   **Actions:** Tasks to be executed if conditions are met.

### 5.2. GPU-Accelerated Actions

The true power of the GPU will be unlocked here. An "Action" can be a call to a local LLM.

*   **Example Rule:**
    ```json
    {
      "ruleName": "Auto-summarize important documents",
      "trigger": "knowledge_unit.created",
      "conditions": [
        { "field": "analysis.core.baseType", "operator": "equals", "value": "document" },
        { "field": "textAnalysis.wordCount", "operator": "greaterThan", "value": 1000 }
      ],
      "actions": [
        {
          "actionType": "invoke_local_llm",
          "model": "Llama3-8B-TensorRT",
          "prompt": "Summarize the following text in five key bullet points: {rawContent}",
          "outputField": "analysis.domains.textAnalysis.abstractiveSummary"
        }
      ]
    }
    ```
*   **Implementation:** The `invoke_local_llm` action would call a local inference server (like Triton Inference Server or a custom Python script) that runs the LLM optimized with **TensorRT** on the NVIDIA GPU.

---

## 6. Module 4: The User Interface (UI)

**Role:** The human-facing layer for interacting with the Memory Core.
**Hardware Profile:** Primarily **CPU-bound**, with potential future GPU use for hardware-accelerated rendering in data visualizations.

### 6.1. Phased Development

1.  **Phase 1: CLI (Command-Line Interface):**
    *   **Technology:** Node.js.
    *   **Functionality:** A simple, powerful interface for direct API interaction. Essential for development, testing, and administration.

2.  **Phase 2: Web UI:**
    *   **Technology:** A modern web framework (e.g., SvelteKit, Next.js).
    *   **Architecture:** A pure, stateless client of the Memory Core API.
    *   **Core Features:** Omni-Search Bar, Timeline View, Detail Panel.
    *   **Future:** A graph visualization of KU relationships, potentially using WebGL for **GPU-accelerated rendering**.