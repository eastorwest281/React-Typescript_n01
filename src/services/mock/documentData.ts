/**
 * Mock 數據 - 文件資料 (ISO、P&ID、平配圖、PDF)
 */

import type { DocumentInfo, FloorInfo } from '@/types';

/** 模擬 ISO 文件 */
export const mockISODocuments: DocumentInfo[] = [
  {
    id: 'iso-001',
    name: 'ISO-P101-001 主製程管線',
    type: 'iso',
    url: '/mock/documents/iso/ISO-P101-001.svg',
    thumbnailUrl: '/mock/documents/iso/thumb/ISO-P101-001.png',
    pageCount: 3,
    currentPage: 1,
    relatedComponents: ['valve-001', 'valve-002', 'valve-003', 'pipe-001'],
    metadata: {
      revision: 'Rev.3',
      drawingDate: '2024-03-15',
      approvedBy: 'John Smith',
      projectNumber: 'PRJ-2024-001',
    },
  },
  {
    id: 'iso-002',
    name: 'ISO-P102-001 泵浦管線',
    type: 'iso',
    url: '/mock/documents/iso/ISO-P102-001.svg',
    thumbnailUrl: '/mock/documents/iso/thumb/ISO-P102-001.png',
    pageCount: 2,
    currentPage: 1,
    relatedComponents: ['pump-001'],
    metadata: {
      revision: 'Rev.2',
      drawingDate: '2024-02-20',
      approvedBy: 'John Smith',
      projectNumber: 'PRJ-2024-001',
    },
  },
  {
    id: 'iso-003',
    name: 'ISO-T101-001 儲槽管線',
    type: 'iso',
    url: '/mock/documents/iso/ISO-T101-001.svg',
    thumbnailUrl: '/mock/documents/iso/thumb/ISO-T101-001.png',
    pageCount: 4,
    currentPage: 1,
    relatedComponents: ['tank-001'],
    metadata: {
      revision: 'Rev.1',
      drawingDate: '2024-01-10',
      approvedBy: 'Jane Doe',
      projectNumber: 'PRJ-2024-001',
    },
  },
  {
    id: 'iso-004',
    name: 'ISO-E101-001 熱交換器管線',
    type: 'iso',
    url: '/mock/documents/iso/ISO-E101-001.svg',
    thumbnailUrl: '/mock/documents/iso/thumb/ISO-E101-001.png',
    pageCount: 2,
    currentPage: 1,
    relatedComponents: ['hx-001'],
    metadata: {
      revision: 'Rev.2',
      drawingDate: '2024-03-01',
      approvedBy: 'Jane Doe',
      projectNumber: 'PRJ-2024-001',
    },
  },
];

/** 模擬 P&ID 文件 */
export const mockPIDDocuments: DocumentInfo[] = [
  {
    id: 'pid-001',
    name: 'PID-100 原料進料系統',
    type: 'pid',
    url: '/mock/documents/pid/PID-100.svg',
    thumbnailUrl: '/mock/documents/pid/thumb/PID-100.png',
    pageCount: 1,
    currentPage: 1,
    relatedComponents: ['valve-001', 'valve-002', 'valve-003', 'pump-001', 'pipe-001'],
    metadata: {
      revision: 'Rev.5',
      drawingDate: '2024-04-01',
      approvedBy: 'Project Manager',
      projectNumber: 'PRJ-2024-001',
      area: 'Process Area 1',
    },
  },
  {
    id: 'pid-002',
    name: 'PID-200 反應系統',
    type: 'pid',
    url: '/mock/documents/pid/PID-200.svg',
    thumbnailUrl: '/mock/documents/pid/thumb/PID-200.png',
    pageCount: 1,
    currentPage: 1,
    relatedComponents: ['vessel-001', 'hx-001'],
    metadata: {
      revision: 'Rev.4',
      drawingDate: '2024-04-05',
      approvedBy: 'Project Manager',
      projectNumber: 'PRJ-2024-001',
      area: 'Process Area 2',
    },
  },
  {
    id: 'pid-003',
    name: 'PID-300 公用系統',
    type: 'pid',
    url: '/mock/documents/pid/PID-300.svg',
    thumbnailUrl: '/mock/documents/pid/thumb/PID-300.png',
    pageCount: 1,
    currentPage: 1,
    relatedComponents: ['compressor-001'],
    metadata: {
      revision: 'Rev.3',
      drawingDate: '2024-03-20',
      approvedBy: 'Project Manager',
      projectNumber: 'PRJ-2024-001',
      area: 'Utility Area',
    },
  },
];

