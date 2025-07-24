import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from './slices/navigationSlice';
import dashboardReducer from './slices/dashboard/dashboardSlice';
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

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    dashboard: dashboardReducer,
    settings: settingsReducer,
    library: libraryReducer,
    conversation: conversationReducer,
    voiceRecording: voiceRecordingReducer,
    audioPlayback: audioPlaybackReducer,
    topicPractice: topicPracticeReducer,
    auth: authReducer,
    pronunciation: pronunciationReducer,
  },
});

export default store;