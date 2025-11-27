/**
 * 視圖元件相關類型定義
 */

import type { Component3D, BoundingBox2D } from './model.types';

/** 視圖類型 */
export type ViewerType = 
  | '3d'
  | 'pointcloud'
  | 'iso'
  | 'pid'
  | 'floorplan'
  | 'pdf'
  | 'attributes';

/** 
 * 排版模式類型
 * - vertical: 上下排版（主視圖在上，面板在下）
 * - split: 四區塊排版（左右側欄 + 上下主區）
 * - map: 類似 Google Map 的大小圖模式（主視圖全螢幕，小視窗浮動）
 */
export type LayoutMode = 'vertical' | 'split' | 'map';

/** 小視窗位置 */
export type MiniViewPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

/** 側欄內容類型 */
export type SidebarContent = 'componentlist' | 'attributes' | 'iso' | 'pid' | 'floorplan' | 'pdf' | 'pointcloud' | '3d';

/** 排版模式配置 */
export interface LayoutConfig {
  mode: LayoutMode;
  /** 小視窗位置（僅 map 模式使用） */
  miniViewPosition: MiniViewPosition;
  /** 小視窗是否展開 */
  miniViewExpanded: boolean;
  /** 小視窗大小（百分比） */
  miniViewSize: number;
  /** 左右分割比例（僅舊版 split 模式使用） */
  splitRatio: number;
  /** 上下分割比例 */
  verticalRatio: number;
  /** 左側欄寬度 */
  leftSidebarWidth: number;
  /** 右側欄寬度 */
  rightSidebarWidth: number;
  /** 左側欄是否展開 */
  isLeftSidebarOpen: boolean;
  /** 右側欄是否展開 */
  isRightSidebarOpen: boolean;
  /** 左側欄顯示內容 */
  leftSidebarContent: SidebarContent;
  /** 右側欄顯示內容 */
  rightSidebarContent: SidebarContent;
}

/** 視圖狀態 */
export interface ViewerState {
  activeViewer: ViewerType;
  isLoading: boolean;
  error: string | null;
  zoom: number;
  pan: { x: number; y: number };
}

/** 選中狀態 */
export interface SelectionState {
  selectedComponentId: string | null;
  selectedComponent: Component3D | null;
  highlightedComponentIds: string[];
  selectionSource: ViewerType | null;
}

/** 相機設定 */
export interface CameraSettings {
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  fov: number;
  near: number;
  far: number;
}

/** 3D 視圖設定 */
export interface ThreeDViewerSettings {
  showGrid: boolean;
  showAxes: boolean;
  showLabels: boolean;
  wireframeMode: boolean;
  backgroundColor: string;
  ambientLightIntensity: number;
  enableShadows: boolean;
  autoRotate: boolean;
}

/** 點雲視圖設定 */
export interface PointCloudViewerSettings {
  pointSize: number;
  pointBudget: number;
  colorMode: 'rgb' | 'intensity' | 'classification' | 'height';
  showBoundingBox: boolean;
  edlEnabled: boolean;
}

/** ISO 視圖設定 */
export interface ISOViewerSettings {
  showDimensions: boolean;
  showAnnotations: boolean;
  highlightColor: string;
  zoomLevel: number;
}

/** 面板 Tab 項目 */
export interface TabItem {
  id: ViewerType;
  label: string;
  icon?: React.ComponentType;
  disabled?: boolean;
  badge?: string | number;
}

/** 屬性面板項目 */
export interface AttributeItem {
  key: string;
  label: string;
  value: string | number | boolean;
  type: 'text' | 'number' | 'boolean' | 'date' | 'link';
  editable?: boolean;
  category?: string;
}

/** 屬性面板分組 */
export interface AttributeGroup {
  id: string;
  title: string;
  collapsed: boolean;
  attributes: AttributeItem[];
}

/** 視圖工具列動作 */
export interface ToolbarAction {
  id: string;
  label: string;
  icon: React.ComponentType;
  action: () => void;
  disabled?: boolean;
  active?: boolean;
  tooltip?: string;
}

/** 文件資訊 (ISO/P&ID/PDF) */
export interface DocumentInfo {
  id: string;
  name: string;
  type: 'iso' | 'pid' | 'floorplan' | 'pdf';
  url: string;
  thumbnailUrl?: string;
  pageCount?: number;
  currentPage?: number;
  relatedComponents: string[];
  metadata?: Record<string, unknown>;
}

/** 高亮標記 */
export interface HighlightMarker {
  id: string;
  documentId: string;
  componentId: string;
  area: BoundingBox2D;
  color: string;
  label?: string;
}

/** 視圖同步事件 */
export interface ViewerSyncEvent {
  type: 'select' | 'highlight' | 'focus' | 'clear';
  source: ViewerType;
  componentId?: string;
  componentIds?: string[];
  timestamp: number;
}
