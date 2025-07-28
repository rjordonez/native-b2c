/**
 * UI-related constants
 */

// Colors
export const COLORS = {
  // Primary colors
  PRIMARY: 'rgb(59, 130, 246)', // blue-500
  PRIMARY_DARK: 'rgb(37, 99, 235)', // blue-600
  PRIMARY_LIGHT: 'rgb(96, 165, 250)', // blue-400
  
  // Status colors
  SUCCESS: 'rgb(34, 197, 94)', // green-500
  ERROR: 'rgb(239, 68, 68)', // red-500
  WARNING: 'rgb(245, 158, 11)', // amber-500
  INFO: 'rgb(59, 130, 246)', // blue-500
  
  // Neutral colors
  GRAY_50: 'rgb(249, 250, 251)',
  GRAY_100: 'rgb(243, 244, 246)',
  GRAY_200: 'rgb(229, 231, 235)',
  GRAY_300: 'rgb(209, 213, 219)',
  GRAY_400: 'rgb(156, 163, 175)',
  GRAY_500: 'rgb(107, 114, 128)',
  GRAY_600: 'rgb(75, 85, 99)',
  GRAY_700: 'rgb(55, 65, 81)',
  GRAY_800: 'rgb(31, 41, 55)',
  GRAY_900: 'rgb(17, 24, 39)',
} as const;

// Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 10,
  STICKY: 20,
  FIXED: 30,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  POPOVER: 60,
  TOOLTIP: 70,
  TOAST: 80,
} as const;

// Spacing
export const SPACING = {
  // Base unit
  UNIT: 4, // 4px = 0.25rem
  
  // Common spacings
  XS: 4, // 0.25rem
  SM: 8, // 0.5rem
  MD: 16, // 1rem
  LG: 24, // 1.5rem
  XL: 32, // 2rem
  '2XL': 48, // 3rem
  '3XL': 64, // 4rem
} as const;

// Border radius
export const RADIUS = {
  NONE: 0,
  SM: 2,
  DEFAULT: 4,
  MD: 6,
  LG: 8,
  XL: 12,
  '2XL': 16,
  FULL: 9999,
} as const;

// Shadows
export const SHADOWS = {
  SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

// Component-specific constants
export const COMPONENT = {
  // Button
  BUTTON: {
    HEIGHT: {
      SM: 32,
      MD: 40,
      LG: 48,
    },
    PADDING: {
      SM: '0 12px',
      MD: '0 16px',
      LG: '0 20px',
    },
  },
  
  // Input
  INPUT: {
    HEIGHT: {
      SM: 32,
      MD: 40,
      LG: 48,
    },
  },
  
  // Modal
  MODAL: {
    WIDTH: {
      SM: 400,
      MD: 600,
      LG: 800,
      XL: 1000,
    },
  },
  
  // Sidebar
  SIDEBAR: {
    WIDTH: 64,
    WIDTH_EXPANDED: 240,
  },
} as const;