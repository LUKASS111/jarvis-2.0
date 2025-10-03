# Jarvis 2.0: The Master Plan

**Document Version:** 5.0
**Status:** Ratified
**Last Updated:** 2025-10-03

## 1. Core Vision & Guiding Principles

### 1.1. Mission Statement

To architect and build a **robust, private, local-first personal intelligence system**. Jarvis 2.0 is an offline-native knowledge base and automation engine where the user has absolute sovereignty over their data. This system prioritizes architectural integrity, performance, and long-term reliability.

### 1.2. Core Architectural Tenets

1.  **Local-First & Offline-Native:** The system must be 100% functional without an internet connection.
2.  **Data Sovereignty:** All user data resides exclusively on the user's hardware.
3.  **CRDT as the Single Source of Truth:** We use `@automerge/automerge` to manage the application's state, ensuring data consistency and enabling future P2P synchronization.
4.  **Extreme Modularity:** The system is composed of independent, decoupled modules communicating via well-defined APIs and a central communication bus.
5.  **Schema-Driven Structure:** All information is transformed into a strongly-typed `KnowledgeUnit`.
6.  **Performance-Aware Design:** The system is designed to leverage modern hardware, intelligently scheduling tasks between the CPU and a dedicated NVIDIA GPU.
7.  **Total Introspection:** Every significant action taken by the system must be observable and visualizable as a "blueprint" of execution.

---

## 2. Technology Stack & Hardware Environment

### 2.1. Target Environment

*   **Primary Platform:** A personal computer (PC) running a modern operating system (Windows, Linux).
*   **Hardware:** A modern multi-core CPU and a dedicated **NVIDIA GPU** (CUDA-enabled).

### 2.2. Core Technologies

*   **Language:** TypeScript (for core logic), Python (for GPU workers)
*   **Runtime:** Node.js, Python 3.10+
*   **Inter-Process Communication:** Embedded Redis (for Task Queuing & Messaging)
*   **Core Data Layer:** `@automerge/automerge`
*   **API Framework:** Express.js

### 2.3. GPU Acceleration Strategy (NVIDIA CUDA)

*   **Key Principle:** CPU (Node.js) for I/O, orchestration, and main application logic. GPU (Python) for heavy parallel computation.
*   **AI Model Management:** The system will leverage locally installed LLMs managed by tools like **Ollama**. Jarvis is a *consumer* of these models, not a manager of them.
*   **Targeted NVIDIA Libraries:**
    *   **TensorRT:** For optimizing inference performance of local LLMs.
    *   **NVIDIA DALI:** For GPU-accelerated pre-processing of image and audio data.
    *   **Python Libraries:** `torch`, `transformers`, `sentence-transformers`.

### 2.4. Internal Communication Bus (Embedded Redis)

This is the central nervous system for inter-module communication and offloading tasks.

*   **Core Principle:** Jarvis must be self-contained. Redis will **not** be an external dependency but an **internal, managed component**.
*   **Strategy:**
    1.  The main Jarvis process (Node.js) is responsible for spawning and shutting down an embedded Redis server as a managed child process upon application start/stop.
    2.  Redis binaries for target operating systems (Windows, Linux) will be bundled with the application's distribution.
    3.  For the end-user, the operation of Redis is completely transparent and requires zero configuration.
*   **GPU Task Queue (`gpu-task-queue`):** A Redis LIST where Node.js modules push jobs intended for GPU workers.
    *   **Job Schema:** A JSON string pushed to the list.
        ```json
        {
          "taskId": "uuid",
          "taskType": "ocr" | "object-detection" | "llm-inference-verify",
          "payload": { ... }, // Task-specific data, e.g., image path, text prompt
          "responseChannel": "task-result-channel:uuid" // A unique Redis channel for the result
        }
        ```
*   **GPU Workers (Python):** A pool of Python processes that perpetually listen for jobs from the `gpu-task-queue` (`BLPOP` command). They execute the task and publish the result to the specified `responseChannel`.

### 2.5. Bus Reliability and Error Handling Strategy

This strategy ensures the communication bus is robust and fault-tolerant.

*   **Task Persistence:** Jobs in the `gpu-task-queue` must survive a system restart. The embedded Redis instance will be configured to use **AOF (Append-Only File) persistence**, ensuring that pending tasks are reloaded if the main application crashes or is restarted.
*   **Error Handling:**
    *   **Response Schema:** Worker responses must follow a strict schema: `{ status: 'success' | 'error', data?: any, errorMessage?: string }`.
    *   **Timeouts:** Every job dispatched from Node.js that awaits a response must have a configurable timeout. If no response is received, the task is considered failed.
    *   **Dead-Letter Queue:** Failed tasks (due to worker error or timeout) are not discarded. They are logged to a dedicated Redis list named `dead-letter-queue` for later inspection and potential reprocessing.
*   **Asynchronous Code Management:** In the Node.js codebase, all logic for dispatching a task and waiting for its result (publishing a job and subscribing to the response channel) must be wrapped in a single helper function that returns a `Promise`. This allows for clean, readable `async/await` syntax throughout the application, avoiding "callback hell."

---

## 3. Module 1: The Memory Core

**Role:** The authoritative, transactional heart of the system.
**Hardware Profile:** Primarily **CPU-bound**.

### 3.1. Storage Layer (`storage.ts`)

*   **Technology:** `@automerge/automerge` persisted to `jarvis.automerge.doc`.
*   **Document Structure (`JarvisDoc`):** Contains `knowledgeUnits` and `indexes`.

### 3.2. CRDT-Native Indexing System

