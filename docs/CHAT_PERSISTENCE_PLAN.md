# Chat Persistence Implementation Plan

## High-Level Overview

### Current State Analysis
- **Data is distributed across 4 Redux slices**: conversationSlice, topicPracticeSlice, audioPlaybackSlice, voiceRecordingSlice
- **No persistence**: Everything is lost on page refresh
- **Sample data loaded on startup**: SAMPLE_CONVERSATIONS from chatData.ts
- **Audio stored as base64**: Heavy memory usage in Redux state

### Save Points Identified
1. **Message Creation**
   - Text messages sent by user
   - Voice messages recorded and sent
   - AI responses received
   - Topic practice questions generated

2. **Transcription & Analysis**
   - Audio transcription completed
   - Pronunciation analysis completed
   - Enhanced transcript generated

3. **Conversation Management**
   - New conversation created
   - Conversation title updated
   - Conversation deleted

4. **Topic Practice Sessions**
   - Session started
   - Question answered
   - Session completed

## Architecture Design

### 1. Save Status Indicator
```typescript
// Add to navigationSlice.ts or create new saveStatusSlice.ts
interface SaveStatus {
  isSaving: boolean;
  lastSaved: number | null; // timestamp
  pendingOperations: number;
  error: string | null;
}
```

### 2. Save Queue System
```typescript
// services/saveQueue.ts
class SaveQueue {
  private queue: SaveOperation[] = [];
  private processing = false;
  private retryMap = new Map<string, number>();
  
  enqueue(operation: SaveOperation) {
    this.queue.push(operation);
    this.process();
  }
  
  private async process() {
    if (this.processing) return;
    // Batch process operations
  }
}
```

### 3. Redux Middleware
```typescript
// store/middleware/autoSaveMiddleware.ts
const autoSaveMiddleware = store => next => action => {
  const result = next(action);
  
  // Intercept actions that need saving
  if (SAVE_ACTIONS.includes(action.type)) {
    saveQueue.enqueue({
      type: deriveOperationType(action),
      data: extractSaveData(action, store.getState())
    });
  }
  
  return result;
};
```

## Phase 1: Foundation (Week 1)

### Goals
- Set up basic save infrastructure
- Add save status indicator
- Implement simple conversation persistence

### Tasks
1. **Create Save Status Slice**
   - Add saveStatus to Redux store
   - Create actions: setSaving, setSaved, setError
   - Add selectors for UI components

2. **Build Save Status Indicator Component**
   - Show in navigation bar
   - Display loading spinner when saving
   - Show "Saved" with checkmark when complete
   - Auto-hide after 3 seconds

3. **Create Save Service**
   ```typescript
   // services/chatPersistence.ts
   class ChatPersistenceService {
     async saveConversation(conversation: Conversation) {}
     async saveMessage(message: Message, conversationId: string) {}
     async loadConversations(userId: string) {}
   }
   ```

