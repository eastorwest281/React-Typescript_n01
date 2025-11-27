/**
 * Zustand Stores 統一導出
 */

export { useSelectionStore } from './selectionStore';
export { useViewerStore } from './viewerStore';
export { useModelStore } from './modelStore';

// 導出選擇器 - 顯式命名避免衝突
export {
  selectSelectedComponentId,
  selectSelectedComponent,
  selectHighlightedComponentIds,
  selectIsComponentSelected,
  selectIsComponentHighlighted,
} from './selectionStore';

export {
  selectActiveTab,
  selectIsLoading as selectViewerIsLoading,
  selectError as selectViewerError,
} from './viewerStore';

export {
  selectFactoryModel,
  selectComponents,
  selectPointClouds,
  selectFloors,
  selectIsLoading as selectModelIsLoading,
  selectLoadingProgress,
  selectError as selectModelError,
} from './modelStore';
