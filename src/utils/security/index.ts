/**
 * 資安工具函數 - XSS 防護與輸入驗證
 */

import type { ValidationRule, ValidationResult, SanitizeOptions, FileValidationConfig } from '@/types/security.types';

/**
 * HTML 實體編碼映射
 */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * 將特殊字符轉換為 HTML 實體，防止 XSS
 */
export function escapeHtml(str: string): string {
  if (typeof str !== 'string') {
    return '';
  }
  return str.replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * 清除 HTML 標籤
 */
export function stripHtmlTags(str: string): string {
  if (typeof str !== 'string') {
    return '';
  }
  return str.replace(/<[^>]*>/g, '');
}

/**
 * 消毒 HTML 內容
 */
export function sanitizeHtml(html: string, options: SanitizeOptions = {}): string {
  const {
    stripAllTags = true,
    encodeEntities = true,
  } = options;

  let result = html;

  if (stripAllTags) {
    result = stripHtmlTags(result);
  }

  if (encodeEntities) {
    result = escapeHtml(result);
  }

  return result;
}

/**
 * 驗證並消毒 URL
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    return '';
  }

  // 移除控制字符和不可見字符
  const cleaned = url.trim().replace(/[\x00-\x1f\x7f]/g, '');

  // 檢查危險協議
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = cleaned.toLowerCase();
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      console.warn(`Blocked dangerous URL protocol: ${protocol}`);
      return '';
    }
  }

  // 允許相對路徑、http、https
  if (
    cleaned.startsWith('/') ||
    cleaned.startsWith('./') ||
    cleaned.startsWith('../') ||
    cleaned.startsWith('http://') ||
    cleaned.startsWith('https://')
  ) {
    return cleaned;
  }

  // 如果沒有協議，假設是相對路徑
  if (!cleaned.includes('://')) {
    return cleaned;
  }

  console.warn(`Blocked unknown URL protocol: ${cleaned}`);
  return '';
}

/**
 * 驗證輸入值
 */
export function validateInput(
  value: unknown,
  rules: ValidationRule[]
): ValidationResult {
  const errors: string[] = [];

  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (value === null || value === undefined || value === '') {
          errors.push(rule.message);
        }
        break;

      case 'minLength':
        if (typeof value === 'string' && value.length < (rule.value as number)) {
          errors.push(rule.message);
        }
        break;

      case 'maxLength':
        if (typeof value === 'string' && value.length > (rule.value as number)) {
          errors.push(rule.message);
        }
        break;

      case 'pattern':
        if (typeof value === 'string' && rule.value instanceof RegExp) {
          if (!rule.value.test(value)) {
            errors.push(rule.message);
          }
        }
        break;

      case 'custom':
        if (rule.validator && !rule.validator(value)) {
          errors.push(rule.message);
        }
        break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 驗證檔案
 */
export function validateFile(
  file: File,
  config: FileValidationConfig
): ValidationResult {
  const errors: string[] = [];

  // 檢查檔案大小
  if (file.size > config.maxSize) {
    const maxSizeMB = (config.maxSize / (1024 * 1024)).toFixed(1);
    errors.push(`檔案大小超過限制 (最大 ${maxSizeMB}MB)`);
  }

  // 檢查 MIME 類型
  if (config.allowedMimeTypes.length > 0) {
    if (!config.allowedMimeTypes.includes(file.type)) {
      errors.push(`不支援的檔案類型: ${file.type}`);
    }
  }

  // 檢查副檔名
  if (config.allowedExtensions.length > 0) {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!config.allowedExtensions.includes(extension)) {
      errors.push(`不支援的檔案副檔名: ${extension}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 生成安全的隨機 ID
 */
export function generateSecureId(length: number = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * 防止 JSON 注入
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    console.warn('Failed to parse JSON, using fallback value');
    return fallback;
  }
}

/**
 * 檢查是否為有效的 ID 格式
 */
export function isValidId(id: string): boolean {
  // 只允許字母、數字、連字號和底線
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

/**
 * 限制字串長度
 */
export function truncateString(str: string, maxLength: number): string {
  if (typeof str !== 'string') {
    return '';
  }
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * 記錄安全事件
 */
export function logSecurityEvent(
  action: string,
  success: boolean,
  details?: Record<string, unknown>
): void {
  const event = {
    timestamp: new Date().toISOString(),
    action,
    success,
    details,
    userAgent: navigator.userAgent,
  };

  // 在開發環境輸出到控制台
  if (import.meta.env.DEV) {
    console.log('[Security Event]', event);
  }

  // 生產環境應該發送到後端記錄
  // TODO: 實作發送到後端 API
}
