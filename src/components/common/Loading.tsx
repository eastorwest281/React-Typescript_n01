/**
 * Loading 載入元件
 */

import { Spinner } from 'flowbite-react';

interface LoadingProps {
  /** 載入文字 */
  text?: string;
  /** 是否全螢幕 */
  fullScreen?: boolean;
  /** 大小 */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** 進度百分比 (0-100) */
  progress?: number;
  /** 是否顯示進度條 */
  showProgress?: boolean;
}

export function Loading({
  text = '載入中...',
  fullScreen = false,
  size = 'lg',
  progress,
  showProgress = false,
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Spinner
        aria-label="Loading"
        size={size}
        className={sizeClasses[size]}
      />
      {text && (
        <p className="text-gray-400 text-sm font-medium">{text}</p>
      )}
      {showProgress && typeof progress === 'number' && (
        <div className="w-48">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>進度</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      {content}
    </div>
  );
}

export default Loading;
