/**
 * 視圖狀態管理 Store
 * 管理各視圖的狀態和設定
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { 
  ViewerType, 
  ThreeDViewerSettings, 
  PointCloudViewerSettings, 
  ISOViewerSettings,
  LayoutMode,
  LayoutConfig,
  MiniViewPosition,
  SidebarContent,
} from '@/types';
import { DEFAULT_3D_VIEWER_SETTINGS, DEFAULT_POINT_CLOUD_SETTINGS, STORAGE_KEYS, DEFAULT_LAYOUT_CONFIG } from '@/constants';

interface ViewerState {
  /** 當前活動的視圖 Tab */
  activeTab: ViewerType;
  /** 各視圖的載入狀態 */
  loadingStates: Record<ViewerType, boolean>;
  /** 各視圖的錯誤狀態 */
  errorStates: Record<ViewerType, string | null>;
  /** 3D 視圖設定 */
  threeDSettings: ThreeDViewerSettings;
  /** 點雲視圖設定 */
  pointCloudSettings: PointCloudViewerSettings;
  /** ISO 視圖設定 */
  isoSettings: ISOViewerSettings;
  /** 側邊面板是否展開 */
  isSidePanelOpen: boolean;
  /** 側邊面板寬度 */
  sidePanelWidth: number;
  /** 底部面板是否展開 */
  isBottomPanelOpen: boolean;
  /** 底部面板高度 */
  bottomPanelHeight: number;
  /** 全螢幕模式 */
  isFullscreen: boolean;
  /** 排版配置 */
  layoutConfig: LayoutConfig;
  /** 主視圖選擇 (3D/點雲) */
  primaryView: '3d' | 'pointcloud';
  /** 小視窗當前顯示的內容 (map 模式) */
  floatingPanels: ViewerType[];
}

interface ViewerActions {
  /** 設置活動 Tab */
  setActiveTab: (tab: ViewerType) => void;
  /** 設置載入狀態 */
  setLoading: (viewer: ViewerType, isLoading: boolean) => void;
  /** 設置錯誤狀態 */
  setError: (viewer: ViewerType, error: string | null) => void;
  /** 更新 3D 視圖設定 */
  updateThreeDSettings: (settings: Partial<ThreeDViewerSettings>) => void;
  /** 更新點雲視圖設定 */
  updatePointCloudSettings: (settings: Partial<PointCloudViewerSettings>) => void;
  /** 更新 ISO 視圖設定 */
  updateISOSettings: (settings: Partial<ISOViewerSettings>) => void;
  /** 切換側邊面板 */
  toggleSidePanel: () => void;
  /** 設置側邊面板寬度 */
  setSidePanelWidth: (width: number) => void;
  /** 切換底部面板 */
  toggleBottomPanel: () => void;
  /** 設置底部面板高度 */
  setBottomPanelHeight: (height: number) => void;
  /** 切換全螢幕 */
  toggleFullscreen: () => void;
  /** 重置所有設定 */
  resetSettings: () => void;
  /** 設置排版模式 */
  setLayoutMode: (mode: LayoutMode) => void;
  /** 更新排版配置 */
  updateLayoutConfig: (config: Partial<LayoutConfig>) => void;
  /** 設置小視窗位置 */
  setMiniViewPosition: (position: MiniViewPosition) => void;
  /** 切換小視窗展開狀態 */
  toggleMiniViewExpanded: () => void;
  /** 設置主視圖 */
  setPrimaryView: (view: '3d' | 'pointcloud') => void;
  /** 切換浮動面板 */
  toggleFloatingPanel: (panel: ViewerType) => void;
  /** 設置分割比例 */
  setSplitRatio: (ratio: number) => void;
  /** 設置垂直分割比例 */
  setVerticalRatio: (ratio: number) => void;
  /** 切換左側欄 */
  toggleLeftSidebar: () => void;
  /** 切換右側欄 */
  toggleRightSidebar: () => void;
  /** 設置左側欄寬度 */
  setLeftSidebarWidth: (width: number) => void;
  /** 設置右側欄寬度 */
  setRightSidebarWidth: (width: number) => void;
  /** 設置左側欄內容 */
  setLeftSidebarContent: (content: SidebarContent) => void;
  /** 設置右側欄內容 */
  setRightSidebarContent: (content: SidebarContent) => void;
}

type ViewerStore = ViewerState & ViewerActions;

const initialLoadingStates: Record<ViewerType, boolean> = {
  '3d': false,
  pointcloud: false,
  attributes: false,
  iso: false,
  pid: false,
  floorplan: false,
  pdf: false,
};

const initialErrorStates: Record<ViewerType, string | null> = {
  '3d': null,
  pointcloud: null,
  attributes: null,
  iso: null,
  pid: null,
  floorplan: null,
  pdf: null,
};

const initialISOSettings: ISOViewerSettings = {
  showDimensions: true,
  showAnnotations: true,
  highlightColor: '#00ff00',
  zoomLevel: 1,
};

