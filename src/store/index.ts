import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from './slices/navigationSlice';
import dashboardReducer from './slices/dashboard/dashboardSlice';
import saveStatusReducer from './slices/saveStatusSlice';
import settingsReducer from '../features/settings/settingsSlice';
import libraryReducer from '../features/library/librarySlice';
import { 
  conversationReducer,
  voiceRecordingReducer,
  audioPlaybackReducer,
  topicPracticeReducer
} from '../features/chat/store';
import authReducer from '../features/auth/authSlice';
import pronunciationReducer from '../features/pronunciation/pronunciationSlice';
import { autoSaveMiddleware } from './middleware/autoSaveMiddleware';

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    dashboard: dashboardReducer,
    saveStatus: saveStatusReducer,
    settings: settingsReducer,
    library: libraryReducer,
    conversation: conversationReducer,
    voiceRecording: voiceRecordingReducer,
    audioPlayback: audioPlaybackReducer,
    topicPractice: topicPracticeReducer,
    auth: authReducer,
    pronunciation: pronunciationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['chat/startTopicPractice/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp', 'payload.date'],
        // Ignore these paths in the state
        ignoredPaths: ['chat.lastSaved'],
      },
    }).concat(autoSaveMiddleware),
});

export default store;