import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from './slices/navigationSlice';
import homeReducer from '../features/home/homeSlice';
import settingsReducer from '../features/settings/settingsSlice';
import libraryReducer from '../features/library/librarySlice';
import livekitReducer from '../features/livekit/livekitSlice';

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    home: homeReducer,
    settings: settingsReducer,
    library: libraryReducer,
    livekit: livekitReducer,
  },
});

export default store;