/**
 * ISO 圖視圖元件
 * 顯示管線 ISO 圖，支援與 3D 配件關聯高亮
 */

import { useEffect, useState, useMemo } from 'react';
import { useSelectionStore, useModelStore, useViewerStore } from '@/stores';
import { Loading, EmptyState } from '@/components/common';
import { documentApi } from '@/services';
import type { DocumentInfo } from '@/types';

export function ISOViewer() {
  const { selectedComponentId, selectedComponent } = useSelectionStore();
  const { getComponentById } = useModelStore();
  const { setActiveTab } = useViewerStore();
  
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 載入 ISO 文件列表
  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      const response = await documentApi.getISODocuments();
      if (response.success && response.data) {
        setDocuments(response.data);
      }
      setIsLoading(false);
    };

    loadDocuments();
  }, []);

  // 當選中配件變更時，自動切換到關聯的 ISO 文件
  useEffect(() => {
    if (selectedComponentId) {
      const component = selectedComponent || getComponentById(selectedComponentId);
      if (component?.isoReference) {
        const relatedDoc = documents.find(
          (doc) => doc.id === component.isoReference?.isoId
        );
        if (relatedDoc) {
          setSelectedDoc(relatedDoc);
        }
      }
    }
  }, [selectedComponentId, selectedComponent, documents, getComponentById]);

  // 取得高亮區域
  const highlightArea = useMemo(() => {
    if (!selectedComponentId) return null;
    const component = selectedComponent || getComponentById(selectedComponentId);
    return component?.isoReference?.highlightArea || null;
  }, [selectedComponentId, selectedComponent, getComponentById]);

  if (isLoading) {
    return <Loading text="載入 ISO 圖..." />;
  }

  if (documents.length === 0) {
    return (
      <EmptyState
        title="無 ISO 圖資料"
        description="目前沒有可用的 ISO 圖文件"
      />
    );
  }

  return (
    <div className="flex h-full">
      {/* 文件列表側邊欄 */}
      <div className="w-64 border-r border-gray-700 bg-gray-850 overflow-y-auto">
        <div className="p-3 border-b border-gray-700">
          <h3 className="text-sm font-medium text-white">ISO 圖列表</h3>
        </div>
        <ul className="divide-y divide-gray-700">
          {documents.map((doc) => (
            <li key={doc.id}>
              <button
                className={`
                  w-full px-3 py-2 text-left text-sm transition-colors
                  ${selectedDoc?.id === doc.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                  }
                `}
                onClick={() => setSelectedDoc(doc)}
              >
                <div className="font-medium truncate">{doc.name}</div>
                <div className="text-xs opacity-70">
                  {doc.metadata?.revision} | {doc.pageCount} 頁
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ISO 圖顯示區域 */}
      <div className="flex-1 relative bg-gray-900 overflow-auto">
        {selectedDoc ? (
          <div className="relative p-4">
            {/* 工具列 */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white" title="放大">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </button>
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white" title="縮小">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              </button>
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white" title="適應視窗">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>

            {/* 模擬 ISO 圖 */}
            <div className="relative bg-white rounded-lg shadow-lg" style={{ minHeight: '500px' }}>
              {/* 模擬圖紙邊框 */}
              <div className="absolute inset-4 border-2 border-gray-300">
                {/* 標題欄 */}
                <div className="absolute bottom-0 right-0 w-64 h-32 border-l-2 border-t-2 border-gray-300 bg-gray-50 p-2">
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>圖號: {selectedDoc.name.split(' ')[0]}</div>
                    <div>版本: {String(selectedDoc.metadata?.revision || 'N/A')}</div>
                    <div>日期: {String(selectedDoc.metadata?.drawingDate || 'N/A')}</div>
                    <div>核准: {String(selectedDoc.metadata?.approvedBy || 'N/A')}</div>
                  </div>
                </div>

                {/* 模擬管線圖 */}
                <svg className="w-full h-full" viewBox="0 0 800 500">
                  {/* 管線 */}
                  <line x1="100" y1="200" x2="700" y2="200" stroke="#333" strokeWidth="4" />
                  <line x1="400" y1="200" x2="400" y2="350" stroke="#333" strokeWidth="4" />
                  
                  {/* 閥門符號 */}
                  <g transform="translate(200, 180)">
                    <polygon points="0,0 20,20 40,0 40,40 20,20 0,40" fill="none" stroke="#333" strokeWidth="2" />
                    <text x="20" y="55" textAnchor="middle" fontSize="10" fill="#333">V-101</text>
                  </g>
                  
                  <g transform="translate(350, 180)">
                    <polygon points="0,0 20,20 40,0 40,40 20,20 0,40" fill="none" stroke="#333" strokeWidth="2" />
                    <text x="20" y="55" textAnchor="middle" fontSize="10" fill="#333">V-102</text>
                  </g>

                  {/* 泵浦符號 */}
                  <g transform="translate(500, 180)">
                    <circle cx="20" cy="20" r="20" fill="none" stroke="#333" strokeWidth="2" />
                    <polygon points="20,0 40,20 20,40" fill="none" stroke="#333" strokeWidth="2" />
                    <text x="20" y="55" textAnchor="middle" fontSize="10" fill="#333">P-101</text>
                  </g>

                  {/* 高亮選中區域 */}
                  {highlightArea && (
                    <rect
                      x={highlightArea.x}
                      y={highlightArea.y}
                      width={highlightArea.width}
                      height={highlightArea.height}
                      fill="rgba(34, 197, 94, 0.3)"
                      stroke="#22c55e"
                      strokeWidth="3"
                      className="animate-pulse"
                    />
                  )}
                </svg>
              </div>
            </div>

            {/* 文件資訊 */}
            <div className="mt-4 p-3 bg-gray-800 rounded-lg text-sm text-gray-300">
              <div className="flex justify-between">
                <span>文件: {selectedDoc.name}</span>
                <span>頁數: {selectedDoc.currentPage} / {selectedDoc.pageCount}</span>
              </div>
              {selectedComponentId && (
                <div className="mt-2 text-green-400">
                  ✓ 已定位到選中配件的位置
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            請從左側選擇 ISO 圖
          </div>
        )}
      </div>
    </div>
  );
}

export default ISOViewer;
