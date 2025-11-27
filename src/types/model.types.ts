/**
 * 3D 模型相關類型定義
 */

/** 3D 座標點 */
export interface Point3D {
  x: number;
  y: number;
  z: number;
}

/** 3D 配件/組件 */
export interface Component3D {
  id: string;
  name: string;
  type: ComponentType;
  position: Point3D;
  rotation: Point3D;
  scale: Point3D;
  modelUrl?: string;
  parentId?: string;
  children?: string[];
  metadata: ComponentMetadata;
  isoReference?: ISOReference;
  pidReference?: PIDReference;
}

/** 配件類型枚舉 */
export type ComponentType = 
  | 'pipe'
  | 'valve'
  | 'pump'
  | 'tank'
  | 'vessel'
  | 'heat_exchanger'
  | 'compressor'
  | 'instrument'
  | 'equipment'
  | 'structure'
  | 'other';

/** 配件元數據 */
export interface ComponentMetadata {
  tag: string;                    // 設備標籤
  description: string;            // 描述
  manufacturer?: string;          // 製造商
  model?: string;                 // 型號
  material?: string;              // 材質
  specification?: string;         // 規格
  installDate?: string;           // 安裝日期
  lastMaintenance?: string;       // 最後維護日期
  status: ComponentStatus;        // 狀態
  customAttributes?: Record<string, string | number | boolean>;
}

/** 配件狀態 */
export type ComponentStatus = 
  | 'active'
  | 'inactive'
  | 'maintenance'
  | 'fault'
  | 'unknown';

/** ISO 圖參考 */
export interface ISOReference {
  isoId: string;
  isoNumber: string;
  sheetNumber: number;
  highlightArea?: BoundingBox2D;
}

/** P&ID 圖參考 */
export interface PIDReference {
  pidId: string;
  pidNumber: string;
  symbolId: string;
  highlightArea?: BoundingBox2D;
}

/** 2D 邊界框 */
export interface BoundingBox2D {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 3D 邊界框 */
export interface BoundingBox3D {
  min: Point3D;
  max: Point3D;
}

/** 點雲數據 */
export interface PointCloudData {
  id: string;
  name: string;
  pointCount: number;
  bounds: BoundingBox3D;
  url: string;
  format: 'las' | 'laz' | 'ply' | 'xyz' | 'pts';
  metadata?: Record<string, unknown>;
}

/** 工廠模型 */
export interface FactoryModel {
  id: string;
  name: string;
  description: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  components: Component3D[];
  pointClouds: PointCloudData[];
  bounds: BoundingBox3D;
}

/** 樓層資訊 */
export interface FloorInfo {
  id: string;
  name: string;
  level: number;
  elevation: number;
  planImageUrl: string;
  components: string[]; // Component IDs on this floor
}
