# Claude Project Rules

## Project Overview
This is a React TypeScript application with Redux Toolkit state management, featuring a sidebar navigation and multiple pages.

## Architecture & Folder Structure

### Feature-Based Organization
```
src/
├── features/              # Feature modules (home, about, dashboard)
│   ├── [feature]/
│   │   ├── [Feature]Page.tsx    # Main page component
│   │   ├── [feature]Slice.ts    # Redux slice for feature
│   │   ├── types.ts             # Feature-specific types
│   │   └── components/          # Feature-specific components
├── shared/                # Shared components and utilities
│   ├── components/
│   │   ├── layout/        # Layout components (Sidebar, Layout)
│   │   └── ui/           # Reusable UI components
│   │       ├── Button.tsx     # Form controls
│   │       ├── display/       # Display components (Card, CardHeader)
│   │       └── feedback/      # Feedback components (ProgressBar)
│   ├── hooks/            # Custom hooks
│   └── types/            # Shared TypeScript types
├── store/                # Redux store configuration
│   ├── index.ts          # Store setup
│   ├── types.ts          # Redux types (RootState, AppDispatch)
│   └── slices/           # Global slices (navigation)
├── constants/            # App constants (routes, etc.)
├── utils/               # Utility functions
└── styles/              # Global styles
```

## Coding Standards

### TypeScript
- Use strict TypeScript with proper type annotations (tsconfig.json configured)
- Define interfaces in `types.ts` files within each feature
- Use Redux Toolkit's typed hooks: `useAppSelector` and `useAppDispatch` from `src/store/hooks.ts`
- Path aliases configured for `@/` imports

### Redux Best Practices
- Use Redux Toolkit slices for state management
- Keep feature-specific state in feature slices
- **ALWAYS use typed hooks**: `useAppSelector` and `useAppDispatch` instead of untyped hooks
- Follow immutable update patterns
- Store types defined in `src/store/types.ts`

### Component Structure
- Use functional components with TypeScript
- Props interfaces should be clearly defined
- Prefer composition over inheritance
- Keep components focused and single-purpose
- Use `useMemo` for expensive calculations and data transformations
- Avoid direct DOM manipulation - use React state and refs instead
- Extract hardcoded data to constants files (e.g., `constants/dashboardData.ts`)

### Component Organization
- **Feature Components**: Place feature-specific components in `features/[feature]/components/`
- **Shared UI Components**: Located in `shared/components/layout/ui/` (shadcn/ui style)
  - Use proper component structure: `Card` → `CardHeader` → `CardTitle` + `CardContent`
  - Import components individually: `import { Button } from 'path/to/button'`
  - All components use Tailwind CSS custom properties for theming
- **Layout Components**: Keep in `shared/components/layout/`
- **Constants**: Extract data to `features/[feature]/constants/` files
- Use barrel exports (index.ts) for clean imports
- Prefer shared components over duplicated patterns

### Naming Conventions
- Components: PascalCase (e.g., `HomePage.tsx`, `DashboardCard.tsx`)
- Files: PascalCase for components, camelCase for utilities
- Redux slices: camelCase with "Slice" suffix (e.g., `homeSlice.ts`)
- Types: PascalCase interfaces (e.g., `ButtonProps`, `HomeState`)

### Styling
- Use Tailwind CSS for styling with custom properties (CSS variables)
- shadcn/ui components with proper theming support
- Responsive design with mobile-first approach
- Consistent spacing and color schemes using design tokens
- Accessible focus states and interactions
- CSS custom properties defined in `src/index.css` for theming

## Key Features

### Navigation
- Fixed sidebar with icon-based navigation
- React Router for page routing
- Redux state for navigation management

### State Management
- Redux Toolkit for global state
- Feature-based slices for modular state
- TypeScript integration for type safety

### UI Components
- Reusable Button component with variants
- Responsive layout system
- Card-based content organization

### Core Features
- IELTS preparation dashboard with practice tracking
- Activity calendar with test date visualization
- Practice progress tracking and checklists
- Speaking test preparation components
- Topic library for practice materials
- AI chat interface for IELTS practice conversations

### Chat Feature Details
- **Real-time conversation interface** for IELTS practice
- **Multiple conversation management** with conversation history
- **AI-powered responses** (currently simulated, ready for API integration)
- **Message persistence** with Redux state management
- **Conversation editing** (rename, delete conversations)
- **Typing indicators** and loading states
- **Responsive design** with sidebar for conversation list
- **Auto-scrolling** messages for better UX

## Development Guidelines

### Adding New Features
1. Create feature folder under `src/features/`
2. Add page component, slice, and types
3. Register slice in store configuration
4. Add route to constants and routing

### Component Development
- Start with shared components when possible
- Create feature-specific components in feature folders
- Use TypeScript interfaces for all props
- Follow established patterns for consistency
- **ALWAYS import typed Redux hooks**: `import { useAppSelector, useAppDispatch } from '../../store/hooks'`
- Use `useMemo` for performance optimization
- Extract complex data to constants files