*   **Objective:** Provide fast, transactional querying capabilities directly within the Automerge document.
*   **Index Structure (`JarvisIndexes`):** `byType`, `byTag`, `byCreationDate`, `invertedIndex`.

### 3.3. Memory Core API Contract (Express.js)

*   Defines stable endpoints for all other modules: `POST /knowledge-units`, `GET /knowledge-units/:id`, `PUT /knowledge-units/:id`, `DELETE /knowledge-units/:id`, and various `/query/*` endpoints.

---

## 4. Module 2: The Ingestion Engine

**Role:** Autonomous services that find, process, and analyze information.
**Hardware Profile:** **Mixed CPU and GPU**.

### 4.1. Decoupled Architecture

*   **Watchers:** Lightweight, CPU-bound processes that monitor sources and create jobs.
*   **Job Queue (File-based):** A simple file-system queue (`queue/pending`, `queue/processing`, `queue/failed`) for discovered items.
*   **Processors:** The workhorses that consume jobs. **These processors can dispatch sub-tasks to the Global GPU Task Queue via the Internal Communication Bus.**

### 4.2. Processor Example: `ImageProcessor`

1.  Picks up a job for `image.jpg`.
2.  **CPU Task:** Uses `sharp` to quickly extract dimensions and EXIF data.
3.  **GPU Task Dispatch:** Pushes a job to the Redis `gpu-task-queue`.
4.  Waits for the OCR result on the response channel (using the Promise-based helper).
5.  Once the result is received, it constructs the full `KnowledgeUnit` and submits it to the Memory Core.

---

## 5. Module 3: The Automation Engine

**Role:** A proactive engine that executes user-configured rules.
**Hardware Profile:** **Mixed CPU and GPU**.

### 5.1. Architecture: Trigger-Condition-Action (TCA)

*   **Triggers:** Events that initiate a rule check (e.g., "New Knowledge Unit Created").
*   **Conditions:** Logical checks performed on the triggering KU.
*   **Actions:** Tasks to be executed. These can be simple CPU-bound tasks or complex GPU-accelerated ones.

### 5.2. Action Example: LLM Verification

*   **Rule:** "When a text document is ingested from a web scrape, verify its summary."
*   **Action `multi_llm_verify`:**
    1.  **CPU:** The engine identifies the `rawContent` of the KU.
    2.  **GPU Task Dispatch:** It pushes 3 separate jobs to the Redis `gpu-task-queue`, one for each local Ollama model.
    3.  Asynchronously collects the 3 summaries using `Promise.all` on the helper functions.
    4.  **CPU:** Compares the results, synthesizes a new "truth," and updates the `KnowledgeUnit` via the Memory Core API.

---

## 6. Module 4: The User Interface (UI)

**Role:** The human-facing layer for interacting with the system.
**Hardware Profile:** Primarily **CPU-bound**, with GPU use for hardware-accelerated rendering.

### 6.1. Phased Development

1.  **Phase 1: CLI (Command-Line Interface):** A powerful Node.js interface for direct API interaction.
2.  **Phase 2: Web UI:** A single-page application that serves as the primary graphical interface.

### 6.2. Core UI/UX Philosophy: The Morphing Interface

The Web UI is envisioned as a **single-window, morphable interface** that contextually adapts its layout and controls based on the user's current task.

*   **Example 1: Searching:** The interface is dominated by the `Omni-Search Bar` and a list of results.
*   **Example 2: Analyzing a KU:** The interface morphs to show a rich detail panel for the KU on one side and a graph of its relations on the other.
*   **Example 3: Debugging an Automation:** The interface transforms into the **Blueprint View** provided by the Introspection Engine.

### 6.3. Core Web UI Components

*   **Technology:** SvelteKit or Next.js.
*   **Components:** Omni-Search Bar, Timeline View, Detail Panel, and the embedded Blueprint Visualizer.

---

## 7. Module 5: The Introspection Engine (Blueprint Visualizer)

**Role:** Provides radical transparency into the system's internal operations. It answers the question, "What is Jarvis doing and thinking?"
**Hardware Profile:** **CPU-bound** (for data aggregation) and **GPU-accelerated** (for rendering).

### 7.1. Architecture: System-Wide Telemetry Bus

*   **Technology:** **Redis Streams**.
*   **Justification:** We use Redis Streams instead of simple Pub/Sub because Streams provide message persistence and allow consumers (like the Introspection Engine) to read the event history, even if they were temporarily offline. This guarantees that no telemetry data is lost.
*   **Event Emitters:** All modules (`Memory Core`, `Ingestion Engine`, `Automation Engine`) are instrumented to emit telemetry events to a standardized Redis Stream (e.g., `jarvis-telemetry`).
*   **Event Schema:**
    ```json
    {
      "eventId": "uuid",
      "timestamp": "iso_timestamp",
      "sourceModule": "IngestionEngine.ImageProcessor",
      "eventType": "task.started" | "task.completed" | "task.failed" | "api.call" | "gpu.dispatch",
      "details": {
        "taskId": "...",
        "message": "Starting OCR on image.jpg",
        "parentTaskId": "..." // Links events into a causal chain
      }
    }
    ```

### 7.2. The Blueprint Visualizer

*   **Data Aggregation (CPU):** The Introspection Engine runs a dedicated process that subscribes to the `jarvis-telemetry` stream. It consumes the stream of events and builds a real-time graph model of the system's execution flow in memory.
*   **Rendering (GPU):** This execution graph is served to the Web UI, which uses a WebGL-based library (e.g., `vis.js`, `D3.js`) to draw it as an interactive, animated "map of the brain." Users can click on nodes to see the details of each event, watch data flow through the system in real time, and diagnose issues visually.