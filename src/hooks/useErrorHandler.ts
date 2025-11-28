/**
 * 錯誤處理 Hooks
 */

import { useCallback, useState, useEffect } from 'react';
import { logSecurityEvent } from '@/utils/security';

/** 錯誤類型 */
export type ErrorType = 'network' | 'validation' | 'auth' | 'permission' | 'notFound' | 'server' | 'unknown';

/** 錯誤資訊 */
export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp: string;
  stack?: string;
}

/** 錯誤處理狀態 */
interface ErrorState {
  error: AppError | null;
  hasError: boolean;
}

/**
 * 將錯誤轉換為 AppError
 */
function normalizeError(error: unknown, type: ErrorType = 'unknown'): AppError {
  const timestamp = new Date().toISOString();

  if (error instanceof Error) {
    return {
      type,
      message: error.message,
      timestamp,
      stack: import.meta.env.DEV ? error.stack : undefined,
    };
  }

  if (typeof error === 'string') {
    return {
      type,
      message: error,
      timestamp,
    };
  }

  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>;
    return {
      type: (errorObj.type as ErrorType) || type,
      message: (errorObj.message as string) || '發生未知錯誤',
      code: errorObj.code as string | undefined,
      details: errorObj.details as Record<string, unknown> | undefined,
      timestamp,
    };
  }

  return {
    type: 'unknown',
    message: '發生未知錯誤',
    timestamp,
  };
}

/**
 * 取得錯誤類型的友善描述
 */
export function getErrorTypeLabel(type: ErrorType): string {
  const labels: Record<ErrorType, string> = {
    network: '網路錯誤',
    validation: '驗證錯誤',
    auth: '認證錯誤',
    permission: '權限錯誤',
    notFound: '找不到資源',
    server: '伺服器錯誤',
    unknown: '未知錯誤',
  };
  return labels[type] || '錯誤';
}

/**
 * 取得錯誤的使用者友善訊息
 */
export function getUserFriendlyMessage(error: AppError): string {
  switch (error.type) {
    case 'network':
      return '網路連線發生問題，請檢查您的網路連線後重試。';
    case 'validation':
      return error.message || '輸入的資料格式不正確，請檢查後重試。';
    case 'auth':
      return '認證失敗，請重新登入。';
    case 'permission':
      return '您沒有執行此操作的權限。';
    case 'notFound':
      return '找不到您要求的資源。';
    case 'server':
      return '伺服器發生錯誤，請稍後再試。';
    default:
      return error.message || '發生錯誤，請重試。';
  }
}

/**
 * 錯誤處理 Hook
 */
export function useErrorHandler(): {
  error: AppError | null;
  hasError: boolean;
  handleError: (error: unknown, type?: ErrorType) => AppError;
  clearError: () => void;
  setError: (error: AppError) => void;
} {
  const [state, setState] = useState<ErrorState>({
    error: null,
    hasError: false,
  });

  const handleError = useCallback((error: unknown, type: ErrorType = 'unknown'): AppError => {
    const appError = normalizeError(error, type);
    
    setState({
      error: appError,
      hasError: true,
    });

    // 記錄錯誤
    logSecurityEvent('error_occurred', false, {
      type: appError.type,
      message: appError.message,
      code: appError.code,
    });

    // 開發環境輸出錯誤詳情
    if (import.meta.env.DEV) {
      console.error('[App Error]', appError);
    }

    return appError;
  }, []);

  const clearError = useCallback(() => {
    setState({
      error: null,
      hasError: false,
    });
  }, []);

  const setError = useCallback((error: AppError) => {
    setState({
      error,
      hasError: true,
    });
  }, []);

  return {
    error: state.error,
    hasError: state.hasError,
    handleError,
    clearError,
    setError,
  };
}

/**
 * 非同步操作錯誤處理 Hook
 */
export function useAsyncError<T>(): {
  execute: (promise: Promise<T>, errorType?: ErrorType) => Promise<T | null>;
  isLoading: boolean;
  error: AppError | null;
  clearError: () => void;
} {
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();

  const execute = useCallback(
    async (promise: Promise<T>, errorType: ErrorType = 'unknown'): Promise<T | null> => {
      setIsLoading(true);
      clearError();

      try {
        const result = await promise;
        return result;
      } catch (err) {
        handleError(err, errorType);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError]
  );

  return { execute, isLoading, error, clearError };
}

/**
 * 全域錯誤監聽 Hook
 */
export function useGlobalErrorListener(
  onError?: (error: AppError) => void
): void {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      
      const appError = normalizeError(event.error || event.message, 'unknown');
      
      logSecurityEvent('global_error', false, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });

      onError?.(appError);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      
      const appError = normalizeError(event.reason, 'unknown');
      
      logSecurityEvent('unhandled_rejection', false, {
        reason: String(event.reason),
      });

      onError?.(appError);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [onError]);
}

/**
 * 網路錯誤監聽 Hook
 */
export function useNetworkStatus(): {
  isOnline: boolean;
  wasOffline: boolean;
} {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        logSecurityEvent('network_restored', true);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      logSecurityEvent('network_lost', false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return { isOnline, wasOffline };
}
