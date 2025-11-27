/**
 * 視圖容器元件
 * 管理上方 3D/點雲視圖區域和下方標籤頁面板
 */

import { useCallback, useState, type ReactNode } from 'react';
import { useViewerStore } from '@/stores';

interface ViewerContainerProps {
  /** 上方主視圖內容 */
  topContent: ReactNode;
  /** 下方面板內容 */
  bottomContent: ReactNode;
  /** 最小面板高度 */
  minPanelHeight?: number;
  /** 最大面板高度 */
  maxPanelHeight?: number;
}

export function ViewerContainer({
  topContent,
  bottomContent,
  minPanelHeight = 150,
  maxPanelHeight = 500,
}: ViewerContainerProps) {
  const { isBottomPanelOpen, bottomPanelHeight, setBottomPanelHeight, toggleBottomPanel } =
    useViewerStore();

  const [isDragging, setIsDragging] = useState(false);

  // 處理拖曳調整大小
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const startY = e.clientY;
    const startHeight = bottomPanelHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = startY - moveEvent.clientY;
      const newHeight = Math.min(
        maxPanelHeight,
        Math.max(minPanelHeight, startHeight + deltaY)
      );
      setBottomPanelHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [bottomPanelHeight, maxPanelHeight, minPanelHeight, setBottomPanelHeight]);

  return (
    <div className="flex flex-col h-full">
      {/* 上方主視圖區域 */}
      <div
        className="flex-1 relative bg-gray-800 overflow-hidden"
        style={{
          minHeight: isBottomPanelOpen ? '200px' : '100%',
        }}
      >
        {topContent}
      </div>

      {/* 分隔拖曳條 */}
      {isBottomPanelOpen && (
        <div
          className={`
            h-2 bg-gray-700 cursor-ns-resize flex items-center justify-center
            hover:bg-gray-600 transition-colors
            ${isDragging ? 'bg-blue-600' : ''}
          `}
          onMouseDown={handleMouseDown}
        >
          <div className="w-10 h-1 bg-gray-500 rounded-full" />
        </div>
      )}

      {/* 底部面板區域 */}
      <div
        className={`
          bg-gray-850 border-t border-gray-700 overflow-hidden transition-all duration-200
          ${isBottomPanelOpen ? '' : 'h-10'}
        `}
        style={{
          height: isBottomPanelOpen ? bottomPanelHeight : 40,
        }}
      >
        {/* 面板標題列 */}
        <div
          className="h-10 px-4 flex items-center justify-between bg-gray-800 border-b border-gray-700 cursor-pointer"
          onClick={toggleBottomPanel}
        >
          <span className="text-sm font-medium text-gray-300">詳細資訊面板</span>
          <button
            className="text-gray-400 hover:text-white transition-colors"
            aria-label={isBottomPanelOpen ? '收合面板' : '展開面板'}
          >
            <svg
              className={`w-5 h-5 transition-transform ${isBottomPanelOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        </div>

        {/* 面板內容 */}
        {isBottomPanelOpen && (
          <div className="h-[calc(100%-40px)] overflow-hidden">
            {bottomContent}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewerContainer;
