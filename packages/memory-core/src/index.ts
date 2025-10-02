import express from 'express';
import { Storage } from './storage';

const PORT = process.env.PORT || 3000;

/**
 * The main function to start the Memory Core module.
 */
async function main() {
  console.log('Starting Memory Core module...');

  // 1. Initialize the storage layer
  const storage = new Storage();
  try {
    await storage.initialize();
  } catch (error) {
    console.error('FATAL: Failed to initialize storage. The application cannot start.');
    process.exit(1); // Exit the process with an error code
  }

  // 2. Setup the Express server
  const app = express();

  // Middleware to parse JSON bodies
  app.use(express.json());

  // 3. Define a root endpoint for health checks
  app.get('/', (req, res) => {
    res.status(200).send('Memory Core API is running.');
  });

  // We will add more API endpoints from `api.ts` here later.

  // 4. Start listening for requests
  app.listen(PORT, () => {
    console.log(`Memory Core server is listening on http://localhost:${PORT}`);
  });
}

// Run the main function and catch any top-level errors
main().catch(error => {
  console.error('An unexpected error occurred at the top level:', error);
  process.exit(1);
});
