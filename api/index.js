// Vercel serverless function entry point
// This bridges ES modules (frontend) with CommonJS (backend)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const app = require('../backend/src/app');

export default app;