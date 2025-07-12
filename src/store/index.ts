import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from './slices/navigationSlice';
import homeReducer from '../features/home/homeSlice';
import aboutReducer from '../features/about/aboutSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    home: homeReducer,
    about: aboutReducer,
    dashboard: dashboardReducer,
  },
});

export default store;