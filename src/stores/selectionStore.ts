/**
 * 選中狀態管理 Store
 * 管理 3D 配件選中狀態，實現跨視圖同步
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import type { Component3D, ViewerType } from '@/types';

interface SelectionState {
  /** 當前選中的配件 ID */
  selectedComponentId: string | null;
  /** 當前選中的配件資料 */
  selectedComponent: Component3D | null;
  /** 高亮顯示的配件 ID 列表 */
  highlightedComponentIds: string[];
  /** 選中來源視圖 */
  selectionSource: ViewerType | null;
  /** 懸停的配件 ID */
  hoveredComponentId: string | null;
  /** 選中歷史記錄 (用於返回功能) */
  selectionHistory: string[];
}

interface SelectionActions {
  /** 選中配件 */
  selectComponent: (componentId: string | null, source: ViewerType, component?: Component3D) => void;
  /** 清除選中 */
  clearSelection: () => void;
  /** 設置高亮配件 */
  setHighlightedComponents: (componentIds: string[]) => void;
  /** 添加高亮配件 */
  addHighlightedComponent: (componentId: string) => void;
  /** 移除高亮配件 */
  removeHighlightedComponent: (componentId: string) => void;
  /** 清除所有高亮 */
  clearHighlights: () => void;
  /** 設置懸停配件 */
  setHoveredComponent: (componentId: string | null) => void;
  /** 返回上一個選中 */
  goBackSelection: () => void;
}

type SelectionStore = SelectionState & SelectionActions;

/** 最大歷史記錄數量 */
const MAX_HISTORY_LENGTH = 20;

export const useSelectionStore = create<SelectionStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // 初始狀態
      selectedComponentId: null,
      selectedComponent: null,
      highlightedComponentIds: [],
      selectionSource: null,
      hoveredComponentId: null,
      selectionHistory: [],

      // 動作
      selectComponent: (componentId, source, component) => {
        const currentId = get().selectedComponentId;
        
        set((state) => {
          // 更新歷史記錄
          const newHistory = currentId
            ? [...state.selectionHistory, currentId].slice(-MAX_HISTORY_LENGTH)
            : state.selectionHistory;

          return {
            selectedComponentId: componentId,
            selectedComponent: component ?? null,
            selectionSource: source,
            selectionHistory: newHistory,
            // 自動將選中的配件加入高亮
            highlightedComponentIds: componentId
              ? [componentId]
              : [],
          };
        });
      },

      clearSelection: () => {
        set({
          selectedComponentId: null,
          selectedComponent: null,
          selectionSource: null,
        });
      },

      setHighlightedComponents: (componentIds) => {
        set({ highlightedComponentIds: componentIds });
      },

      addHighlightedComponent: (componentId) => {
        set((state) => ({
          highlightedComponentIds: state.highlightedComponentIds.includes(componentId)
            ? state.highlightedComponentIds
            : [...state.highlightedComponentIds, componentId],
        }));
      },

      removeHighlightedComponent: (componentId) => {
        set((state) => ({
          highlightedComponentIds: state.highlightedComponentIds.filter(
            (id) => id !== componentId
          ),
        }));
      },

      clearHighlights: () => {
        set({ highlightedComponentIds: [] });
      },

      setHoveredComponent: (componentId) => {
        set({ hoveredComponentId: componentId });
      },

      goBackSelection: () => {
        const history = get().selectionHistory;
        if (history.length === 0) return;

        const previousId = history[history.length - 1];
        set({
          selectedComponentId: previousId,
          selectionHistory: history.slice(0, -1),
        });
      },
    })),
    { name: 'selection-store' }
  )
);

// 選擇器 (Selectors)
export const selectSelectedComponentId = (state: SelectionStore) => state.selectedComponentId;
export const selectSelectedComponent = (state: SelectionStore) => state.selectedComponent;
export const selectHighlightedComponentIds = (state: SelectionStore) => state.highlightedComponentIds;
export const selectIsComponentSelected = (componentId: string) => (state: SelectionStore) =>
  state.selectedComponentId === componentId;
export const selectIsComponentHighlighted = (componentId: string) => (state: SelectionStore) =>
  state.highlightedComponentIds.includes(componentId);
