/**
 * 自適應視圖容器元件
 * 支援三種排版模式：上下排版、混合排版、地圖模式
 */

import { useCallback, useState, type ReactNode } from 'react';
import { useViewerStore } from '@/stores';
import { TAB_LABELS, SIDEBAR_CONTENT_LABELS } from '@/constants';
import type { ViewerType, SidebarContent } from '@/types';

interface AdaptiveViewerContainerProps {
  /** 3D 視圖內容 */
  threeDViewer: ReactNode;
  /** 點雲視圖內容 */
  pointCloudViewer: ReactNode;
  /** 底部面板內容 */
  bottomContent: ReactNode;
  /** 屬性面板 */
  attributesPanel: ReactNode;
  /** 配件列表面板 */
  componentListPanel?: ReactNode;
  /** ISO 視圖 */
  isoViewer: ReactNode;
  /** P&ID 視圖 */
  pidViewer: ReactNode;
  /** 平配圖視圖 */
  floorPlanViewer: ReactNode;
  /** PDF 視圖 */
  pdfViewer: ReactNode;
}

// 浮動面板元件
interface FloatingPanelProps {
  title: string;
  children: ReactNode;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  isExpanded: boolean;
  onToggle: () => void;
  onClose: () => void;
  size?: 'small' | 'medium' | 'large';
  zIndex?: number;
}

