# IELTS Practice Backend API

A Node.js/Express backend API for the IELTS Practice application, featuring pronunciation analysis using Azure Speech Services.

## Features

- **Pronunciation Analysis**: Real-time speech assessment using Azure Cognitive Services
- **Speech-to-Text Transcription**: Audio transcription using AssemblyAI with advanced features
- **Proxy Services**: Secure API proxying for external services
- **Rate Limiting**: Built-in request rate limiting for API protection
- **Security**: Helmet.js security headers and CORS configuration
- **Logging**: Structured logging with Winston
- **Error Handling**: Comprehensive error handling and user-friendly error messages
- **Health Checks**: Service health monitoring endpoints

## Quick Start

### Prerequisites

- Node.js 16+ and npm 8+
- Azure Speech Services API key
- AssemblyAI API key

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the server**:
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:3001`

## API Endpoints

### Pronunciation Analysis

#### `POST /api/pronunciation/assess`
Analyze pronunciation quality from uploaded audio file.

**Request**: Multipart form data
- `audio`: Audio file (WAV, MP3, M4A, WebM)
- `referenceText`: Text that should have been spoken

**Response**:
```json
{
  "success": true,
  "data": {
    "overallScore": 85,
    "wordScores": [
      {
        "word": "hello",
        "score": 90,
        "phonemes": [
          { "phoneme": "h", "score": 95 },
          { "phoneme": "ɛ", "score": 85 }
        ]
      }
    ],
    "weakWords": ["difficult"],
    "recognizedText": "hello world",
    "metadata": {
      "requestId": "abc123",
      "processingTimeMs": 1500
    }
  }
}
```

#### `POST /api/pronunciation/assess-base64`
Analyze pronunciation from base64-encoded audio data.

**Request**: JSON
```json
{
  "audioData": "data:audio/wav;base64,UklGRn...",
  "referenceText": "Hello world",
  "contentType": "audio/wav"
}
```

### Speech-to-Text Transcription

#### `POST /api/transcription/transcribe`
Transcribe uploaded audio file to text.

**Request**: Multipart form data
- `audio`: Audio file (WAV, MP3, M4A, WebM)
- `speechModel`: Speech model to use (default: "universal")
- `autoDetectLanguage`: Auto-detect language (default: false)
- `speakerLabels`: Enable speaker identification (default: false)
- `sentimentAnalysis`: Enable sentiment analysis (default: false)

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "transcript_id",
    "text": "Hello world, this is a test.",
    "confidence": 0.95,
    "words": [
      {
        "text": "Hello",
        "start": 100,
        "end": 500,
        "confidence": 0.98
      }
    ],
    "metadata": {
      "requestId": "abc123",
      "processingTimeMs": 2500
    }
  }
}
```

#### `POST /api/transcription/transcribe-url`
Transcribe audio from URL.

**Request**: JSON
```json
{
  "audioUrl": "https://example.com/audio.mp3",
  "speechModel": "universal",
  "autoDetectLanguage": true,
  "speakerLabels": false
}
```

#### `POST /api/transcription/transcribe-base64`
Transcribe base64-encoded audio data.

#### `GET /api/transcription/status/:id`
Get transcription status by AssemblyAI transcript ID.

### Proxy Services

#### `POST /api/proxy/submit`
Proxy requests to external submission API.

### Health Checks

#### `GET /health`
General service health check.

#### `GET /api/pronunciation/health`
Pronunciation service specific health check.

#### `GET /api/transcription/health`
Transcription service specific health check.

## Project Structure

```
backend/
├── src/
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   ├── config/
│   │   └── config.js       # Configuration management
│   ├── middleware/
│   │   └── errorHandler.js # Global error handling
│   ├── routes/
│   │   ├── index.js        # Route definitions
│   │   ├── pronunciation.js # Pronunciation endpoints
│   │   └── proxy.js        # Proxy endpoints
│   ├── services/
│   │   ├── pronunciationService.js # Azure Speech integration
│   │   └── transcriptionService.js # AssemblyAI integration
│   └── utils/
│       └── logger.js       # Logging utility
├── .env                    # Environment variables
├── .env.example           # Environment template
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3001 |
| `NODE_ENV` | Environment | No | development |
| `AZURE_SPEECH_KEY` | Azure Speech API key | Yes | - |
| `AZURE_SPEECH_REGION` | Azure region | No | eastus |
| `ASSEMBLYAI_API_KEY` | AssemblyAI API key | Yes | - |
| `ALLOWED_ORIGINS` | CORS allowed origins | No | localhost:5173,localhost:3000 |
| `LOG_LEVEL` | Logging level | No | debug |
| `MAX_FILE_SIZE` | Upload size limit | No | 50mb |

### Service Setup

#### Azure Speech Services Setup

1. Create an Azure Cognitive Services Speech resource
2. Copy the API key and region
3. Add them to your `.env` file

#### AssemblyAI Setup

1. Sign up for AssemblyAI account at https://www.assemblyai.com/
2. Copy API key from dashboard
3. Add `ASSEMBLYAI_API_KEY` to your `.env` file

## Development

### Scripts

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Adding New Endpoints

1. Create route file in `src/routes/`
2. Add business logic to `src/services/`
3. Register route in `src/routes/index.js`
4. Update this README

## Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin request handling
- **Rate Limiting**: Request throttling
- **Input Validation**: Request validation
- **Error Sanitization**: Safe error messages in production

## Logging

Structured logging with Winston:
- Console logging in development
- File logging in production
- Request/response logging
- Error tracking

## Error Handling

Comprehensive error handling:
- Global error middleware
- Service-specific error handling
- User-friendly error messages
- Development vs production error details

## Performance

- Request rate limiting
- File upload limits
- Memory-efficient audio processing
- Connection pooling for external APIs

## Monitoring

Health check endpoints for:
- General service health
- Azure Speech Services connectivity
- External API connectivity

## Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Run linting before committing