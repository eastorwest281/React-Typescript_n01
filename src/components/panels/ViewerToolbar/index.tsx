/**
 * 視圖工具列元件
 * 提供縮放、旋轉、重置等視圖控制功能
 */

import { useState, useCallback } from 'react';
import { Tooltip } from 'flowbite-react';

/** 工具按鈕 Props */
interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

/** 工具按鈕元件 */
function ToolButton({ icon, label, onClick, active = false, disabled = false }: ToolButtonProps) {
  return (
    <Tooltip content={label} placement="bottom">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          p-2 rounded-lg transition-all duration-200
          ${active 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-label={label}
      >
        {icon}
      </button>
    </Tooltip>
  );
}

/** 分隔線元件 */
function Divider() {
  return <div className="w-px h-6 bg-gray-700 mx-1" />;
}

/** ViewerToolbar Props */
interface ViewerToolbarProps {
  /** 縮放回調 */
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  /** 視角回調 */
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  onResetView?: () => void;
  /** 視圖模式 */
  onTogglePerspective?: () => void;
  onToggleWireframe?: () => void;
  onToggleGrid?: () => void;
  /** 截圖 */
  onScreenshot?: () => void;
  /** 全螢幕 */
  onFullscreen?: () => void;
  /** 當前狀態 */
  isPerspective?: boolean;
  isWireframe?: boolean;
  showGrid?: boolean;
  isFullscreen?: boolean;
  /** 縮放比例 */
  zoomLevel?: number;
}

export function ViewerToolbar({
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onRotateLeft,
  onRotateRight,
  onResetView,
  onTogglePerspective,
  onToggleWireframe,
  onToggleGrid,
  onScreenshot,
  onFullscreen,
  isPerspective = true,
  isWireframe = false,
  showGrid = true,
  isFullscreen = false,
  zoomLevel = 100,
}: ViewerToolbarProps) {
  // 本地狀態 (如果沒有提供外部控制)
  const [localWireframe, setLocalWireframe] = useState(isWireframe);
  const [localShowGrid, setLocalShowGrid] = useState(showGrid);
  const [localZoom, setLocalZoom] = useState(zoomLevel);

  const handleZoomIn = useCallback(() => {
    if (onZoomIn) {
      onZoomIn();
    } else {
      setLocalZoom((prev) => Math.min(200, prev + 10));
    }
  }, [onZoomIn]);

  const handleZoomOut = useCallback(() => {
    if (onZoomOut) {
      onZoomOut();
    } else {
      setLocalZoom((prev) => Math.max(25, prev - 10));
    }
  }, [onZoomOut]);

  const handleZoomReset = useCallback(() => {
    if (onZoomReset) {
      onZoomReset();
    } else {
      setLocalZoom(100);
    }
  }, [onZoomReset]);

  const handleToggleWireframe = useCallback(() => {
    if (onToggleWireframe) {
      onToggleWireframe();
    } else {
      setLocalWireframe((prev) => !prev);
    }
  }, [onToggleWireframe]);

  const handleToggleGrid = useCallback(() => {
    if (onToggleGrid) {
      onToggleGrid();
    } else {
      setLocalShowGrid((prev) => !prev);
    }
  }, [onToggleGrid]);

  const currentZoom = onZoomIn ? zoomLevel : localZoom;
  const currentWireframe = onToggleWireframe ? isWireframe : localWireframe;
  const currentShowGrid = onToggleGrid ? showGrid : localShowGrid;

  return (
    <div className="flex items-center gap-1 p-2 bg-gray-900/95 rounded-lg shadow-lg backdrop-blur-sm">
      {/* 縮放控制 */}
      <div className="flex items-center gap-1">
        <ToolButton
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          }
          label="放大"
          onClick={handleZoomIn}
        />
        <ToolButton
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          }
          label="縮小"
          onClick={handleZoomOut}
        />
        <span className="px-2 text-sm text-gray-400 min-w-[50px] text-center">
          {currentZoom}%
        </span>
        <ToolButton
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          }
          label="適應視窗"
          onClick={handleZoomReset}
        />
      </div>

      <Divider />

      {/* 旋轉控制 */}
      <div className="flex items-center gap-1">
        <ToolButton
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          }
          label="向左旋轉"
          onClick={onRotateLeft || (() => {})}
        />
        <ToolButton
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
            </svg>
          }
          label="向右旋轉"
          onClick={onRotateRight || (() => {})}
        />
        <ToolButton
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          }
          label="重置視角"
          onClick={onResetView || (() => {})}
        />
      </div>

      <Divider />

      {/* 顯示模式 */}
      <div className="flex items-center gap-1">
        <ToolButton
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          label={currentWireframe ? '實體模式' : '線框模式'}
          onClick={handleToggleWireframe}
          active={currentWireframe}
        />
        <ToolButton
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          }
          label={currentShowGrid ? '隱藏網格' : '顯示網格'}
          onClick={handleToggleGrid}
          active={currentShowGrid}
        />
        <ToolButton
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
          }
          label={isPerspective ? '正交投影' : '透視投影'}
          onClick={onTogglePerspective || (() => {})}
          active={!isPerspective}
        />
      </div>

      <Divider />

      {/* 其他功能 */}
      <div className="flex items-center gap-1">
        <ToolButton
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          label="擷取畫面"
          onClick={onScreenshot || (() => {
            // 預設擷取畫面行為
            console.log('Screenshot captured');
          })}
        />
        <ToolButton
          icon={
            isFullscreen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )
          }
          label={isFullscreen ? '退出全螢幕' : '全螢幕'}
          onClick={onFullscreen || (() => {
            // 預設全螢幕行為
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              document.documentElement.requestFullscreen();
            }
          })}
          active={isFullscreen}
        />
      </div>
    </div>
  );
}

export default ViewerToolbar;
