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
- LiveKit voice communication backend support

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
- Express.js server for API proxy and LiveKit integration
- LiveKit Server SDK for voice communication tokens
- CORS support for cross-origin requests
- Axios for external API calls

## Development Commands

### Frontend
- `npm run dev` - Start frontend development server
- `npm run build` - Build for production (with TypeScript checking)
- `npm run lint` - Run ESLint validation
- `npm run preview` - Preview production build

### Backend
- `node backend/index.js` - Start backend server (port 3001)
- Backend provides:
  - `/api/connection-details` - LiveKit token generation
  - `/proxy` - External API proxy for submissions

## Environment Setup
Create a `.env` file in the root directory with:
```
LIVEKIT_URL=wss://your-livekit-server.com
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
```

## File Structure
```
├── src/                       # Frontend React application
│   ├── features/
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
│   ├── index.js              # Main server file with LiveKit support
│   ├── package.json          # Backend dependencies
│   └── node_modules/         # Backend dependencies
├── .env.example              # Environment variables template
└── tsconfig.json             # TypeScript configuration
```

## API Endpoints

### LiveKit Integration
- **GET** `/api/connection-details` - Generate LiveKit participant tokens
  - Query parameters:
    - `greeting` (optional) - Custom greeting for the participant
    - `scenario` (optional) - Conversation scenario
    - `scenarioLevel` (optional) - Difficulty level
    - `scenarioTurns` (optional) - Number of conversation turns
    - `conversationScript` (optional) - Conversation script content
  - Returns: `{ serverUrl, roomName, participantToken, participantName }`

### Proxy Endpoints  
- **POST** `/proxy` - Proxy external API submissions
  - Body: `{ audio_urls, submission_url }`
  - Forwards requests to external submission API