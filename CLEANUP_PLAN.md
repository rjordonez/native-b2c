# Codebase Cleanup Plan

## Overview
This plan outlines the cleanup and refactoring needed to align with CLAUDE.md best practices and improve code quality.

## Phase 1: Code Hygiene (Priority: High)

### 1.1 Remove Debug Code
- [ ] Remove all console.log statements (60 occurrences found)
- [ ] Remove commented-out code blocks
- [ ] Remove unused imports
- [ ] Remove .old files (chatSlice.old.ts)

### 1.2 Error Handling
- [ ] Replace console.error with proper error handling
- [ ] Add user-friendly error messages
- [ ] Implement error boundaries for critical components
- [ ] Add proper error types instead of generic Error

### 1.3 TypeScript Improvements
- [ ] Fix all 'any' types with proper interfaces
- [ ] Add missing return types to functions
- [ ] Define proper types for API responses
- [ ] Fix optional chaining where types should be defined

## Phase 2: Constants & Configuration (Priority: High)

### 2.1 Extract Magic Values
- [ ] API endpoints → constants/api.ts
- [ ] Time delays (1000ms, 3000ms) → constants/timing.ts
- [ ] File size limits → constants/limits.ts
- [ ] Audio formats → constants/audio.ts
- [ ] Error messages → constants/messages.ts

### 2.2 Environment Configuration
- [ ] Move hardcoded URLs to environment variables
- [ ] Create proper config files for different environments
- [ ] Add validation for required env vars

## Phase 3: Component Organization (Priority: Medium)

### 3.1 Follow CLAUDE.md Structure
- [ ] Move VoiceMessage.tsx → features/chat/components/messages/VoiceMessage.tsx
- [ ] Move voice-recorder components to proper feature structure
- [ ] Create barrel exports (index.ts) for clean imports
- [ ] Separate UI components from business logic

### 3.2 Shared Components
- [ ] Extract reusable UI patterns to shared/components/ui/
- [ ] Create proper prop interfaces for all components
- [ ] Add proper component documentation

## Phase 4: State Management (Priority: Medium)

### 4.1 Redux Cleanup
- [ ] Remove duplicate slices (chat vs conversation)
- [ ] Consolidate related state (audio state spread across multiple slices)
- [ ] Use RTK Query for API calls instead of manual thunks
- [ ] Implement proper loading/error states

### 4.2 Performance
- [ ] Add proper memoization where needed
- [ ] Implement virtual scrolling for long message lists
- [ ] Lazy load heavy components
- [ ] Optimize re-renders with React.memo

## Phase 5: Services & APIs (Priority: Medium)

### 5.1 Service Layer Improvements
- [ ] Create consistent API client with interceptors
- [ ] Implement proper request/response types
- [ ] Add request timeout handling
- [ ] Create service interfaces for dependency injection

### 5.2 Persistence Layer
- [ ] Add proper transaction support
- [ ] Implement optimistic updates
- [ ] Add conflict resolution for concurrent edits
- [ ] Create migration system for schema changes

## Phase 6: Testing & Documentation (Priority: Low)

### 6.1 Add Missing Tests
- [ ] Unit tests for services
- [ ] Integration tests for Redux flows
- [ ] Component tests for critical UI
- [ ] E2E tests for main user flows

### 6.2 Documentation
- [ ] Add JSDoc comments to functions
- [ ] Create README for each feature
- [ ] Document API contracts
- [ ] Add architecture decision records (ADRs)

## Implementation Order

### Week 1: Critical Cleanup
1. Remove all console.logs and debug code
2. Fix critical TypeScript issues
3. Extract constants for magic values
4. Improve error handling

### Week 2: Organization
1. Reorganize components per CLAUDE.md
2. Create proper barrel exports
3. Clean up Redux state
4. Consolidate duplicate code

### Week 3: Quality
1. Add proper types everywhere
2. Implement performance optimizations
3. Add critical tests
4. Document complex logic

## Specific Files to Address

### High Priority Files
1. `/src/store/middleware/autoSaveMiddleware.ts` - Remove logs, add types
2. `/src/services/chatPersistence.ts` - Add error handling, types
3. `/src/features/chat/store/topicPracticeSlice.ts` - Remove logs, consolidate
4. `/src/features/chat/components/VoiceMessage.tsx` - Extract constants, reorganize

### Files to Delete
1. `/src/features/chat/chatSlice.old.ts`
2. Any other .old or .backup files
3. Unused sample data files

### Files to Create
1. `/src/constants/api.ts` - API endpoints
2. `/src/constants/timing.ts` - Delays and timeouts  
3. `/src/constants/messages.ts` - User-facing messages
4. `/src/types/api.ts` - API response types
5. `/src/utils/error.ts` - Error handling utilities

## Success Criteria
- [ ] No console.log in production code
- [ ] No 'any' types except where absolutely necessary
- [ ] All components follow CLAUDE.md structure
- [ ] Error handling provides useful user feedback
- [ ] Code is self-documenting with clear names
- [ ] Performance metrics meet targets
- [ ] Critical paths have test coverage

## Notes
- Prioritize changes that affect user experience
- Make incremental changes to avoid breaking functionality
- Test thoroughly after each phase
- Keep backwards compatibility where possible