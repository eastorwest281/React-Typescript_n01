/**
 * PDF 視圖元件
 */

import { useEffect, useState } from 'react';
import { Loading, EmptyState } from '@/components/common';
import { documentApi } from '@/services';
import type { DocumentInfo } from '@/types';

export function PDFViewer() {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      const response = await documentApi.getPDFDocuments();
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
    return <Loading text="載入 PDF 文件..." />;
  }

  if (documents.length === 0) {
    return (
      <EmptyState
        title="無 PDF 文件"
        description="目前沒有可用的 PDF 文件"
      />
    );
  }

  return (
    <div className="flex h-full">
      {/* 文件列表 */}
      <div className="w-72 border-r border-gray-700 bg-gray-850 overflow-y-auto">
        <div className="p-3 border-b border-gray-700">
          <h3 className="text-sm font-medium text-white">PDF 文件</h3>
        </div>
        <ul className="divide-y divide-gray-700">
          {documents.map((doc) => (
            <li key={doc.id}>
              <button
                className={`
                  w-full px-3 py-3 text-left transition-colors
                  ${selectedDoc?.id === doc.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                  }
                `}
                onClick={() => {
                  setSelectedDoc(doc);
                  setCurrentPage(1);
                }}
              >
                <div className="flex items-start gap-3">
                  {/* PDF 圖示 */}
                  <div className="w-10 h-12 bg-red-600 rounded flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">PDF</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{doc.name}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {doc.pageCount} 頁 | {String(doc.metadata?.documentType || '文件')}
                    </div>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* PDF 顯示區域 */}
      <div className="flex-1 bg-gray-900 flex flex-col">
        {selectedDoc ? (
          <>
            {/* 工具列 */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
              <div className="text-white text-sm font-medium truncate max-w-md">
                {selectedDoc.name}
              </div>
              <div className="flex items-center gap-4">
                {/* 頁面控制 */}
                <div className="flex items-center gap-2">
                  <button
                    className="p-1 text-gray-400 hover:text-white disabled:opacity-50"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-gray-300 text-sm">
                    {currentPage} / {selectedDoc.pageCount}
                  </span>
                  <button
                    className="p-1 text-gray-400 hover:text-white disabled:opacity-50"
                    disabled={currentPage >= (selectedDoc.pageCount || 1)}
                    onClick={() => setCurrentPage((p) => Math.min(selectedDoc.pageCount || 1, p + 1))}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* 縮放控制 */}
                <div className="flex items-center gap-2 border-l border-gray-600 pl-4">
                  <button className="p-1 text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </button>
                  <button className="p-1 text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                    </svg>
                  </button>
                </div>

                {/* 下載 */}
                <button className="p-1 text-gray-400 hover:text-white border-l border-gray-600 pl-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* PDF 內容區域 (模擬) */}
            <div className="flex-1 overflow-auto p-8 flex justify-center">
              <div className="bg-white shadow-2xl rounded" style={{ width: '612px', minHeight: '792px' }}>
                {/* 模擬 PDF 頁面內容 */}
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">{selectedDoc.name}</h1>
                    <p className="text-gray-500 mt-2">第 {currentPage} 頁</p>
                  </div>

                  <div className="space-y-4 text-gray-700">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    
                    <div className="my-8 p-4 bg-gray-100 rounded">
                      <div className="h-32 bg-gray-300 rounded flex items-center justify-center text-gray-500">
                        [圖表區域]
                      </div>
                    </div>

                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    
                    <div className="mt-8 p-4 border border-gray-300 rounded">
                      <h3 className="font-medium text-gray-800 mb-2">文件資訊</h3>
                      <div className="text-sm space-y-1">
                        <div>類型: {String(selectedDoc.metadata?.documentType || 'N/A')}</div>
                        <div>語言: {String(selectedDoc.metadata?.language || 'N/A')}</div>
                        <div>版本: {String(selectedDoc.metadata?.version || 'N/A')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState title="請選擇 PDF" description="從左側列表選擇要檢視的 PDF 文件" />
          </div>
        )}
      </div>
    </div>
  );
}

export default PDFViewer;
