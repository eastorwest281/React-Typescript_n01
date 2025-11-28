/**
 * 安全相關 Hooks
 */

import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  sanitizeHtml,
  sanitizeUrl,
  validateInput,
  validateFile,
  logSecurityEvent,
  escapeHtml,
} from '@/utils/security';
import type { ValidationRule, ValidationResult, FileValidationConfig } from '@/types/security.types';

/**
 * 使用安全的 HTML 消毒
 */
export function useSanitizedHtml(html: string): string {
  // 直接使用 useMemo 計算，避免 useEffect + setState 的問題
  return useMemo(() => sanitizeHtml(html), [html]);
}

/**
 * 使用安全的 URL 消毒
 */
export function useSanitizedUrl(url: string): string {
  return useMemo(() => {
    const result = sanitizeUrl(url);
    if (result !== url) {
      logSecurityEvent('url_sanitized', true, { original: url, sanitized: result });
    }
    return result;
  }, [url]);
}

/**
 * 輸入驗證 Hook
 */
export function useInputValidation(
  rules: ValidationRule[]
): {
  validate: (value: unknown) => ValidationResult;
  errors: string[];
  isValid: boolean;
  reset: () => void;
} {
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);

  const validate = useCallback(
    (value: unknown): ValidationResult => {
      const result = validateInput(value, rules);
      setErrors(result.errors);
      setIsValid(result.isValid);
      return result;
    },
    [rules]
  );

  const reset = useCallback(() => {
    setErrors([]);
    setIsValid(true);
  }, []);

  return { validate, errors, isValid, reset };
}

/**
 * 檔案驗證 Hook
 */
export function useFileValidation(
  config: FileValidationConfig
): {
  validateFile: (file: File) => ValidationResult;
  errors: string[];
  isValid: boolean;
} {
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);

  const handleValidateFile = useCallback(
    (file: File): ValidationResult => {
      const result = validateFile(file, config);
      setErrors(result.errors);
      setIsValid(result.isValid);
      
      if (!result.isValid) {
        logSecurityEvent('file_validation_failed', false, {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          errors: result.errors,
        });
      }
      
      return result;
    },
    [config]
  );

  return { validateFile: handleValidateFile, errors, isValid };
}

/**
 * 使用安全的內容轉義
 */
export function useEscapedContent(content: string): string {
  const [escaped, setEscaped] = useState(() => escapeHtml(content));

  useEffect(() => {
    setEscaped(escapeHtml(content));
  }, [content]);

  return escaped;
}

/**
 * CSP 違規監聽 Hook
 */
export function useCSPViolationListener(
  onViolation?: (event: SecurityPolicyViolationEvent) => void
): void {
  useEffect(() => {
    const handleViolation = (event: SecurityPolicyViolationEvent) => {
      logSecurityEvent('csp_violation', false, {
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy,
        sourceFile: event.sourceFile,
        lineNumber: event.lineNumber,
        columnNumber: event.columnNumber,
      });
      
      onViolation?.(event);
    };

    document.addEventListener('securitypolicyviolation', handleViolation);

    return () => {
      document.removeEventListener('securitypolicyviolation', handleViolation);
    };
  }, [onViolation]);
}

/**
 * 防止 XSS 的表單提交 Hook
 */
export function useSecureForm<T extends Record<string, string>>(
  initialValues: T
): {
  values: T;
  sanitizedValues: T;
  setValue: (key: keyof T, value: string) => void;
  reset: () => void;
} {
  const [values, setValues] = useState<T>(initialValues);

  const setValue = useCallback((key: keyof T, value: string) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const sanitizedValues = Object.keys(values).reduce(
    (acc, key) => ({
      ...acc,
      [key]: sanitizeHtml(values[key as keyof T] as string),
    }),
    {} as T
  );

  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  return { values, sanitizedValues, setValue, reset };
}

/**
 * 安全的 localStorage 存取 Hook
 */
export function useSecureStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item) as T;
      }
      return initialValue;
    } catch (error) {
      logSecurityEvent('storage_read_error', false, { key, error: String(error) });
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        logSecurityEvent('storage_write_error', false, { key, error: String(error) });
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      logSecurityEvent('storage_remove_error', false, { key, error: String(error) });
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
