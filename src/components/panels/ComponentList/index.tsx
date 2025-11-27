/**
 * 配件列表元件
 * 顯示模型中所有配件的樹狀列表，支援搜尋和過濾
 */

import { useState, useMemo, useCallback } from 'react';
import { useModelStore, useSelectionStore } from '@/stores';
import { COMPONENT_TYPE_LABELS, COMPONENT_STATUS_COLORS } from '@/constants';
import { EmptyState } from '@/components/common';
import type { Component3D } from '@/types';

// 配件類型圖示
const TypeIcons: Record<string, React.FC<{ className?: string }>> = {
  pipe: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16M4 12l4-4m-4 4l4 4m12-4l-4-4m4 4l-4 4" />
    </svg>
  ),
  valve: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="3" strokeWidth={2} />
      <path strokeLinecap="round" strokeWidth={2} d="M12 5v4m0 6v4M5 12h4m6 0h4" />
    </svg>
  ),
  pump: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="6" strokeWidth={2} />
      <path strokeLinecap="round" strokeWidth={2} d="M12 6v6l4 2" />
    </svg>
  ),
  tank: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="6" y="4" width="12" height="16" rx="2" strokeWidth={2} />
      <path strokeLinecap="round" strokeWidth={2} d="M6 8h12M6 16h12" />
    </svg>
  ),
  default: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
};

// 配件項目元件
interface ComponentItemProps {
  component: Component3D;
  isSelected: boolean;
  onSelect: (component: Component3D) => void;
}

function ComponentItem({ component, isSelected, onSelect }: ComponentItemProps) {
  const statusColor = COMPONENT_STATUS_COLORS[component.metadata.status] || COMPONENT_STATUS_COLORS.unknown;
  const Icon = TypeIcons[component.type] || TypeIcons.default;

  return (
    <button
      onClick={() => onSelect(component)}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-150
        ${isSelected 
          ? 'bg-blue-600/20 border-l-2 border-blue-500' 
          : 'hover:bg-gray-700/50 border-l-2 border-transparent'}
      `}
    >
      {/* 類型圖示 */}
      <div className={`shrink-0 p-1.5 rounded ${isSelected ? 'bg-blue-600/30' : 'bg-gray-700'}`}>
        <Icon className="w-4 h-4 text-gray-300" />
      </div>

      {/* 配件資訊 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium truncate ${isSelected ? 'text-blue-300' : 'text-gray-200'}`}>
            {component.name}
          </span>
          <span 
            className="w-2 h-2 rounded-full shrink-0" 
            style={{ backgroundColor: statusColor }}
            title={component.metadata.status}
          />
        </div>
        <div className="text-xs text-gray-500 truncate">
          {component.metadata.tag}
        </div>
      </div>

      {/* 類型標籤 */}
      <span className="text-xs text-gray-500 shrink-0">
        {COMPONENT_TYPE_LABELS[component.type] || component.type}
      </span>
    </button>
  );
}

// 分組標題元件
interface GroupHeaderProps {
  type: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function GroupHeader({ type, count, isExpanded, onToggle }: GroupHeaderProps) {
  const Icon = TypeIcons[type] || TypeIcons.default;

  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-750 transition-colors"
    >
      <svg 
        className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <Icon className="w-4 h-4 text-gray-400" />
      <span className="text-sm font-medium text-gray-300">
        {COMPONENT_TYPE_LABELS[type] || type}
      </span>
      <span className="text-xs text-gray-500 ml-auto">
        {count}
      </span>
    </button>
  );
}

export function ComponentList() {
  const { factoryModel, searchComponents } = useModelStore();
  const { selectedComponentId, selectComponent } = useSelectionStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['valve', 'pump', 'pipe']));
  const [viewMode, setViewMode] = useState<'list' | 'grouped'>('grouped');

  // 過濾後的配件
  const filteredComponents = useMemo(() => {
    if (!factoryModel) return [];
    if (!searchQuery.trim()) return factoryModel.components;
    return searchComponents(searchQuery);
  }, [factoryModel, searchQuery, searchComponents]);

  // 按類型分組
  const groupedComponents = useMemo(() => {
    const groups: Record<string, Component3D[]> = {};
    filteredComponents.forEach((component) => {
      if (!groups[component.type]) {
        groups[component.type] = [];
      }
      groups[component.type].push(component);
    });
    return groups;
  }, [filteredComponents]);

  // 切換分組展開
  const toggleGroup = useCallback((type: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  // 處理選擇配件
  const handleSelectComponent = useCallback((component: Component3D) => {
    selectComponent(component.id, '3d', component);
  }, [selectComponent]);

  if (!factoryModel) {
    return (
      <EmptyState
        title="無模型資料"
        description="請載入工廠模型"
        icon={
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        }
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 搜尋與工具列 */}
      <div className="shrink-0 p-3 border-b border-gray-700 space-y-2">
        {/* 搜尋框 */}
        <div className="relative">
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="搜尋配件..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* 視圖切換 & 統計 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            共 {filteredComponents.length} 個配件
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
              title="列表視圖"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('grouped')}
              className={`p-1.5 rounded ${viewMode === 'grouped' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
              title="分組視圖"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 配件列表 */}
      <div className="flex-1 overflow-auto">
        {filteredComponents.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? '找不到符合的配件' : '無配件資料'}
          </div>
        ) : viewMode === 'list' ? (
          // 列表視圖
          <div className="divide-y divide-gray-700/50">
            {filteredComponents.map((component) => (
              <ComponentItem
                key={component.id}
                component={component}
                isSelected={selectedComponentId === component.id}
                onSelect={handleSelectComponent}
              />
            ))}
          </div>
        ) : (
          // 分組視圖
          <div>
            {Object.entries(groupedComponents).map(([type, components]) => (
              <div key={type}>
                <GroupHeader
                  type={type}
                  count={components.length}
                  isExpanded={expandedGroups.has(type)}
                  onToggle={() => toggleGroup(type)}
                />
                {expandedGroups.has(type) && (
                  <div className="divide-y divide-gray-700/30">
                    {components.map((component) => (
                      <ComponentItem
                        key={component.id}
                        component={component}
                        isSelected={selectedComponentId === component.id}
                        onSelect={handleSelectComponent}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ComponentList;
