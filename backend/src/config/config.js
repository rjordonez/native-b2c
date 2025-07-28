// Load environment variables
const path = require('path');

// In development, load from backend/.env
// In production, Vercel provides them automatically
if (process.env.NODE_ENV !== 'production') {
  const backendEnvPath = path.join(__dirname, '../../.env');
  require('dotenv').config({ path: backendEnvPath });
}

const config = {
  // Server configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // CORS configuration
  allowedOrigins: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:5173', 'http://localhost:3000'],
  
  // Azure Speech Service configuration
  azure: {
    speechKey: process.env.AZURE_SPEECH_KEY,
    speechRegion: process.env.AZURE_SPEECH_REGION || 'eastus',
    endpoint: process.env.AZURE_SPEECH_ENDPOINT
  },
  
  // AssemblyAI Speech-to-Text configuration
  assemblyAI: {
    apiKey: process.env.ASSEMBLYAI_API_KEY
  },
  
  // LiveKit configuration (if needed)
  livekit: {
    url: process.env.LIVEKIT_URL,
    apiKey: process.env.LIVEKIT_API_KEY,
    apiSecret: process.env.LIVEKIT_API_SECRET
  },
  
  // External API endpoints
  externalApis: {
    submissionUrl: process.env.SUBMISSION_API_URL || 'https://classconnect-staging-107872842385.us-west2.run.app/api/v1/submission/submit'
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    format: process.env.LOG_FORMAT || 'combined'
  },
  
  // File upload limits
  upload: {
    maxFileSize: process.env.MAX_FILE_SIZE || '50mb',
    allowedMimeTypes: ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/m4a']
  }
};

// No validation - let services handle missing keys individually

module.exports = config;