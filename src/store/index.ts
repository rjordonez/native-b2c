import { configureStore } from '@reduxjs/toolkit';
import { navigationReducer, dashboardReducer, saveStatusReducer } from './slices';
import { settingsReducer } from '../features/settings/store';
import { libraryReducer } from '../features/library/store';
import { 
  conversationReducer,
  voiceRecordingReducer,
  audioPlaybackReducer,
  topicPracticeReducer
} from '../features/chat/store';
import { authReducer } from '../features/auth/store';
import { pronunciationReducer } from '../features/pronunciation/store';
import devDashReducer from '../features/dev-dash/devDashSlice';
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
    devDash: devDashReducer,
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