### WaveSurfer State Management
- **DO NOT put WaveSurfer UI state in Redux** - Use WaveSurfer's internal state instead
- **Redux**: Only for persistent/shared state (audioUrl, audioData, recordingState)
- **Local State**: UI-only state (currentTime, totalDuration from WaveSurfer events)
- **WaveSurfer Internal**: Play/pause state (`wavesurferRef.current?.isPlaying()`)
- Use `forceUpdate({})` to trigger re-renders when WaveSurfer state changes
- **Avoid Redux for**: `isWaveformPlaying`, `currentTime`, `totalDuration` - these are transient UI states

### Testing & Quality
- Run `npm run build` to check for TypeScript errors
- Run `npm run lint` for ESLint validation
- Test responsive behavior on different screen sizes
- Verify Redux state updates work correctly
- Ensure all components use typed Redux hooks

## Dependencies

### Frontend
- React 19+ with TypeScript (strict mode)
- Redux Toolkit with typed hooks for state management
- React Router v7 for navigation
- Tailwind CSS with custom properties for styling
- shadcn/ui component library (customized)
- Vite for build tooling with path aliases
- Phosphor React for icons
- Motion for animations

### Backend
- **Express.js** with professional API structure
- **Azure Speech Services** integration for pronunciation analysis
- **AssemblyAI** integration for speech-to-text transcription
- **Winston** structured logging system
- **Helmet.js** security middleware
- **Rate limiting** and request validation
- **Multer** for file upload handling
- **CORS** support for cross-origin requests
- **Comprehensive error handling** with user-friendly messages

## Development Commands

### Frontend
- `npm run dev` - Start frontend development server
- `npm run build` - Build for production (with TypeScript checking)
- `npm run lint` - Run ESLint validation
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start backend development server with auto-reload (port 3001)
- `npm start` - Start backend production server
- `npm run lint` - Run ESLint validation
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm test` - Run backend tests
- `npm run test:watch` - Run tests in watch mode

### Full Stack Development
- **Frontend**: Run `npm run dev` in root directory
- **Backend**: Run `npm run dev` in backend directory
- **Concurrent**: Use concurrently to run both servers

## Backend API Endpoints

### Pronunciation Analysis
- **POST** `/api/pronunciation/assess` - Analyze uploaded audio file pronunciation
  - Body: `multipart/form-data` with `audio` file and `referenceText`
  - Returns: Pronunciation scores, word-level analysis, and phoneme scores
- **POST** `/api/pronunciation/assess-base64` - Analyze base64 audio data
  - Body: `{ audioData, referenceText, contentType }`
  - Returns: Same pronunciation analysis results

### Speech-to-Text Transcription
- **POST** `/api/transcription/transcribe` - Transcribe uploaded audio file to text
  - Body: `multipart/form-data` with `audio` file and optional transcription settings
  - Returns: Transcribed text, confidence scores, and word timestamps
- **POST** `/api/transcription/transcribe-url` - Transcribe audio from URL
  - Body: `{ audioUrl, speechModel, autoDetectLanguage, speakerLabels, ... }`
  - Returns: Transcription results with metadata
- **POST** `/api/transcription/transcribe-base64` - Transcribe base64 audio data
  - Body: `{ audioData, contentType, transcriptionOptions }`
  - Returns: Transcription results with processing info
- **GET** `/api/transcription/status/:id` - Get transcription status by ID
  - Returns: Current status and results if completed

### Proxy Services  
- **POST** `/api/proxy/submit` - Proxy external API submissions
  - Body: `{ audio_urls, submission_url }`
  - Forwards requests to external submission API

### Health & Monitoring
- **GET** `/health` - General service health check
- **GET** `/api/pronunciation/health` - Pronunciation service health
- **GET** `/api/transcription/health` - Transcription service health
- **GET** `/api/proxy/health` - Proxy service health
- **GET** `/api/` - API information and available endpoints

### Security Features
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **File Upload Limits**: 50MB maximum file size
- **CORS Protection**: Configurable allowed origins
- **Request Validation**: Input sanitization and validation
- **Error Sanitization**: Safe error messages in production

## File Structure
```
├── src/                       # Frontend React application
│   ├── features/
│   │   ├── chat/              # Chat feature
│   │   │   ├── ChatPage.tsx   # Main chat interface
│   │   │   ├── chatSlice.ts   # Redux state management
│   │   │   ├── types.ts       # TypeScript interfaces
│   │   │   └── constants/     # Chat-specific data
│   │   ├── library/           # Topic library feature
│   │   └── [feature]/
│   │       ├── constants/     # Feature-specific data
│   │       └── components/    # Feature components
│   ├── shared/components/layout/ui/  # shadcn/ui components
│   ├── store/
│   │   └── hooks.ts          # Typed Redux hooks
│   ├── utils/
│   │   └── cn.ts             # Class name utility
│   └── main.tsx              # Entry point (TypeScript)
├── backend/                   # Backend Express server
│   ├── src/                  # Source code
│   │   ├── app.js           # Express app configuration
│   │   ├── server.js        # Server entry point
│   │   ├── config/
│   │   │   └── config.js    # Configuration management
│   │   ├── middleware/
│   │   │   └── errorHandler.js # Global error handling
│   │   ├── routes/
│   │   │   ├── index.js     # Route definitions
│   │   │   ├── pronunciation.js # Pronunciation endpoints
│   │   │   └── proxy.js     # Proxy endpoints
│   │   ├── services/
│   │   │   └── pronunciationService.js # Azure Speech integration
│   │   └── utils/
│   │       └── logger.js    # Logging utility
│   ├── .env                 # Environment variables
│   ├── .env.example         # Environment template
│   ├── package.json         # Backend dependencies and scripts
│   ├── README.md           # Backend documentation
│   └── node_modules/        # Backend dependencies
├── .env.example              # Frontend environment template
└── tsconfig.json             # TypeScript configuration
```

## Backend Environment Setup

### Required Environment Variables
```bash
# Copy template and configure
cp backend/.env.example backend/.env

