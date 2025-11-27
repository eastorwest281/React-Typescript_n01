/**
 * 資安相關類型定義
 */

/** 使用者資訊 */
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  lastLogin?: string;
}

/** 使用者角色 */
export type UserRole = 'admin' | 'engineer' | 'operator' | 'viewer' | 'guest';

/** 權限類型 */
export type Permission = 
  | 'view_model'
  | 'edit_model'
  | 'delete_model'
  | 'view_documents'
  | 'edit_documents'
  | 'manage_users'
  | 'system_settings';

/** 認證狀態 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

/** 登入請求 */
export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

/** 登入回應 */
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

/** 輸入驗證規則 */
export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: number | string | RegExp;
  message: string;
  validator?: (value: unknown) => boolean;
}

/** 驗證結果 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/** 消毒選項 */
export interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  stripAllTags?: boolean;
  encodeEntities?: boolean;
}

/** 安全日誌 */
export interface SecurityLog {
  id: string;
  timestamp: string;
  action: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  details?: Record<string, unknown>;
}

/** CSP 配置 */
export interface CSPConfig {
  defaultSrc: string[];
  scriptSrc: string[];
  styleSrc: string[];
  imgSrc: string[];
  fontSrc: string[];
  connectSrc: string[];
  frameSrc: string[];
  objectSrc: string[];
}

/** 檔案驗證配置 */
export interface FileValidationConfig {
  maxSize: number;                    // bytes
  allowedMimeTypes: string[];
  allowedExtensions: string[];
  scanForMalware?: boolean;
}