/** 模擬平配圖 (樓層資訊) */
export const mockFloors: FloorInfo[] = [
  {
    id: 'floor-001',
    name: '1F 地面層',
    level: 1,
    elevation: 0,
    planImageUrl: '/mock/documents/floorplan/1F.svg',
    components: ['pump-001', 'tank-001', 'vessel-001', 'compressor-001'],
  },
  {
    id: 'floor-002',
    name: '2F 管架層',
    level: 2,
    elevation: 5,
    planImageUrl: '/mock/documents/floorplan/2F.svg',
    components: ['valve-001', 'valve-002', 'valve-003', 'pipe-001', 'hx-001'],
  },
  {
    id: 'floor-003',
    name: '3F 操作層',
    level: 3,
    elevation: 10,
    planImageUrl: '/mock/documents/floorplan/3F.svg',
    components: ['instrument-001'],
  },
];

/** 模擬平配圖文件 */
export const mockFloorPlanDocuments: DocumentInfo[] = mockFloors.map((floor) => ({
  id: `floorplan-${floor.id}`,
  name: `平配圖 - ${floor.name}`,
  type: 'floorplan' as const,
  url: floor.planImageUrl,
  thumbnailUrl: floor.planImageUrl.replace('.svg', '-thumb.png'),
  pageCount: 1,
  currentPage: 1,
  relatedComponents: floor.components,
  metadata: {
    level: floor.level,
    elevation: floor.elevation,
  },
}));

/** 模擬 PDF 文件 */
export const mockPDFDocuments: DocumentInfo[] = [
  {
    id: 'pdf-001',
    name: '設備操作手冊 - 泵浦 P-101',
    type: 'pdf',
    url: '/mock/documents/pdf/pump-p101-manual.pdf',
    thumbnailUrl: '/mock/documents/pdf/thumb/pump-p101-manual.png',
    pageCount: 45,
    currentPage: 1,
    relatedComponents: ['pump-001'],
    metadata: {
      documentType: 'Operation Manual',
      language: 'Chinese',
      version: 'v2.1',
    },
  },
  {
    id: 'pdf-002',
    name: '維護記錄 - 熱交換器 E-101',
    type: 'pdf',
    url: '/mock/documents/pdf/hx-e101-maintenance.pdf',
    thumbnailUrl: '/mock/documents/pdf/thumb/hx-e101-maintenance.png',
    pageCount: 12,
    currentPage: 1,
    relatedComponents: ['hx-001'],
    metadata: {
      documentType: 'Maintenance Record',
      language: 'Chinese',
      lastUpdated: '2024-03-20',
    },
  },
  {
    id: 'pdf-003',
    name: '安全資料表 - 製程化學品',
    type: 'pdf',
    url: '/mock/documents/pdf/process-chemicals-sds.pdf',
    thumbnailUrl: '/mock/documents/pdf/thumb/process-chemicals-sds.png',
    pageCount: 28,
    currentPage: 1,
    relatedComponents: ['tank-001', 'vessel-001'],
    metadata: {
      documentType: 'Safety Data Sheet',
      language: 'Chinese',
      version: 'v3.0',
    },
  },
  {
    id: 'pdf-004',
    name: '閥門規格書',
    type: 'pdf',
    url: '/mock/documents/pdf/valve-specifications.pdf',
    thumbnailUrl: '/mock/documents/pdf/thumb/valve-specifications.png',
    pageCount: 20,
    currentPage: 1,
    relatedComponents: ['valve-001', 'valve-002', 'valve-003'],
    metadata: {
      documentType: 'Specification',
      language: 'English',
      version: 'v1.5',
    },
  },
];
