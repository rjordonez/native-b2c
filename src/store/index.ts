import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from './slices/navigationSlice';
import homeReducer from '../features/home/homeSlice';
import settingsReducer from '../features/settings/settingsSlice';
import topicLibraryReducer from '../features/topic-library/topicLibrarySlice';
import livekitReducer from '../features/livekit/livekitSlice';

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    home: homeReducer,
    settings: settingsReducer,
    topicLibrary: topicLibraryReducer,
    livekit: livekitReducer,
  },
});

export default store;