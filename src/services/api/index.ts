/**
 * API 服務層
 * 統一管理 API 調用，支持切換 Mock 數據和真實 API
 */

import { config } from '@/config';
import type { FactoryModel, DocumentInfo, FloorInfo, ApiResponse, Component3D } from '@/types';
import {
  mockFactoryModel,
  mockISODocuments,
  mockPIDDocuments,
  mockFloors,
  mockFloorPlanDocuments,
  mockPDFDocuments,
} from '../mock';

/** 模擬 API 延遲 */
const simulateDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/** 創建成功回應 */
const createSuccessResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
  error: null,
  timestamp: new Date().toISOString(),
});

/** 創建錯誤回應 */
const createErrorResponse = <T>(message: string, code: string = 'ERROR'): ApiResponse<T> => ({
  success: false,
  data: null,
  error: { code, message },
  timestamp: new Date().toISOString(),
});

/**
 * 模型 API 服務
 */
export const modelApi = {
  /** 獲取工廠模型 */
  async getFactoryModel(): Promise<ApiResponse<FactoryModel>> {
    if (config.enableMockData) {
      await simulateDelay(800);
      return createSuccessResponse(mockFactoryModel);
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/models/factory`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return createSuccessResponse(data);
    } catch (error) {
      console.error('Failed to fetch factory model:', error);
      return createErrorResponse('無法載入工廠模型');
    }
  },

  /** 獲取單個配件詳情 */
  async getComponentById(id: string): Promise<ApiResponse<Component3D>> {
    if (config.enableMockData) {
      await simulateDelay(300);
      const component = mockFactoryModel.components.find((c) => c.id === id);
      if (component) {
        return createSuccessResponse(component);
      }
      return createErrorResponse('找不到指定配件', 'NOT_FOUND');
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/components/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return createSuccessResponse(data);
    } catch (error) {
      console.error('Failed to fetch component:', error);
      return createErrorResponse('無法載入配件資料');
    }
  },

  /** 搜尋配件 */
  async searchComponents(query: string): Promise<ApiResponse<Component3D[]>> {
    if (config.enableMockData) {
      await simulateDelay(400);
      const lowerQuery = query.toLowerCase();
      const results = mockFactoryModel.components.filter(
        (c) =>
          c.name.toLowerCase().includes(lowerQuery) ||
          c.metadata.tag.toLowerCase().includes(lowerQuery) ||
          c.metadata.description.toLowerCase().includes(lowerQuery)
      );
      return createSuccessResponse(results);
    }

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/components/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return createSuccessResponse(data);
    } catch (error) {
      console.error('Failed to search components:', error);
      return createErrorResponse('搜尋失敗');
    }
  },
};

/**
 * 文件 API 服務
 */
export const documentApi = {
  /** 獲取 ISO 文件列表 */
  async getISODocuments(): Promise<ApiResponse<DocumentInfo[]>> {
    if (config.enableMockData) {
      await simulateDelay(500);
      return createSuccessResponse(mockISODocuments);
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/documents/iso`);
      const data = await response.json();
      return createSuccessResponse(data);
    } catch (error) {
      console.error('Failed to fetch ISO documents:', error);
      return createErrorResponse('無法載入 ISO 文件');
    }
  },

  /** 獲取配件相關的 ISO 文件 */
  async getISODocumentForComponent(componentId: string): Promise<ApiResponse<DocumentInfo | null>> {
    if (config.enableMockData) {
      await simulateDelay(300);
      const doc = mockISODocuments.find((d) => d.relatedComponents.includes(componentId));
      return createSuccessResponse(doc ?? null);
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/documents/iso/component/${componentId}`);
      const data = await response.json();
      return createSuccessResponse(data);
    } catch (error) {
      console.error('Failed to fetch ISO document:', error);
      return createErrorResponse('無法載入 ISO 文件');
    }
  },

  /** 獲取 P&ID 文件列表 */
  async getPIDDocuments(): Promise<ApiResponse<DocumentInfo[]>> {
    if (config.enableMockData) {
      await simulateDelay(500);
      return createSuccessResponse(mockPIDDocuments);
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/documents/pid`);
      const data = await response.json();
      return createSuccessResponse(data);
    } catch (error) {
      console.error('Failed to fetch P&ID documents:', error);
      return createErrorResponse('無法載入 P&ID 文件');
    }
  },

  /** 獲取樓層資訊 */
  async getFloors(): Promise<ApiResponse<FloorInfo[]>> {
    if (config.enableMockData) {
      await simulateDelay(400);
      return createSuccessResponse(mockFloors);
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/floors`);
      const data = await response.json();
      return createSuccessResponse(data);
    } catch (error) {
      console.error('Failed to fetch floors:', error);
      return createErrorResponse('無法載入樓層資料');
    }
  },

  /** 獲取平配圖文件 */
  async getFloorPlanDocuments(): Promise<ApiResponse<DocumentInfo[]>> {
    if (config.enableMockData) {
      await simulateDelay(400);
      return createSuccessResponse(mockFloorPlanDocuments);
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/documents/floorplan`);
      const data = await response.json();
      return createSuccessResponse(data);
    } catch (error) {
      console.error('Failed to fetch floor plan documents:', error);
      return createErrorResponse('無法載入平配圖');
    }
  },

  /** 獲取 PDF 文件列表 */
  async getPDFDocuments(): Promise<ApiResponse<DocumentInfo[]>> {
    if (config.enableMockData) {
      await simulateDelay(500);
      return createSuccessResponse(mockPDFDocuments);
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/documents/pdf`);
      const data = await response.json();
      return createSuccessResponse(data);
    } catch (error) {
      console.error('Failed to fetch PDF documents:', error);
      return createErrorResponse('無法載入 PDF 文件');
    }
  },
};
