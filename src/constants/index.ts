/**
 * 應用程式常數定義
 */

import type { LayoutMode, LayoutConfig, MiniViewPosition } from '@/types';

/** 視圖 Tab 標籤 */
export const VIEWER_TABS = {
  THREE_D: '3d',
  POINT_CLOUD: 'pointcloud',
  ATTRIBUTES: 'attributes',
  ISO: 'iso',
  PID: 'pid',
  FLOOR_PLAN: 'floorplan',
  PDF: 'pdf',
} as const;

/** Tab 顯示名稱 */
export const TAB_LABELS: Record<string, string> = {
  [VIEWER_TABS.THREE_D]: '3D View',
  [VIEWER_TABS.POINT_CLOUD]: 'Point Cloud',
  [VIEWER_TABS.ATTRIBUTES]: 'Attributes',
  [VIEWER_TABS.ISO]: 'ISO 圖',
  [VIEWER_TABS.PID]: 'P&ID',
  [VIEWER_TABS.FLOOR_PLAN]: '平配圖',
  [VIEWER_TABS.PDF]: 'PDF',
};

/** 排版模式標籤 */
export const LAYOUT_MODE_LABELS: Record<LayoutMode, string> = {
  vertical: '上下排版',
  split: '四區塊',
  map: '地圖模式',
};

/** 排版模式描述 */
export const LAYOUT_MODE_DESCRIPTIONS: Record<LayoutMode, string> = {
  vertical: '主視圖在上方，詳細面板在下方',
  split: '左右側欄可收縮，上下主視圖區',
  map: '主視圖全螢幕，其他視窗浮動顯示',
};

/** 小視窗位置標籤 */
export const MINI_VIEW_POSITION_LABELS: Record<MiniViewPosition, string> = {
  'top-left': '左上',
  'top-right': '右上',
  'bottom-left': '左下',
  'bottom-right': '右下',
};

/** 預設排版配置 */
export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  mode: 'vertical',
  miniViewPosition: 'bottom-right',
  miniViewExpanded: true,
  miniViewSize: 25,
  splitRatio: 50,
  verticalRatio: 60,
  leftSidebarWidth: 300,
  rightSidebarWidth: 320,
  isLeftSidebarOpen: true,
  isRightSidebarOpen: true,
  leftSidebarContent: 'componentlist',
  rightSidebarContent: 'attributes',
};

/** 側欄內容標籤 */
export const SIDEBAR_CONTENT_LABELS: Record<string, string> = {
  componentlist: '配件列表',
  attributes: '屬性詳情',
  iso: 'ISO 圖',
  pid: 'P&ID',
  floorplan: '平配圖',
  pdf: 'PDF',
  pointcloud: '點雲',
  '3d': '3D 視圖',
};

/** 配件類型顯示名稱 */
export const COMPONENT_TYPE_LABELS: Record<string, string> = {
  pipe: '管線',
  valve: '閥門',
  pump: '泵浦',
  tank: '儲槽',
  vessel: '壓力容器',
  heat_exchanger: '熱交換器',
  compressor: '壓縮機',
  instrument: '儀器',
  equipment: '設備',
  structure: '結構',
  other: '其他',
};

/** 配件狀態顯示 */
export const COMPONENT_STATUS_LABELS: Record<string, string> = {
  active: '運作中',
  inactive: '停用',
  maintenance: '維護中',
  fault: '故障',
  unknown: '未知',
};

/** 配件狀態顏色 */
export const COMPONENT_STATUS_COLORS: Record<string, string> = {
  active: '#22c55e',      // green
  inactive: '#6b7280',    // gray
  maintenance: '#f59e0b', // amber
  fault: '#ef4444',       // red
  unknown: '#9ca3af',     // gray-400
};

/** 預設相機設定 */
export const DEFAULT_CAMERA_SETTINGS = {
  position: { x: 10, y: 10, z: 10 },
  target: { x: 0, y: 0, z: 0 },
  fov: 60,
  near: 0.1,
  far: 10000,
};

/** 3D 視圖預設設定 */
export const DEFAULT_3D_VIEWER_SETTINGS = {
  showGrid: true,
  showAxes: true,
  showLabels: true,
  wireframeMode: false,
  backgroundColor: '#1a1a2e',
  ambientLightIntensity: 0.5,
  enableShadows: true,
  autoRotate: false,
};

/** 點雲視圖預設設定 */
export const DEFAULT_POINT_CLOUD_SETTINGS = {
  pointSize: 1,
  pointBudget: 2000000,
  colorMode: 'rgb' as const,
  showBoundingBox: false,
  edlEnabled: true,
};

/** 選中高亮顏色 */
export const SELECTION_HIGHLIGHT_COLOR = '#00ff00';
export const HOVER_HIGHLIGHT_COLOR = '#ffff00';

/** 本地儲存鍵值 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'factory3d_auth_token',
  REFRESH_TOKEN: 'factory3d_refresh_token',
  USER_PREFERENCES: 'factory3d_user_prefs',
  VIEWER_SETTINGS: 'factory3d_viewer_settings',
  LAST_PROJECT: 'factory3d_last_project',
};

/** API 路徑 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  MODELS: {
    LIST: '/api/models',
    DETAIL: '/api/models/:id',
    COMPONENTS: '/api/models/:id/components',
  },
  DOCUMENTS: {
    ISO: '/api/documents/iso',
    PID: '/api/documents/pid',
    FLOOR_PLAN: '/api/documents/floorplan',
    PDF: '/api/documents/pdf',
  },
};

/** 檔案大小限制 (bytes) */
export const FILE_SIZE_LIMITS = {
  MODEL: 500 * 1024 * 1024,      // 500MB
  POINT_CLOUD: 1024 * 1024 * 1024, // 1GB
  DOCUMENT: 50 * 1024 * 1024,    // 50MB
  IMAGE: 10 * 1024 * 1024,       // 10MB
};

/** 允許的檔案類型 */
export const ALLOWED_FILE_TYPES = {
  MODEL: ['.gltf', '.glb', '.obj', '.fbx', '.ifc'],
  POINT_CLOUD: ['.las', '.laz', '.ply', '.xyz', '.pts'],
  DOCUMENT: ['.pdf', '.dwg', '.dxf'],
  IMAGE: ['.png', '.jpg', '.jpeg', '.svg', '.webp'],
};

/** 錯誤訊息 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '網路連線錯誤，請檢查您的網路連線',
  UNAUTHORIZED: '您沒有權限執行此操作',
  SESSION_EXPIRED: '登入已過期，請重新登入',
  FILE_TOO_LARGE: '檔案大小超過限制',
  INVALID_FILE_TYPE: '不支援的檔案格式',
  LOAD_FAILED: '載入失敗，請稍後再試',
  UNKNOWN_ERROR: '發生未知錯誤',
};
