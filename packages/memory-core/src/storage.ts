import sqlite3 from 'sqlite3';
import { KnowledgeUnit } from '@jarvis-2.0/shared-schema';
import path from 'path';

const DB_FILE = path.resolve(__dirname, '../jarvis.db');

export class Storage {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(DB_FILE, (err) => {
      if (err) {
        console.error('Error opening database', err.message);
      } else {
        console.log('Connected to the SQLite database.');
      }
    });
  }

  /**
   * Initializes the database by creating necessary tables if they don't exist.
   * @returns A promise that resolves when initialization is complete.
   */
  public initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const createTableSql = `
        CREATE TABLE IF NOT EXISTS knowledge_units (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          unit_data TEXT NOT NULL
        );
      `;
      this.db.run(createTableSql, (err) => {
        if (err) {
          console.error('Error creating table', err.message);
          return reject(err);
        }
        console.log('Table "knowledge_units" is ready.');
        resolve();
      });
    });
  }

  /**
   * Creates a new Knowledge Unit in the database.
   * @param unit The KnowledgeUnit object to create.
   * @returns A promise that resolves with the ID of the created unit.
   */
  public createKnowledgeUnit(unit: KnowledgeUnit): Promise<string> {
    // We will implement this in the next step.
    return Promise.resolve(unit.id);
  }

  // We will add more methods here later (get, update, delete, query)...
}