# Required: Azure Speech Service API key (for pronunciation analysis)
AZURE_SPEECH_KEY=your_azure_speech_key_here
AZURE_SPEECH_REGION=eastus

# Required: AssemblyAI API key (for speech-to-text transcription)
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here

# Optional: Server configuration
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Service Setup

#### Azure Speech Services Setup (for pronunciation analysis)
1. Create Azure Cognitive Services Speech resource
2. Copy API key and region from Azure portal
3. Add to backend/.env file
4. Test with `/api/pronunciation/health` endpoint

#### AssemblyAI Setup (for speech-to-text transcription)
1. Sign up for AssemblyAI account at https://www.assemblyai.com/
2. Copy API key from dashboard
3. Add `ASSEMBLYAI_API_KEY` to backend/.env file
4. Test with `/api/transcription/health` endpoint

## Backend Best Practices Implemented

### Architecture & Structure
- **Separation of Concerns**: Routes, services, middleware, and utilities properly separated
- **Configuration Management**: Centralized config with environment validation
- **Professional Project Structure**: Follows Node.js/Express best practices
- **Modular Design**: Easy to extend with new services and endpoints

### Security & Performance
- **Security Headers**: Helmet.js protection against common vulnerabilities
- **Rate Limiting**: 100 requests per 15 minutes to prevent abuse
- **CORS Protection**: Configurable allowed origins
- **Input Validation**: Request validation and sanitization
- **File Upload Security**: Size limits and MIME type validation
- **Error Sanitization**: Development vs production error messages

### Logging & Monitoring
- **Structured Logging**: Winston logger with different levels
- **Request Tracking**: Unique request IDs for tracing
- **Health Checks**: Service-specific health monitoring
- **Performance Metrics**: Request timing and processing duration
- **Error Tracking**: Comprehensive error logging with context

### Development Experience
- **Hot Reload**: Nodemon for development server auto-restart
- **Environment Templates**: .env.example for easy setup
- **NPM Scripts**: Comprehensive script collection for all tasks
- **Documentation**: Detailed README and API documentation
- **Code Quality**: ESLint configuration and testing setup

### Error Handling
- **Global Error Handler**: Centralized error processing
- **Service-Specific Errors**: Azure Speech API error handling
- **User-Friendly Messages**: Clear error messages for different scenarios
- **Graceful Degradation**: Proper fallbacks for service failures
- **Request Validation**: Input validation with meaningful error responses

## Database Schema

### B2C User Table
The application supports a dual-project structure with B2C table prefixed with `b2c_` to distinguish from other projects.

#### B2C Table:
- **b2c_user** - User profile information for IELTS students including personal details, target scores, and test preparation data

#### Table Fields:
- `id` - UUID primary key
- `auth_user_id` - References Supabase auth.users table
- `email` - User's email address (unique)
- `full_name` - User's full name
- `username` - Unique username
- `avatar_url` - Profile picture URL
- `phone` - Phone number
- `country` - User's country
- `target_band_score` - Target IELTS band score (e.g., 7.5)
- `current_level` - Current English level (beginner, intermediate, advanced)
- `test_date` - Scheduled IELTS test date
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

#### Database Features:
- **Row Level Security (RLS)** - Users can only access their own data
- **UUID Primary Keys** - For better security and scalability
- **Automatic Timestamps** - Created/updated timestamps with trigger-based updates
- **Performance Indexes** - Optimized indexes for email, username, and auth_user_id
- **Foreign Key Constraints** - Proper relational integrity with cascading deletes

#### SQL Script Location:
- **File**: `/sql/b2c_tables.sql`
- **Purpose**: Database schema for B2C user table in IELTS application
- **Usage**: Run this script in Supabase or PostgreSQL to create the B2C user table