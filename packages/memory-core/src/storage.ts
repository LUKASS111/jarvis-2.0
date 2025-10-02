import * as Automerge from '@automerge/automerge';
import { KnowledgeUnit } from '@jarvis-2.0/shared-schema';
import * as fs from 'fs/promises';
import * as path from 'path';

// This defines the structure of our entire database document.
// It's an Automerge document that contains a map of KnowledgeUnits.
interface JarvisDoc {
  knowledgeUnits: Automerge.Map<KnowledgeUnit>;
  // This is where our custom index will live.
  // We will build this out later.
  // Example: indexes: { byType: { 'document': ['id1', 'id2'] } }
  indexes: Automerge.Map<{ [key: string]: any }>;
}

const DOC_FILE = path.resolve(__dirname, '../jarvis.automerge.doc');

export class Storage {
  private doc: Automerge.Doc<JarvisDoc>;

  constructor() {
    // Initialize with an empty document structure.
    this.doc = Automerge.init<JarvisDoc>();
    console.log('In-memory Automerge document initialized.');
  }

  /**
   * Initializes the storage by loading the Automerge document from disk if it exists.
   */
  public async initialize(): Promise<void> {
    try {
      const fileData = await fs.readFile(DOC_FILE);
      // Load the document from the binary data.
      this.doc = Automerge.load<JarvisDoc>(fileData);
      console.log(`Automerge document loaded from ${DOC_FILE}.`);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, which is fine on first run.
        // We will create it on the first save.
        console.log('No existing document found. A new one will be created on first save.');
        // We need to initialize the maps within the new document.
        this.doc = Automerge.change(this.doc, (d) => {
            d.knowledgeUnits = new Automerge.Map<KnowledgeUnit>();
            d.indexes = new Automerge.Map<{ [key: string]: any }>();
        });
      } else {
        console.error('Error loading Automerge document', error);
        throw error; // Propagate the error
      }
    }
  }

  /**
   * Saves the entire Automerge document to a binary file on disk.
   */
  private async save(): Promise<void> {
    const fileData = Automerge.save(this.doc);
    await fs.writeFile(DOC_FILE, fileData);
    console.log(`Document saved to ${DOC_FILE}.`);
  }

  /**
   * Creates or updates a Knowledge Unit.
   * This is the core "write" operation.
   * @param unit The KnowledgeUnit object to create/update.
   * @returns A promise that resolves when the operation is complete.
   */
  public async saveKnowledgeUnit(unit: KnowledgeUnit): Promise<void> {
    const newDoc = Automerge.change(this.doc, (d) => {
      // Add or overwrite the knowledge unit in the map.
      d.knowledgeUnits.set(unit.id, unit);

      // --- Our Future Indexing Logic Will Go Here ---
      // For example:
      // const type = unit.analysis.core.baseType;
      // if (!d.indexes.byType) d.indexes.byType = {};
      // if (!d.indexes.byType[type]) d.indexes.byType[type] = [];
      // if (!d.indexes.byType[type].includes(unit.id)) {
      //   d.indexes.byType[type].push(unit.id);
      // }
      // ------------------------------------------------
    });

    this.doc = newDoc;
    await this.save(); // Persist changes to disk
  }

  /**
   * Retrieves a Knowledge Unit by its ID.
   * @param id The UUID of the unit.
   * @returns The KnowledgeUnit object or undefined if not found.
   */
  public getKnowledgeUnit(id: string): KnowledgeUnit | undefined {
    return this.doc.knowledgeUnits.get(id);
  }
}
