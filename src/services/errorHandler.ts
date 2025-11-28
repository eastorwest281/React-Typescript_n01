/**
 * 全域錯誤處理服務
 */

import type { AppError, ErrorType } from '@/hooks/useErrorHandler';

/** 錯誤報告配置 */
interface ErrorReportConfig {
  /** 是否啟用錯誤報告 */
  enabled: boolean;
  /** 錯誤報告端點 */
  endpoint?: string;
  /** 是否包含用戶資訊 */
  includeUserInfo?: boolean;
  /** 採樣率 (0-1) */
  sampleRate?: number;
}

/** 錯誤報告資料 */
interface ErrorReport {
  error: AppError;
  environment: 'development' | 'production';
  timestamp: string;
  url: string;
  userAgent: string;
  screenSize: { width: number; height: number };
  customData?: Record<string, unknown>;
}

/**
 * 錯誤處理服務類別
 */
class ErrorHandlerService {
  private config: ErrorReportConfig = {
    enabled: true,
    sampleRate: 1.0,
  };

  private errorQueue: ErrorReport[] = [];
  private readonly maxQueueSize = 50;

  /**
   * 設定錯誤報告配置
   */
  configure(config: Partial<ErrorReportConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 報告錯誤
   */
  reportError(error: AppError, customData?: Record<string, unknown>): void {
    if (!this.config.enabled) return;

    // 採樣檢查
    if (Math.random() > (this.config.sampleRate ?? 1)) return;

    const report: ErrorReport = {
      error,
      environment: import.meta.env.DEV ? 'development' : 'production',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      customData,
    };

    // 開發環境輸出到控制台
    if (import.meta.env.DEV) {
      console.group('[Error Report]');
      console.error('Error:', error);
      console.info('Context:', {
        url: report.url,
        timestamp: report.timestamp,
        environment: report.environment,
      });
      if (customData) {
        console.info('Custom Data:', customData);
      }
      console.groupEnd();
    }

    // 加入佇列
    this.addToQueue(report);

    // 如果有端點，發送到後端
    if (this.config.endpoint) {
      this.sendToEndpoint(report);
    }
  }

  /**
   * 加入錯誤佇列
   */
  private addToQueue(report: ErrorReport): void {
    this.errorQueue.push(report);
    
    // 限制佇列大小
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }
  }

  /**
   * 發送到錯誤報告端點
   */
  private async sendToEndpoint(report: ErrorReport): Promise<void> {
    if (!this.config.endpoint) return;

    try {
      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      });
    } catch (e) {
      // 避免錯誤報告本身產生錯誤循環
      console.warn('[ErrorHandler] Failed to send error report:', e);
    }
  }

  /**
   * 取得錯誤佇列
   */
  getErrorQueue(): readonly ErrorReport[] {
    return this.errorQueue;
  }

  /**
   * 清空錯誤佇列
   */
  clearErrorQueue(): void {
    this.errorQueue = [];
  }

  /**
   * 建立 API 錯誤
   */
  createApiError(
    status: number,
    message: string,
    details?: Record<string, unknown>
  ): AppError {
    let type: ErrorType = 'server';

    if (status === 401) type = 'auth';
    else if (status === 403) type = 'permission';
    else if (status === 404) type = 'notFound';
    else if (status === 422) type = 'validation';
    else if (status >= 500) type = 'server';
    else if (status === 0) type = 'network';

    return {
      type,
      message,
      code: `HTTP_${status}`,
      details,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 建立驗證錯誤
   */
  createValidationError(
    message: string,
    fieldErrors?: Record<string, string[]>
  ): AppError {
    return {
      type: 'validation',
      message,
      details: { fieldErrors },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 建立網路錯誤
   */
  createNetworkError(message: string = '網路連線發生問題'): AppError {
    return {
      type: 'network',
      message,
      timestamp: new Date().toISOString(),
    };
  }
}

// 單例匯出
export const errorHandlerService = new ErrorHandlerService();

// 便捷函數
export const reportError = errorHandlerService.reportError.bind(errorHandlerService);
export const createApiError = errorHandlerService.createApiError.bind(errorHandlerService);
export const createValidationError = errorHandlerService.createValidationError.bind(errorHandlerService);
export const createNetworkError = errorHandlerService.createNetworkError.bind(errorHandlerService);
