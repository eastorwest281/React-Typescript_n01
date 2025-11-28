/**
 * 自定義 Hooks 匯出
 */

// 安全相關 Hooks
export {
  useSanitizedHtml,
  useSanitizedUrl,
  useInputValidation,
  useFileValidation,
  useEscapedContent,
  useCSPViolationListener,
  useSecureForm,
  useSecureStorage,
} from './useSecurity';

// 錯誤處理 Hooks
export {
  useErrorHandler,
  useAsyncError,
  useGlobalErrorListener,
  useNetworkStatus,
  getErrorTypeLabel,
  getUserFriendlyMessage,
  type ErrorType,
  type AppError,
} from './useErrorHandler';

// Toast Hook
export { useToast, type ToastType, type ToastItem, type ToastContextType } from './useToast';