function FloatingPanel({ 
  title, 
  children, 
  position, 
  isExpanded, 
  onToggle, 
  onClose,
  size = 'medium',
  zIndex = 30,
}: FloatingPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const positionClasses: Record<string, string> = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const sizeClasses: Record<string, string> = {
    small: 'w-64 h-48',
    medium: 'w-80 h-60',
    large: 'w-96 h-72',
  };

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <div
      className={`
        absolute ${positionClasses[position]} 
        bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-2xl 
        border border-gray-700/50 overflow-hidden
        transition-all duration-300 ease-out
        ${isExpanded ? sizeClasses[size] : 'w-40 h-10'}
      `}
      style={{ 
        zIndex,
        transform: isDragging ? `translate(${offset.x}px, ${offset.y}px)` : undefined,
      }}
    >
      {/* 標題列 */}
      <div
        className="h-10 px-3 flex items-center justify-between bg-gray-800/80 cursor-move select-none"
        onMouseDown={handleDragStart}
      >
        <span className="text-sm font-medium text-gray-200 truncate">{title}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggle}
            className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            title={isExpanded ? '收合' : '展開'}
          >
            <svg className={`w-4 h-4 transition-transform ${isExpanded ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isExpanded ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-red-600/80 text-gray-400 hover:text-white transition-colors"
            title="關閉"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 內容區域 */}
      {isExpanded && (
        <div className="h-[calc(100%-40px)] overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
}

// 可收縮側欄元件
interface CollapsibleSidebarProps {
  isOpen: boolean;
  width: number;
  position: 'left' | 'right';
  title: string;
  children: ReactNode;
  onToggle: () => void;
  onWidthChange: (width: number) => void;
  contentOptions: { value: SidebarContent; label: string }[];
  selectedContent: SidebarContent;
  onContentChange: (content: SidebarContent) => void;
}

function CollapsibleSidebar({
  isOpen,
  width,
  position,
  title,
  children,
  onToggle,
  onWidthChange,
  contentOptions,
  selectedContent,
  onContentChange,
}: CollapsibleSidebarProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // 處理拖曳調整寬度
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = position === 'left' 
        ? moveEvent.clientX - startX 
        : startX - moveEvent.clientX;
      onWidthChange(startWidth + delta);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [width, position, onWidthChange]);

  // 收合狀態
  if (!isOpen) {
    return (
      <div 
        className={`
          h-full bg-gray-800 border-gray-700 flex flex-col items-center py-4 cursor-pointer
          hover:bg-gray-750 transition-colors
          ${position === 'left' ? 'border-r' : 'border-l'}
        `}
        style={{ width: 40 }}
        onClick={onToggle}
        title={`展開${title}`}
      >
        <svg 
          className={`w-5 h-5 text-gray-400 ${position === 'left' ? '' : 'rotate-180'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <div 
          className="mt-4 text-xs text-gray-500 writing-mode-vertical"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          {title}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        h-full bg-gray-850 flex flex-col relative
        ${position === 'left' ? 'border-r border-gray-700' : 'border-l border-gray-700'}
      `}
      style={{ width }}
    >
      {/* 標題列 */}
      <div className="h-12 px-3 flex items-center justify-between bg-gray-800 border-b border-gray-700 shrink-0">
        {/* 內容選擇下拉 */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 text-sm font-medium text-gray-200 hover:text-white transition-colors"
          >
            <span>{title}</span>
            <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* 下拉選單 */}
          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1 z-50">
              {contentOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onContentChange(option.value);
                    setShowDropdown(false);
                  }}
                  className={`
                    w-full px-3 py-2 text-left text-sm transition-colors
                    ${selectedContent === option.value 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 收合按鈕 */}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          title="收合側欄"
        >
          <svg 
            className={`w-4 h-4 ${position === 'left' ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 內容區域 */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>

      {/* 拖曳調整寬度的手把 */}
      <div
        className={`
          absolute top-0 bottom-0 w-1 cursor-ew-resize
          hover:bg-blue-500 transition-colors
          ${position === 'left' ? 'right-0' : 'left-0'}
          ${isResizing ? 'bg-blue-600' : 'bg-transparent'}
        `}
        onMouseDown={handleResizeStart}
      />
    </div>
  );
}

// 視圖切換按鈕 (3D / 點雲)
interface ViewToggleButtonProps {
  view: '3d' | 'pointcloud';
  activeView: '3d' | 'pointcloud';
  onChange: (view: '3d' | 'pointcloud') => void;
}

function ViewToggleButton({ view, activeView, onChange }: ViewToggleButtonProps) {
  const isActive = view === activeView;
  const label = view === '3d' ? '3D View' : 'Point Cloud';
  
  return (
    <button
      onClick={() => onChange(view)}
      className={`
        px-4 py-2 text-sm font-medium transition-all duration-200
        ${isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
          : 'text-gray-300 hover:bg-gray-700/70'}
      `}
    >
      {label}
    </button>
  );
}

export function AdaptiveViewerContainer({
  threeDViewer,
  pointCloudViewer,
  bottomContent,
  attributesPanel,
  componentListPanel,
  isoViewer,
  pidViewer,
  floorPlanViewer,
  pdfViewer,
}: AdaptiveViewerContainerProps) {
  const {
    layoutConfig,
    primaryView,
    setPrimaryView,
    floatingPanels,
    toggleFloatingPanel,
    isBottomPanelOpen,
    toggleBottomPanel,
    bottomPanelHeight,
    setBottomPanelHeight,
    toggleMiniViewExpanded,
    toggleLeftSidebar,
    toggleRightSidebar,
    setLeftSidebarWidth,
    setRightSidebarWidth,
    setLeftSidebarContent,
    setRightSidebarContent,
  } = useViewerStore();

  const { 
    mode, 
    verticalRatio, 
    miniViewExpanded, 
    miniViewPosition,
    leftSidebarWidth,
    rightSidebarWidth,
    isLeftSidebarOpen,
    isRightSidebarOpen,
    leftSidebarContent,
    rightSidebarContent,
  } = layoutConfig;

  // 取得面板內容
  const getPanelContent = (panelType: ViewerType | SidebarContent): ReactNode => {
    switch (panelType) {
      case 'componentlist': return componentListPanel;
      case '3d': return threeDViewer;
      case 'pointcloud': return pointCloudViewer;
      case 'attributes': return attributesPanel;
      case 'iso': return isoViewer;
      case 'pid': return pidViewer;
      case 'floorplan': return floorPlanViewer;
      case 'pdf': return pdfViewer;
      default: return null;
    }
  };

  // 左側欄內容選項 (適合瀏覽和列表)
  const leftSidebarOptions: { value: SidebarContent; label: string }[] = [
    { value: 'componentlist', label: SIDEBAR_CONTENT_LABELS['componentlist'] },
    { value: 'attributes', label: SIDEBAR_CONTENT_LABELS['attributes'] },
    { value: 'iso', label: SIDEBAR_CONTENT_LABELS['iso'] },
    { value: 'pid', label: SIDEBAR_CONTENT_LABELS['pid'] },
  ];

  // 右側欄內容選項 (適合詳情和文件)
  const rightSidebarOptions: { value: SidebarContent; label: string }[] = [
    { value: 'attributes', label: SIDEBAR_CONTENT_LABELS['attributes'] },
    { value: 'iso', label: SIDEBAR_CONTENT_LABELS['iso'] },
    { value: 'pid', label: SIDEBAR_CONTENT_LABELS['pid'] },
    { value: 'floorplan', label: SIDEBAR_CONTENT_LABELS['floorplan'] },
    { value: 'pdf', label: SIDEBAR_CONTENT_LABELS['pdf'] },
    { value: 'pointcloud', label: SIDEBAR_CONTENT_LABELS['pointcloud'] },
    { value: '3d', label: SIDEBAR_CONTENT_LABELS['3d'] },
  ];

  // 處理底部面板高度調整
  const handleBottomPanelResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = bottomPanelHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = startY - moveEvent.clientY;
      setBottomPanelHeight(startHeight + deltaY);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [bottomPanelHeight, setBottomPanelHeight]);

  // ============= 上下排版模式 =============
  if (mode === 'vertical') {
    return (
      <div className="flex flex-col h-full" data-vertical-container>
        {/* 上方主視圖區域 */}
        <div 
          className="relative bg-gray-800 overflow-hidden"
          style={{ height: isBottomPanelOpen ? `${verticalRatio}%` : '100%' }}
        >
          {/* 視圖切換按鈕 */}
          <div className="absolute top-4 right-4 z-20 flex bg-gray-800/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg">
            <ViewToggleButton view="3d" activeView={primaryView} onChange={setPrimaryView} />
            <ViewToggleButton view="pointcloud" activeView={primaryView} onChange={setPrimaryView} />
          </div>
          
          {/* 主視圖內容 */}
          <div className="w-full h-full">
            {primaryView === '3d' ? threeDViewer : pointCloudViewer}
          </div>
        </div>

        {/* 分隔拖曳條 */}
        {isBottomPanelOpen && (
          <div
            className="h-2 bg-gray-700 cursor-ns-resize flex items-center justify-center hover:bg-gray-600 transition-colors group"
            onMouseDown={handleBottomPanelResize}
          >
            <div className="w-12 h-1 bg-gray-500 rounded-full group-hover:bg-blue-400 transition-colors" />
          </div>
        )}

        {/* 底部面板區域 */}
        <div
          className={`bg-gray-850 border-t border-gray-700 overflow-hidden transition-all duration-200`}
          style={{ 
            height: isBottomPanelOpen ? `${100 - verticalRatio}%` : 40,
            minHeight: isBottomPanelOpen ? 150 : 40,
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
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

  // ============= 混合排版模式 (Split) - 四區塊佈局 =============
  if (mode === 'split') {
    return (
      <div className="flex h-full" data-split-container>
        {/* ===== 左側欄 ===== */}
        <CollapsibleSidebar
          isOpen={isLeftSidebarOpen}
          width={leftSidebarWidth}
          position="left"
          title={SIDEBAR_CONTENT_LABELS[leftSidebarContent] || leftSidebarContent}
          onToggle={toggleLeftSidebar}
          onWidthChange={setLeftSidebarWidth}
          contentOptions={leftSidebarOptions}
          selectedContent={leftSidebarContent}
          onContentChange={setLeftSidebarContent}
        >
          {getPanelContent(leftSidebarContent)}
        </CollapsibleSidebar>

        {/* ===== 中間主區域 (上下分割) ===== */}
        <div className="flex-1 flex flex-col min-w-0" data-vertical-container>
          {/* 上方主視圖 */}
          <div 
            className="relative bg-gray-800 overflow-hidden"
            style={{ height: isBottomPanelOpen ? `${verticalRatio}%` : '100%' }}
          >
            {/* 視圖切換按鈕 */}
            <div className="absolute top-4 right-4 z-20 flex bg-gray-800/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg">
              <ViewToggleButton view="3d" activeView={primaryView} onChange={setPrimaryView} />
              <ViewToggleButton view="pointcloud" activeView={primaryView} onChange={setPrimaryView} />
            </div>
            
            {/* 主視圖內容 */}
            <div className="w-full h-full">
              {primaryView === '3d' ? threeDViewer : pointCloudViewer}
            </div>
          </div>

          {/* 水平分隔拖曳條 */}
          {isBottomPanelOpen && (
            <div
              className="h-2 bg-gray-700 cursor-ns-resize flex items-center justify-center hover:bg-gray-600 transition-colors group"
              onMouseDown={handleBottomPanelResize}
            >
              <div className="w-12 h-1 bg-gray-500 rounded-full group-hover:bg-blue-400 transition-colors" />
            </div>
          )}

          {/* 下方面板區域 */}
          <div
            className="bg-gray-850 border-t border-gray-700 overflow-hidden transition-all duration-200"
            style={{ 
              height: isBottomPanelOpen ? `${100 - verticalRatio}%` : 40,
              minHeight: isBottomPanelOpen ? 150 : 40,
            }}
          >
            <div
              className="h-10 px-4 flex items-center justify-between bg-gray-800 border-b border-gray-700 cursor-pointer"
              onClick={toggleBottomPanel}
            >
              <span className="text-sm font-medium text-gray-300">詳細資訊面板</span>
              <button className="text-gray-400 hover:text-white transition-colors">
                <svg
                  className={`w-5 h-5 transition-transform ${isBottomPanelOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>

            {isBottomPanelOpen && (
              <div className="h-[calc(100%-40px)] overflow-hidden">
                {bottomContent}
              </div>
            )}
          </div>
        </div>

        {/* ===== 右側欄 ===== */}
        <CollapsibleSidebar
          isOpen={isRightSidebarOpen}
          width={rightSidebarWidth}
          position="right"
          title={SIDEBAR_CONTENT_LABELS[rightSidebarContent] || rightSidebarContent}
          onToggle={toggleRightSidebar}
          onWidthChange={setRightSidebarWidth}
          contentOptions={rightSidebarOptions}
          selectedContent={rightSidebarContent}
          onContentChange={setRightSidebarContent}
        >
          {getPanelContent(rightSidebarContent)}
        </CollapsibleSidebar>
      </div>
    );
  }

  // ============= 地圖模式 (Map) =============
  if (mode === 'map') {
    // 決定小視窗顯示的內容
    const secondaryView = primaryView === '3d' ? 'pointcloud' : '3d';

    return (
      <div className="relative w-full h-full bg-gray-900 overflow-hidden">
        {/* 主視圖 (全螢幕) */}
        <div className="absolute inset-0">
          {primaryView === '3d' ? threeDViewer : pointCloudViewer}
        </div>

        {/* 視圖切換按鈕 (位於左上角) */}
        <div className="absolute top-4 left-4 z-30 flex bg-gray-800/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg">
          <ViewToggleButton view="3d" activeView={primaryView} onChange={setPrimaryView} />
          <ViewToggleButton view="pointcloud" activeView={primaryView} onChange={setPrimaryView} />
        </div>

        {/* 小視窗：次要視圖 */}
        <FloatingPanel
          title={secondaryView === '3d' ? '3D View' : 'Point Cloud'}
          position={miniViewPosition}
          isExpanded={miniViewExpanded}
          onToggle={toggleMiniViewExpanded}
          onClose={() => {}}
          size="medium"
          zIndex={40}
        >
          {secondaryView === '3d' ? threeDViewer : pointCloudViewer}
        </FloatingPanel>

        {/* 浮動面板群組 */}
        {floatingPanels.filter(p => p !== '3d' && p !== 'pointcloud').map((panelType, index) => (
          <FloatingPanel
            key={panelType}
            title={TAB_LABELS[panelType] || panelType}
            position={index % 2 === 0 ? 'bottom-left' : 'top-right'}
            isExpanded={true}
            onToggle={() => {}}
            onClose={() => toggleFloatingPanel(panelType)}
            size="medium"
            zIndex={30 + index}
          >
            {getPanelContent(panelType)}
          </FloatingPanel>
        ))}

        {/* 快速面板選擇器 */}
        <QuickPanelSelector 
          activePanels={floatingPanels}
          onToggle={toggleFloatingPanel}
        />
      </div>
    );
  }

  return null;
}

// 快速面板選擇器 (用於地圖模式)
interface QuickPanelSelectorProps {
  activePanels: ViewerType[];
  onToggle: (panel: ViewerType) => void;
}

function QuickPanelSelector({ activePanels, onToggle }: QuickPanelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panels: ViewerType[] = ['attributes', 'iso', 'pid', 'floorplan', 'pdf'];

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="relative">
        {/* 展開的面板列表 */}
        {isOpen && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex gap-2 bg-gray-800/95 backdrop-blur-sm p-2 rounded-xl shadow-2xl border border-gray-700">
            {panels.map((panel) => {
              const isActive = activePanels.includes(panel);
              return (
                <button
                  key={panel}
                  onClick={() => onToggle(panel)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}
                  `}
                >
                  {TAB_LABELS[panel]}
                </button>
              );
            })}
          </div>
        )}

        {/* 觸發按鈕 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200
            bg-gray-800/95 backdrop-blur-sm text-gray-200 hover:bg-gray-700
            shadow-lg border border-gray-700
            ${isOpen ? 'ring-2 ring-blue-500' : ''}
          `}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>面板</span>
          {activePanels.filter(p => p !== '3d' && p !== 'pointcloud').length > 0 && (
            <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {activePanels.filter(p => p !== '3d' && p !== 'pointcloud').length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default AdaptiveViewerContainer;
