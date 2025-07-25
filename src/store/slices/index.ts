/**
 * Barrel export for global slices
 */

export * from './navigationSlice';
export * from './saveStatusSlice';
export * from './dashboard/dashboardSlice';

export { default as navigationReducer } from './navigationSlice';
export { default as saveStatusReducer } from './saveStatusSlice';
export { default as dashboardReducer } from './dashboard/dashboardSlice';