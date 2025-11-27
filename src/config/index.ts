/**
 * 應用程式配置
 */

/** 環境配置 */
export const config = {
  /** API 基礎 URL */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  
  /** 是否為開發模式 */
  isDevelopment: import.meta.env.DEV,
  
  /** 是否為生產模式 */
  isProduction: import.meta.env.PROD,
  
  /** API 請求超時時間 (ms) */
  apiTimeout: 30000,
  
  /** 啟用 Mock 數據 */
  enableMockData: import.meta.env.VITE_ENABLE_MOCK === 'true' || true,
  
  /** 版本號 */
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
};

/** 3D 渲染配置 */
export const renderConfig = {
  /** 最大 FPS */
  maxFps: 60,
  
  /** 抗鋸齒 */
  antialias: true,
  
  /** 像素比例 */
  pixelRatio: Math.min(window.devicePixelRatio, 2),
  
  /** 陰影貼圖大小 */
  shadowMapSize: 2048,
  
  /** 最大點雲點數 */
  maxPointCloudPoints: 5000000,
};

/** 安全配置 */
export const securityConfig = {
  /** Token 刷新閾值 (剩餘時間少於此值時刷新, 單位: 秒) */
  tokenRefreshThreshold: 300,
  
  /** 最大登入嘗試次數 */
  maxLoginAttempts: 5,
  
  /** 登入鎖定時間 (秒) */
  lockoutDuration: 300,
  
  /** 密碼最小長度 */
  minPasswordLength: 8,
  
  /** 啟用 CSP */
  enableCSP: true,
  
  /** CSP 設定 */
  cspDirectives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'blob:'],
    fontSrc: ["'self'"],
    connectSrc: ["'self'", 'http://localhost:*', 'ws://localhost:*'],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
  },
};

/** UI 配置 */
export const uiConfig = {
  /** 預設主題 */
  defaultTheme: 'dark' as const,
  
  /** 側邊欄預設寬度 */
  sidebarWidth: 280,
  
  /** 面板最小高度 */
  panelMinHeight: 200,
  
  /** 動畫持續時間 (ms) */
  animationDuration: 200,
  
  /** Toast 顯示時間 (ms) */
  toastDuration: 3000,
  
  /** 自動儲存間隔 (ms) */
  autoSaveInterval: 30000,
};

export default config;
