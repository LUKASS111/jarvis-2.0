import express from 'express';
import { Storage } from './storage';
import { registerApiEndpoints } from './api';

const PORT = process.env.PORT || 3000;

/**
 * The main function to start the Memory Core module.
 */
async function main() {
  console.log('Starting Memory Core module...');

  // 1. Initialize the storage layer (now based on Automerge)
  const storage = new Storage();
  try {
    await storage.initialize();
  } catch (error) {
    console.error('FATAL: Failed to initialize storage. The application cannot start.');
    process.exit(1);
  }

  // 2. Setup the Express server
  const app = express();
  app.use(express.json({ limit: '10mb' })); // Use JSON middleware, allow larger payloads

  // 3. Register all API endpoints
  registerApiEndpoints(app, storage);
  console.log('API endpoints registered.');

  // 4. Define a root endpoint for a simple health check
  app.get('/', (req, res) => {
    res.status(200).send('Memory Core API (Automerge backend) is running.');
  });

  // 5. Start listening for requests
  app.listen(PORT, () => {
    console.log(`Memory Core server is listening on http://localhost:${PORT}`);
  });
}

// Run the main function and catch any top-level errors
main().catch(error => {
  console.error('An unexpected error occurred at the top level:', error);
  process.exit(1);
});
