/**
 * Barrel export for layout components
 */

export { default as Layout } from './Layout';
export { default as Sidebar } from './Sidebar';
export { default as TopNav } from './TopNav';
export { default as BlockSpinner } from './BlockSpinner';
export { default as SaveStatusIndicator } from './SaveStatusIndicator';

// Export sidebar sub-components
export * from './sidebar/ChatSessions';
export * from './sidebar/SidebarLogo';
export * from './sidebar/SidebarNavigation';
export * from './sidebar/UserProfile';

// Re-export UI components
export * from './ui';