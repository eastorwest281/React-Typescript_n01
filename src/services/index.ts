/**
 * 服務層統一導出
 */

export { modelApi, documentApi } from './api';
export * from './mock';

// 錯誤處理服務
export {
  errorHandlerService,
  reportError,
  createApiError,
  createValidationError,
  createNetworkError,
} from './errorHandler';