4. **Database Schema v1**
   ```sql
   -- Simple schema to start
   CREATE TABLE conversations (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users(id),
     title TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   CREATE TABLE messages (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     conversation_id UUID REFERENCES conversations(id),
     content TEXT,
     sender TEXT CHECK (sender IN ('user', 'assistant')),
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

### Validation Checkpoint
- [ ] Save indicator shows when creating conversation
- [ ] Conversations persist across page refresh
- [ ] Basic messages save and load

## Phase 2: Audio & Transcription (Week 2)

### Goals
- Upload audio to Supabase Storage
- Save transcriptions and pronunciation scores
- Handle large audio files efficiently

### Tasks
1. **Audio Upload Service**
   ```typescript
   async uploadAudio(audioData: string, messageId: string) {
     // Convert base64 to blob
     // Upload to Supabase Storage
     // Return public URL
   }
   ```

2. **Extend Database Schema**
   ```sql
   ALTER TABLE messages ADD COLUMN audio_url TEXT;
   ALTER TABLE messages ADD COLUMN audio_duration INTEGER;
   
   CREATE TABLE transcriptions (
     id UUID PRIMARY KEY,
     message_id UUID REFERENCES messages(id),
     text TEXT,
     confidence FLOAT
   );
   
   CREATE TABLE pronunciation_scores (
     id UUID PRIMARY KEY,
     message_id UUID REFERENCES messages(id),
     overall_score FLOAT,
     accuracy FLOAT,
     fluency FLOAT,
     word_scores JSONB
   );
   ```

3. **Update Save Logic**
   - Upload audio before saving message
   - Save transcription when complete
   - Save pronunciation scores

### Validation Checkpoint
- [ ] Audio messages play after refresh
- [ ] Transcriptions persist
- [ ] Pronunciation scores display correctly

## Phase 3: Queue & Optimization (Week 3)

### Goals
- Implement robust queue system
- Add retry logic
- Optimize for performance

### Tasks
1. **Advanced Queue Features**
   - Debouncing (wait 1s after typing stops)
   - Batching (save multiple messages together)
   - Priority (save latest first)
   - Offline queue (IndexedDB)

2. **Error Handling & Retry**
   ```typescript
   class SaveQueue {
     async processWithRetry(operation: SaveOperation) {
       const maxRetries = 3;
       let lastError;
       
       for (let i = 0; i < maxRetries; i++) {
         try {
           await this.save(operation);
           return;
         } catch (error) {
           lastError = error;
           await this.exponentialBackoff(i);
         }
       }
       
       this.handleFailure(operation, lastError);
     }
   }
   ```

3. **Performance Optimizations**
   - Use Web Worker for processing
   - Compress audio before upload
   - Implement pagination for message loading
   - Add caching layer

### Validation Checkpoint
- [ ] No UI freezing during saves
- [ ] Handles network interruptions
- [ ] Large conversations load quickly

## Phase 4: Advanced Features (Week 4)

### Goals
- Topic practice persistence
- Enhanced transcripts
- Analytics and cleanup

### Tasks
1. **Topic Practice Sessions**
   ```sql
   CREATE TABLE topic_sessions (
     id UUID PRIMARY KEY,
     conversation_id UUID REFERENCES conversations(id),
     topic_id UUID,
     started_at TIMESTAMPTZ,
     completed_at TIMESTAMPTZ,
     questions_answered INTEGER
   );
   ```

2. **Data Cleanup Service**
   - Delete old audio files (30 days)
   - Archive old conversations
   - Compress transcripts

3. **User Preferences**
   - Save audio settings
   - Remember last conversation
   - Sync across devices

### Validation Checkpoint
- [ ] Topic practice resumes where left off
- [ ] Old audio cleaned up automatically
- [ ] Settings persist across sessions

## Implementation Checklist

### Immediate Actions
1. [ ] Create saveStatusSlice.ts
2. [ ] Add SaveStatusIndicator component
3. [ ] Create basic chatPersistence service
4. [ ] Add autoSaveMiddleware to store

### Database Migrations
1. [ ] Create conversations table
2. [ ] Create messages table
3. [ ] Set up RLS policies
4. [ ] Create storage bucket for audio

### Testing Strategy
1. **Unit Tests**
   - Save queue logic
   - Data transformation
   - Error handling

2. **Integration Tests**
   - Full save/load cycle
   - Network failure scenarios
   - Large data handling

3. **Performance Tests**
   - Save time for 100+ messages
   - UI responsiveness during saves
   - Memory usage with audio

## Risk Mitigation

1. **Data Loss**
   - Keep Redux state until save confirmed
   - Use transactions for related data
   - Implement soft deletes

2. **Performance**
   - Lazy load old messages
   - Use virtual scrolling
   - Compress audio client-side

3. **Costs**
   - Monitor storage usage
   - Implement quotas per user
   - Clean up old data regularly

## Success Metrics
- Save indicator visible < 100ms after action
- Save completes < 2s for text, < 5s for audio
- Zero data loss on network issues
- UI remains responsive during saves
- 99% save success rate