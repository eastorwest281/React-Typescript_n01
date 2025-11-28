/**
 * Toast Hook
 */

import { createContext, useContext } from 'react';

/** Toast 類型 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/** Toast 項目 */
export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

/** Toast Context 類型 */
export interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

/**
 * 使用 Toast Hook
 */
export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