export const useViewerStore = create<ViewerStore>()(
  devtools(
    persist(
      (set) => ({
        // 初始狀態
        activeTab: '3d',
        loadingStates: initialLoadingStates,
        errorStates: initialErrorStates,
        threeDSettings: DEFAULT_3D_VIEWER_SETTINGS,
        pointCloudSettings: DEFAULT_POINT_CLOUD_SETTINGS,
        isoSettings: initialISOSettings,
        isSidePanelOpen: true,
        sidePanelWidth: 280,
        isBottomPanelOpen: true,
        bottomPanelHeight: 300,
        isFullscreen: false,
        layoutConfig: DEFAULT_LAYOUT_CONFIG,
        primaryView: '3d',
        floatingPanels: ['pointcloud', 'attributes'],

        // 動作
        setActiveTab: (tab) => {
          set({ activeTab: tab });
        },

        setLoading: (viewer, isLoading) => {
          set((state) => ({
            loadingStates: {
              ...state.loadingStates,
              [viewer]: isLoading,
            },
          }));
        },

        setError: (viewer, error) => {
          set((state) => ({
            errorStates: {
              ...state.errorStates,
              [viewer]: error,
            },
          }));
        },

        updateThreeDSettings: (settings) => {
          set((state) => ({
            threeDSettings: {
              ...state.threeDSettings,
              ...settings,
            },
          }));
        },

        updatePointCloudSettings: (settings) => {
          set((state) => ({
            pointCloudSettings: {
              ...state.pointCloudSettings,
              ...settings,
            },
          }));
        },

        updateISOSettings: (settings) => {
          set((state) => ({
            isoSettings: {
              ...state.isoSettings,
              ...settings,
            },
          }));
        },

        toggleSidePanel: () => {
          set((state) => ({ isSidePanelOpen: !state.isSidePanelOpen }));
        },

        setSidePanelWidth: (width) => {
          set({ sidePanelWidth: Math.max(200, Math.min(600, width)) });
        },

        toggleBottomPanel: () => {
          set((state) => ({ isBottomPanelOpen: !state.isBottomPanelOpen }));
        },

        setBottomPanelHeight: (height) => {
          set({ bottomPanelHeight: Math.max(150, Math.min(500, height)) });
        },

        toggleFullscreen: () => {
          set((state) => ({ isFullscreen: !state.isFullscreen }));
        },

        resetSettings: () => {
          set({
            threeDSettings: DEFAULT_3D_VIEWER_SETTINGS,
            pointCloudSettings: DEFAULT_POINT_CLOUD_SETTINGS,
            isoSettings: initialISOSettings,
            sidePanelWidth: 280,
            bottomPanelHeight: 300,
            layoutConfig: DEFAULT_LAYOUT_CONFIG,
          });
        },

        setLayoutMode: (mode) => {
          set((state) => ({
            layoutConfig: {
              ...state.layoutConfig,
              mode,
            },
          }));
        },

        updateLayoutConfig: (config) => {
          set((state) => ({
            layoutConfig: {
              ...state.layoutConfig,
              ...config,
            },
          }));
        },

        setMiniViewPosition: (position) => {
          set((state) => ({
            layoutConfig: {
              ...state.layoutConfig,
              miniViewPosition: position,
            },
          }));
        },

        toggleMiniViewExpanded: () => {
          set((state) => ({
            layoutConfig: {
              ...state.layoutConfig,
              miniViewExpanded: !state.layoutConfig.miniViewExpanded,
            },
          }));
        },

        setPrimaryView: (view) => {
          set({ primaryView: view });
        },

        toggleFloatingPanel: (panel) => {
          set((state) => {
            const panels = state.floatingPanels;
            const index = panels.indexOf(panel);
            if (index >= 0) {
              return { floatingPanels: panels.filter((p) => p !== panel) };
            }
            return { floatingPanels: [...panels, panel] };
          });
        },

        setSplitRatio: (ratio) => {
          set((state) => ({
            layoutConfig: {
              ...state.layoutConfig,
              splitRatio: Math.max(20, Math.min(80, ratio)),
            },
          }));
        },

        setVerticalRatio: (ratio) => {
          set((state) => ({
            layoutConfig: {
              ...state.layoutConfig,
              verticalRatio: Math.max(30, Math.min(80, ratio)),
            },
          }));
        },

        toggleLeftSidebar: () => {
          set((state) => ({
            layoutConfig: {
              ...state.layoutConfig,
              isLeftSidebarOpen: !state.layoutConfig.isLeftSidebarOpen,
            },
          }));
        },

        toggleRightSidebar: () => {
          set((state) => ({
            layoutConfig: {
              ...state.layoutConfig,
              isRightSidebarOpen: !state.layoutConfig.isRightSidebarOpen,
            },
          }));
        },

        setLeftSidebarWidth: (width) => {
          set((state) => ({
            layoutConfig: {
              ...state.layoutConfig,
              leftSidebarWidth: Math.max(200, Math.min(400, width)),
            },
          }));
        },

        setRightSidebarWidth: (width) => {
          set((state) => ({
            layoutConfig: {
              ...state.layoutConfig,
              rightSidebarWidth: Math.max(200, Math.min(400, width)),
            },
          }));
        },

        setLeftSidebarContent: (content) => {
          set((state) => ({
            layoutConfig: {
              ...state.layoutConfig,
              leftSidebarContent: content,
            },
          }));
        },

        setRightSidebarContent: (content) => {
          set((state) => ({
            layoutConfig: {
              ...state.layoutConfig,
              rightSidebarContent: content,
            },
          }));
        },
      }),
      {
        name: STORAGE_KEYS.VIEWER_SETTINGS,
        partialize: (state) => ({
          threeDSettings: state.threeDSettings,
          pointCloudSettings: state.pointCloudSettings,
          isoSettings: state.isoSettings,
          sidePanelWidth: state.sidePanelWidth,
          bottomPanelHeight: state.bottomPanelHeight,
          layoutConfig: state.layoutConfig,
          primaryView: state.primaryView,
        }),
      }
    ),
    { name: 'viewer-store' }
  )
);

// 選擇器
export const selectActiveTab = (state: ViewerStore) => state.activeTab;
export const selectIsLoading = (viewer: ViewerType) => (state: ViewerStore) =>
  state.loadingStates[viewer];
export const selectError = (viewer: ViewerType) => (state: ViewerStore) =>
  state.errorStates[viewer];
