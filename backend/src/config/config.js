require('dotenv').config();

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

// Validate required environment variables
const requiredEnvVars = ['AZURE_SPEECH_KEY', 'ASSEMBLYAI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

module.exports = config;