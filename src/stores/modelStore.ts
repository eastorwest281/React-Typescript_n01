/**
 * 模型數據狀態管理 Store
 * 管理 3D 模型、配件、點雲等數據
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { FactoryModel, Component3D, PointCloudData, FloorInfo, DocumentInfo } from '@/types';

interface ModelState {
  /** 當前載入的工廠模型 */
  factoryModel: FactoryModel | null;
  /** 配件映射表 (快速查找) */
  componentsMap: Map<string, Component3D>;
  /** 點雲數據列表 */
  pointClouds: PointCloudData[];
  /** 樓層資訊列表 */
  floors: FloorInfo[];
  /** ISO 文件列表 */
  isoDocuments: DocumentInfo[];
  /** P&ID 文件列表 */
  pidDocuments: DocumentInfo[];
  /** PDF 文件列表 */
  pdfDocuments: DocumentInfo[];
  /** 載入進度 */
  loadingProgress: number;
  /** 是否正在載入 */
  isLoading: boolean;
  /** 錯誤訊息 */
  error: string | null;
}

interface ModelActions {
  /** 設置工廠模型 */
  setFactoryModel: (model: FactoryModel) => void;
  /** 清除工廠模型 */
  clearFactoryModel: () => void;
  /** 根據 ID 獲取配件 */
  getComponentById: (id: string) => Component3D | undefined;
  /** 根據類型過濾配件 */
  getComponentsByType: (type: string) => Component3D[];
  /** 搜尋配件 */
  searchComponents: (query: string) => Component3D[];
  /** 設置點雲數據 */
  setPointClouds: (pointClouds: PointCloudData[]) => void;
  /** 設置樓層資訊 */
  setFloors: (floors: FloorInfo[]) => void;
  /** 設置 ISO 文件 */
  setISODocuments: (documents: DocumentInfo[]) => void;
  /** 設置 P&ID 文件 */
  setPIDDocuments: (documents: DocumentInfo[]) => void;
  /** 設置 PDF 文件 */
  setPDFDocuments: (documents: DocumentInfo[]) => void;
  /** 獲取配件關聯的 ISO 文件 */
  getISODocumentForComponent: (componentId: string) => DocumentInfo | undefined;
  /** 獲取配件關聯的 P&ID 文件 */
  getPIDDocumentForComponent: (componentId: string) => DocumentInfo | undefined;
  /** 設置載入進度 */
  setLoadingProgress: (progress: number) => void;
  /** 設置載入狀態 */
  setLoading: (isLoading: boolean) => void;
  /** 設置錯誤 */
  setError: (error: string | null) => void;
}

type ModelStore = ModelState & ModelActions;

export const useModelStore = create<ModelStore>()(
  devtools(
    (set, get) => ({
      // 初始狀態
      factoryModel: null,
      componentsMap: new Map(),
      pointClouds: [],
      floors: [],
      isoDocuments: [],
      pidDocuments: [],
      pdfDocuments: [],
      loadingProgress: 0,
      isLoading: false,
      error: null,

      // 動作
      setFactoryModel: (model) => {
        // 建立配件映射表以便快速查找
        const componentsMap = new Map<string, Component3D>();
        model.components.forEach((component) => {
          componentsMap.set(component.id, component);
        });

        set({
          factoryModel: model,
          componentsMap,
          pointClouds: model.pointClouds,
          isLoading: false,
          loadingProgress: 100,
          error: null,
        });
      },

      clearFactoryModel: () => {
        set({
          factoryModel: null,
          componentsMap: new Map(),
          pointClouds: [],
          loadingProgress: 0,
        });
      },

      getComponentById: (id) => {
        return get().componentsMap.get(id);
      },

      getComponentsByType: (type) => {
        const model = get().factoryModel;
        if (!model) return [];
        return model.components.filter((c) => c.type === type);
      },

      searchComponents: (query) => {
        const model = get().factoryModel;
        if (!model) return [];

        const lowerQuery = query.toLowerCase();
        return model.components.filter(
          (c) =>
            c.name.toLowerCase().includes(lowerQuery) ||
            c.metadata.tag.toLowerCase().includes(lowerQuery) ||
            c.metadata.description.toLowerCase().includes(lowerQuery)
        );
      },

      setPointClouds: (pointClouds) => {
        set({ pointClouds });
      },

      setFloors: (floors) => {
        set({ floors });
      },

      setISODocuments: (documents) => {
        set({ isoDocuments: documents });
      },

      setPIDDocuments: (documents) => {
        set({ pidDocuments: documents });
      },

      setPDFDocuments: (documents) => {
        set({ pdfDocuments: documents });
      },

      getISODocumentForComponent: (componentId) => {
        return get().isoDocuments.find((doc) =>
          doc.relatedComponents.includes(componentId)
        );
      },

      getPIDDocumentForComponent: (componentId) => {
        return get().pidDocuments.find((doc) =>
          doc.relatedComponents.includes(componentId)
        );
      },

      setLoadingProgress: (progress) => {
        set({ loadingProgress: Math.min(100, Math.max(0, progress)) });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },
    }),
    { name: 'model-store' }
  )
);

// 選擇器
export const selectFactoryModel = (state: ModelStore) => state.factoryModel;
export const selectComponents = (state: ModelStore) => state.factoryModel?.components ?? [];
export const selectPointClouds = (state: ModelStore) => state.pointClouds;
export const selectFloors = (state: ModelStore) => state.floors;
export const selectIsLoading = (state: ModelStore) => state.isLoading;
export const selectLoadingProgress = (state: ModelStore) => state.loadingProgress;
export const selectError = (state: ModelStore) => state.error;
