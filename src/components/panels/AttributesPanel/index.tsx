/**
 * 屬性面板元件
 * 顯示選中配件的詳細屬性
 */

import { useMemo } from 'react';
import { Accordion, Badge } from 'flowbite-react';
import { useSelectionStore, useModelStore } from '@/stores';
import { EmptyState } from '@/components/common';
import { COMPONENT_TYPE_LABELS, COMPONENT_STATUS_LABELS, COMPONENT_STATUS_COLORS } from '@/constants';
import { escapeHtml } from '@/utils/security';

export function AttributesPanel() {
  const { selectedComponentId, selectedComponent } = useSelectionStore();
  const { getComponentById } = useModelStore();

  // 取得配件資料
  const component = useMemo(() => {
    if (selectedComponent) return selectedComponent;
    if (selectedComponentId) return getComponentById(selectedComponentId);
    return null;
  }, [selectedComponent, selectedComponentId, getComponentById]);

  if (!component) {
    return (
      <EmptyState
        title="未選擇配件"
        description="請在 3D 視圖中點選配件以查看屬性"
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
          </svg>
        }
      />
    );
  }

  const { metadata, isoReference, pidReference } = component;
  const statusColor = COMPONENT_STATUS_COLORS[metadata.status] || COMPONENT_STATUS_COLORS.unknown;

  return (
    <div className="space-y-4">
      {/* 標題區域 */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {escapeHtml(component.name)}
          </h3>
          <p className="text-sm text-gray-400">
            標籤: {escapeHtml(metadata.tag)}
          </p>
        </div>
        <Badge
          color={metadata.status === 'active' ? 'success' : metadata.status === 'fault' ? 'failure' : 'warning'}
          size="sm"
        >
          <span style={{ color: statusColor }}>●</span>
          <span className="ml-1">{COMPONENT_STATUS_LABELS[metadata.status]}</span>
        </Badge>
      </div>

      {/* 屬性手風琴 */}
      <Accordion collapseAll={false}>
        {/* 基本資訊 */}
        <Accordion.Panel>
          <Accordion.Title className="bg-gray-800 hover:bg-gray-700">
            基本資訊
          </Accordion.Title>
          <Accordion.Content className="bg-gray-850">
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-400">類型</dt>
                <dd className="text-white">{COMPONENT_TYPE_LABELS[component.type] || component.type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">描述</dt>
                <dd className="text-white">{escapeHtml(metadata.description)}</dd>
              </div>
              {metadata.manufacturer && (
                <div className="flex justify-between">
                  <dt className="text-gray-400">製造商</dt>
                  <dd className="text-white">{escapeHtml(metadata.manufacturer)}</dd>
                </div>
              )}
              {metadata.model && (
                <div className="flex justify-between">
                  <dt className="text-gray-400">型號</dt>
                  <dd className="text-white">{escapeHtml(metadata.model)}</dd>
                </div>
              )}
              {metadata.material && (
                <div className="flex justify-between">
                  <dt className="text-gray-400">材質</dt>
                  <dd className="text-white">{escapeHtml(metadata.material)}</dd>
                </div>
              )}
              {metadata.specification && (
                <div className="flex justify-between">
                  <dt className="text-gray-400">規格</dt>
                  <dd className="text-white">{escapeHtml(metadata.specification)}</dd>
                </div>
              )}
            </dl>
          </Accordion.Content>
        </Accordion.Panel>

        {/* 維護資訊 */}
        <Accordion.Panel>
          <Accordion.Title className="bg-gray-800 hover:bg-gray-700">
            維護資訊
          </Accordion.Title>
          <Accordion.Content className="bg-gray-850">
            <dl className="space-y-2">
              {metadata.installDate && (
                <div className="flex justify-between">
                  <dt className="text-gray-400">安裝日期</dt>
                  <dd className="text-white">{metadata.installDate}</dd>
                </div>
              )}
              {metadata.lastMaintenance && (
                <div className="flex justify-between">
                  <dt className="text-gray-400">最後維護</dt>
                  <dd className="text-white">{metadata.lastMaintenance}</dd>
                </div>
              )}
            </dl>
          </Accordion.Content>
        </Accordion.Panel>

        {/* 自定義屬性 */}
        {metadata.customAttributes && Object.keys(metadata.customAttributes).length > 0 && (
          <Accordion.Panel>
            <Accordion.Title className="bg-gray-800 hover:bg-gray-700">
              技術參數
            </Accordion.Title>
            <Accordion.Content className="bg-gray-850">
              <dl className="space-y-2">
                {Object.entries(metadata.customAttributes).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <dt className="text-gray-400">{key}</dt>
                    <dd className="text-white">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </Accordion.Content>
          </Accordion.Panel>
        )}

        {/* 關聯文件 */}
        <Accordion.Panel>
          <Accordion.Title className="bg-gray-800 hover:bg-gray-700">
            關聯文件
          </Accordion.Title>
          <Accordion.Content className="bg-gray-850">
            <div className="space-y-2">
              {isoReference && (
                <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
                  <span className="text-gray-300">ISO 圖</span>
                  <span className="text-blue-400">{isoReference.isoNumber}</span>
                </div>
              )}
              {pidReference && (
                <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
                  <span className="text-gray-300">P&ID</span>
                  <span className="text-blue-400">{pidReference.pidNumber}</span>
                </div>
              )}
              {!isoReference && !pidReference && (
                <p className="text-gray-500 text-sm">無關聯文件</p>
              )}
            </div>
          </Accordion.Content>
        </Accordion.Panel>

        {/* 位置資訊 */}
        <Accordion.Panel>
          <Accordion.Title className="bg-gray-800 hover:bg-gray-700">
            位置資訊
          </Accordion.Title>
          <Accordion.Content className="bg-gray-850">
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-400">X</dt>
                <dd className="text-white font-mono">{component.position.x.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Y</dt>
                <dd className="text-white font-mono">{component.position.y.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Z</dt>
                <dd className="text-white font-mono">{component.position.z.toFixed(2)}</dd>
              </div>
            </dl>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </div>
  );
}

export default AttributesPanel;
