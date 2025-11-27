/**
 * API 相關類型定義
 */

/** API 回應基礎結構 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  timestamp: string;
}

/** API 錯誤 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/** 分頁請求參數 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** 分頁回應 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** 搜尋參數 */
export interface SearchParams {
  query: string;
  filters?: Record<string, string | number | boolean>;
  pagination?: PaginationParams;
}

/** 模型載入進度 */
export interface LoadingProgress {
  loaded: number;
  total: number;
  percentage: number;
  stage: 'fetching' | 'parsing' | 'processing' | 'complete';
}

/** 檔案上傳請求 */
export interface FileUploadRequest {
  file: File;
  type: 'model' | 'pointcloud' | 'document' | 'image';
  metadata?: Record<string, unknown>;
}

/** 檔案上傳回應 */
export interface FileUploadResponse {
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
}

/** 請求配置 */
export interface RequestConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
  withCredentials: boolean;
}
