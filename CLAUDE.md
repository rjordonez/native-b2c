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
│   │   └── ui/           # Reusable UI components (Button)
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
- Use strict TypeScript with proper type annotations
- Define interfaces in `types.ts` files within each feature
- Use Redux Toolkit's typed hooks and selectors

### Redux Best Practices
- Use Redux Toolkit slices for state management
- Keep feature-specific state in feature slices
- Use typed selectors and dispatch
- Follow immutable update patterns

### Component Structure
- Use functional components with TypeScript
- Props interfaces should be clearly defined
- Prefer composition over inheritance
- Keep components focused and single-purpose

### Naming Conventions
- Components: PascalCase (e.g., `HomePage.tsx`, `DashboardCard.tsx`)
- Files: PascalCase for components, camelCase for utilities
- Redux slices: camelCase with "Slice" suffix (e.g., `homeSlice.ts`)
- Types: PascalCase interfaces (e.g., `ButtonProps`, `HomeState`)

### Styling
- Use Tailwind CSS for styling
- Responsive design with mobile-first approach
- Consistent spacing and color schemes
- Accessible focus states and interactions

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

### Testing
- Run build command to check for TypeScript errors
- Test responsive behavior on different screen sizes
- Verify Redux state updates work correctly

## Dependencies
- React 18+ with TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Vite for build tooling