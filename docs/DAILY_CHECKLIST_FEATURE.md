# Daily Checklist Feature

## Overview
The Daily Checklist feature tracks users' practice progress for IELTS Parts 1, 2, and 3. The checklist automatically resets daily and persists in the database.

## How It Works

### Automatic Updates
When a user completes all questions in a topic practice session:
1. The system detects which part (Part 1, 2, or 3) was completed
2. The corresponding checklist item is automatically marked as completed
3. The UI updates in real-time to reflect the progress

### Daily Reset
- Checklists reset automatically at midnight (server time)
- Previous day's progress is preserved for up to 30 days
- Each day starts with a fresh checklist

### Database Structure
The `daily_checklist_progress` table stores:
- `task_id`: 1 for Part 1, 2 for Part 2, 3 for Part 3
- `completed`: Boolean indicating completion status
- `date`: The date this checklist is for
- `completed_at`: Timestamp when the task was completed

### Integration Points

1. **Topic Practice Completion**
   - File: `src/features/chat/store/topicPracticeThunks/handleTopicPracticeCompletion.ts`
   - When a topic is 100% completed, it triggers `completeChecklistForPart()`

2. **Checklist Service**
   - File: `src/features/dashboard/services/checklistService.ts`
   - Handles all database operations for the checklist

3. **Redux Integration**
   - Slice: `src/store/slices/dashboard/dashboardSlice.ts`
   - Thunks: `src/store/slices/dashboard/dashboardThunks.ts`

4. **UI Component**
   - File: `src/shared/components/dashboard/ChecklistCard.tsx`
   - Displays the checklist with real-time updates

## Usage

### For Developers
To manually complete a checklist item:
```typescript
import { completeChecklistTask } from '@/store/slices/dashboard/dashboardThunks';

// Complete Part 1 (task_id = 1)
dispatch(completeChecklistTask(1));
```

### SQL Functions
- `get_or_create_daily_checklist(user_id)` - Gets or creates today's checklist
- `complete_checklist_task(user_id, task_id)` - Marks a task as completed
- `get_checklist_progress(user_id)` - Gets progress summary

## Security
- Row Level Security (RLS) ensures users can only access their own checklist data
- All database functions use SECURITY DEFINER for proper access control