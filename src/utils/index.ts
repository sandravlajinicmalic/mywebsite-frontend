/**
 * Utility functions for the application
 * 
 * This file re-exports all utility functions from their respective modules
 * to provide a single import point for utilities.
 */

// Translation utilities
export { extractErrorCode } from './translations'

// Cursor utilities
export { applyCustomCursor, removeCustomCursor } from './cursor'

// Color swap utilities
export { applyColorSwap, removeColorSwap } from './colorSwap'

// Avatar utilities
export { getUserDefaultAvatar } from './avatar'
