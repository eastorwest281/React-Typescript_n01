/**
 * P&ID 視圖元件
 */

import { useEffect, useState } from 'react';
import { useSelectionStore } from '@/stores';
import { Loading, EmptyState } from '@/components/common';
import { documentApi } from '@/services';
import type { DocumentInfo } from '@/types';

export function PIDViewer() {
  const { selectedComponentId } = useSelectionStore();
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      const response = await documentApi.getPIDDocuments();
      if (response.success && response.data) {
        setDocuments(response.data);
        if (response.data.length > 0) {
          setSelectedDoc(response.data[0]);
        }
      }
      setIsLoading(false);
    };

    loadDocuments();
  }, []);

  if (isLoading) {
    return <Loading text="載入 P&ID..." />;
  }

  if (documents.length === 0) {
    return (
      <EmptyState
        title="無 P&ID 資料"
        description="目前沒有可用的 P&ID 文件"
      />
    );
  }

  return (
    <div className="flex h-full">
      {/* 文件列表 */}
      <div className="w-64 border-r border-gray-700 bg-gray-850 overflow-y-auto">
        <div className="p-3 border-b border-gray-700">
          <h3 className="text-sm font-medium text-white">P&ID 列表</h3>
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
                  {String(doc.metadata?.area || '')}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* P&ID 顯示區域 */}
      <div className="flex-1 bg-gray-900 overflow-auto p-4">
        {selectedDoc ? (
          <div className="relative bg-white rounded-lg shadow-lg p-4" style={{ minHeight: '600px' }}>
            {/* 模擬 P&ID 圖 */}
            <svg className="w-full h-full" viewBox="0 0 1000 700">
              {/* 標題 */}
              <text x="500" y="30" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#333">
                {selectedDoc.name}
              </text>

              {/* 模擬設備和管線 */}
              {/* 儲槽 */}
              <g transform="translate(100, 100)">
                <rect x="0" y="0" width="80" height="120" fill="none" stroke="#333" strokeWidth="2" />
                <ellipse cx="40" cy="0" rx="40" ry="10" fill="none" stroke="#333" strokeWidth="2" />
                <ellipse cx="40" cy="120" rx="40" ry="10" fill="none" stroke="#333" strokeWidth="2" />
                <text x="40" y="150" textAnchor="middle" fontSize="12" fill="#333">T-101</text>
              </g>

              {/* 泵浦 */}
              <g transform="translate(300, 180)">
                <circle cx="30" cy="30" r="30" fill="none" stroke="#333" strokeWidth="2" />
                <line x1="0" y1="30" x2="60" y2="30" stroke="#333" strokeWidth="2" />
                <text x="30" y="80" textAnchor="middle" fontSize="12" fill="#333">P-101</text>
              </g>

              {/* 控制閥 */}
              <g transform="translate(450, 180)">
                <polygon points="0,0 30,30 60,0 60,60 30,30 0,60" fill="none" stroke="#333" strokeWidth="2" />
                <text x="30" y="80" textAnchor="middle" fontSize="12" fill="#333">CV-101</text>
              </g>

              {/* 熱交換器 */}
              <g transform="translate(600, 150)">
                <circle cx="40" cy="40" r="40" fill="none" stroke="#333" strokeWidth="2" />
                <line x1="10" y1="20" x2="70" y2="60" stroke="#333" strokeWidth="2" />
                <line x1="10" y1="60" x2="70" y2="20" stroke="#333" strokeWidth="2" />
                <text x="40" y="100" textAnchor="middle" fontSize="12" fill="#333">E-101</text>
              </g>

              {/* 反應器 */}
              <g transform="translate(800, 100)">
                <rect x="0" y="0" width="100" height="150" rx="10" fill="none" stroke="#333" strokeWidth="2" />
                <line x1="20" y1="30" x2="80" y2="30" stroke="#333" strokeWidth="1" strokeDasharray="5,3" />
                <line x1="20" y1="120" x2="80" y2="120" stroke="#333" strokeWidth="1" strokeDasharray="5,3" />
                <text x="50" y="180" textAnchor="middle" fontSize="12" fill="#333">R-101</text>
              </g>

              {/* 管線 */}
              <line x1="180" y1="180" x2="300" y2="210" stroke="#333" strokeWidth="3" />
              <line x1="360" y1="210" x2="450" y2="210" stroke="#333" strokeWidth="3" />
              <line x1="510" y1="210" x2="600" y2="190" stroke="#333" strokeWidth="3" />
              <line x1="680" y1="190" x2="800" y2="175" stroke="#333" strokeWidth="3" />

              {/* 儀器符號 */}
              <g transform="translate(380, 130)">
                <circle cx="15" cy="15" r="15" fill="none" stroke="#333" strokeWidth="1" />
                <text x="15" y="20" textAnchor="middle" fontSize="10" fill="#333">PT</text>
                <text x="15" y="45" textAnchor="middle" fontSize="8" fill="#333">PT-101</text>
              </g>

              {/* 流向箭頭 */}
              <polygon points="280,205 270,200 270,210" fill="#333" />
              <polygon points="440,205 430,200 430,210" fill="#333" />
              <polygon points="590,185 580,180 580,190" fill="#333" />
            </svg>

            {/* 圖例 */}
            <div className="absolute bottom-4 left-4 bg-gray-100 p-3 rounded text-xs">
              <div className="font-medium mb-2">圖例</div>
              <div className="space-y-1">
                <div>○ - 泵浦</div>
                <div>◇ - 閥門</div>
                <div>□ - 容器</div>
                <div>⊗ - 熱交換器</div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState title="請選擇 P&ID" description="從左側列表選擇要檢視的 P&ID" />
        )}
      </div>
    </div>
  );
}

export default PIDViewer;
