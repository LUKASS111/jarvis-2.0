import { Express, Request, Response } from 'express';
import { Storage } from './storage';
import { KnowledgeUnit } from '@jarvis-2.0/shared-schema';
import { randomUUID } from 'crypto';

export function registerApiEndpoints(app: Express, storage: Storage) {

  /**
   * Endpoint to create a new Knowledge Unit.
   * The server is responsible for generating the ID and core timestamps.
   */
  app.post('/knowledge-units', async (req: Request, res: Response) => {
    try {
      // We expect the request body to be a partial Knowledge Unit.
      // The server will enrich it with mandatory fields.
      const partialUnit = req.body;

      if (!partialUnit.analysis?.core?.baseType || !partialUnit.source) {
        return res.status(400).json({ error: 'Request body must contain at least analysis.core.baseType and source fields.' });
      }

      const now = new Date().toISOString();

      const newUnit: KnowledgeUnit = {
        ...partialUnit,
        id: randomUUID(), // Generate a new UUID
        schemaVersion: '2.1.0',
        timestamps: {
          ...partialUnit.timestamps,
          createdAt: now,
          modifiedAt: now,
        },
      };

      await storage.saveKnowledgeUnit(newUnit);

      console.log(`Created new Knowledge Unit with ID: ${newUnit.id}`);
      res.status(201).json(newUnit);

    } catch (error: any) {
      console.error('Error creating knowledge unit:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  /**
   * Endpoint to retrieve a Knowledge Unit by its ID.
   */
  app.get('/knowledge-units/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const unit = storage.getKnowledgeUnit(id);

    if (unit) {
      res.status(200).json(unit);
    } else {
      res.status(404).json({ error: `Knowledge Unit with ID ${id} not found.` });
    }
  });
}
