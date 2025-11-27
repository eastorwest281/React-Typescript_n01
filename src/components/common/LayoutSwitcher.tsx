/**
 * 排版模式切換器元件
 * 提供三種排版模式的切換介面
 */

import { useState, useRef, useEffect } from 'react';
import { useViewerStore } from '@/stores';
import { LAYOUT_MODE_LABELS, LAYOUT_MODE_DESCRIPTIONS } from '@/constants';
import type { LayoutMode } from '@/types';

// 排版模式圖示
const LayoutIcons: Record<LayoutMode, React.FC<{ className?: string; active?: boolean }>> = {
  vertical: ({ className, active }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="18" height="10" rx="1" strokeWidth={active ? 2.5 : 1.5} />
      <rect x="3" y="15" width="18" height="6" rx="1" strokeWidth={active ? 2.5 : 1.5} />
    </svg>
  ),
  split: ({ className, active }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {/* 左側欄 */}
      <rect x="2" y="2" width="4" height="20" rx="1" strokeWidth={active ? 2 : 1.5} />
      {/* 中間上方 */}
      <rect x="8" y="2" width="8" height="10" rx="1" strokeWidth={active ? 2 : 1.5} />
      {/* 中間下方 */}
      <rect x="8" y="14" width="8" height="8" rx="1" strokeWidth={active ? 2 : 1.5} />
      {/* 右側欄 */}
      <rect x="18" y="2" width="4" height="20" rx="1" strokeWidth={active ? 2 : 1.5} />
    </svg>
  ),
  map: ({ className, active }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="1" strokeWidth={active ? 2.5 : 1.5} />
      <rect x="13" y="12" width="6" height="7" rx="1" strokeWidth={active ? 2.5 : 1.5} fill={active ? 'currentColor' : 'none'} fillOpacity={0.3} />
    </svg>
  ),
};

interface LayoutSwitcherProps {
  /** 額外的 CSS 類名 */
  className?: string;
  /** 顯示模式: icon-only 只顯示圖示, full 顯示完整介面 */
  variant?: 'icon-only' | 'full' | 'dropdown';
}

export function LayoutSwitcher({ className = '', variant = 'dropdown' }: LayoutSwitcherProps) {
  const { layoutConfig, setLayoutMode } = useViewerStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const layoutModes: LayoutMode[] = ['vertical', 'split', 'map'];

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModeChange = (mode: LayoutMode) => {
    setLayoutMode(mode);
    setIsOpen(false);
  };

  // 只顯示圖示按鈕
  if (variant === 'icon-only') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {layoutModes.map((mode) => {
          const Icon = LayoutIcons[mode];
          const isActive = layoutConfig.mode === mode;
          return (
            <button
              key={mode}
              onClick={() => setLayoutMode(mode)}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'}
              `}
              title={`${LAYOUT_MODE_LABELS[mode]}: ${LAYOUT_MODE_DESCRIPTIONS[mode]}`}
              aria-label={LAYOUT_MODE_LABELS[mode]}
            >
              <Icon className="w-5 h-5" active={isActive} />
            </button>
          );
        })}
      </div>
    );
  }

  // 完整顯示模式（帶標籤）
  if (variant === 'full') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <span className="text-xs text-gray-400 uppercase tracking-wider">排版模式</span>
        <div className="flex flex-col gap-1">
          {layoutModes.map((mode) => {
            const Icon = LayoutIcons[mode];
            const isActive = layoutConfig.mode === mode;
            return (
              <button
                key={mode}
                onClick={() => setLayoutMode(mode)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'}
                `}
              >
                <Icon className="w-5 h-5 shrink-0" active={isActive} />
                <div className="text-left">
                  <div className="text-sm font-medium">{LAYOUT_MODE_LABELS[mode]}</div>
                  <div className="text-xs opacity-70">{LAYOUT_MODE_DESCRIPTIONS[mode]}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 下拉選單模式
  const CurrentIcon = LayoutIcons[layoutConfig.mode];

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
          bg-gray-700 text-gray-200 hover:bg-gray-600
          ${isOpen ? 'ring-2 ring-blue-500' : ''}
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <CurrentIcon className="w-5 h-5" active />
        <span className="text-sm font-medium hidden sm:inline">{LAYOUT_MODE_LABELS[layoutConfig.mode]}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 下拉選單 */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          role="listbox"
        >
          <div className="p-2">
            <div className="text-xs text-gray-500 uppercase tracking-wider px-2 py-1 mb-1">
              選擇排版模式
            </div>
            {layoutModes.map((mode) => {
              const Icon = LayoutIcons[mode];
              const isActive = layoutConfig.mode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
                    ${isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700/70 hover:text-white'}
                  `}
                  role="option"
                  aria-selected={isActive}
                >
                  <Icon className="w-6 h-6 shrink-0" active={isActive} />
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium">{LAYOUT_MODE_LABELS[mode]}</div>
                    <div className={`text-xs ${isActive ? 'text-blue-200' : 'text-gray-500'}`}>
                      {LAYOUT_MODE_DESCRIPTIONS[mode]}
                    </div>
                  </div>
                  {isActive && (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* 快捷鍵提示 */}
          <div className="border-t border-gray-700 px-4 py-2 bg-gray-800/50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>快捷鍵</span>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-400">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-400">1/2/3</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LayoutSwitcher;
