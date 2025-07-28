# Phase 2 Migration Steps

## Current Status
Phase 2 code is implemented but requires database and storage setup.

## Steps to Enable Phase 2:

### 1. Create Storage Bucket
Go to your Supabase dashboard:
1. Navigate to Storage
2. Click "New bucket"
3. Name: `chat-audio`
4. Public: NO (keep private)
5. File size limit: 50MB
6. Allowed MIME types: `audio/*`

### 2. Run Database Migrations
In Supabase SQL editor, run these in order:

1. **Phase 2 Schema** - `/sql/phase2_audio_transcription_schema.sql`
   - Adds audio_storage_url, audio_duration, audio_mime_type columns
   - Creates transcriptions table
   - Creates pronunciation_scores table
   - Creates enhanced_transcripts table

2. **Storage Policies** - `/sql/create_audio_storage_bucket.sql`
   - Run the RLS policies section after creating the bucket

### 3. Update chatPersistence.ts
After migrations are complete, update the saveMessage method to use storage columns:

```typescript
// Change this:
audio_data: message.audioData, // Keep base64 for now

// To this:
audio_storage_url: audioStorageUrl,
audio_duration: audioDuration,
audio_mime_type: 'audio/webm',
```

### 4. Test
1. Record a voice message
2. Check Supabase Storage for uploaded file
3. Refresh page and verify audio plays
4. Check that transcription/pronunciation persist

## Current Fallback
The code currently falls back to base64 storage in the audio_data column when:
- Storage bucket doesn't exist
- Upload fails
- New columns don't exist

This ensures the app continues working during migration.