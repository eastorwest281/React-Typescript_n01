/**
 * Tab 容器元件
 * 管理下方面板的標籤頁切換
 */

import { Tabs } from 'flowbite-react';
import { useViewerStore } from '@/stores';
import { TAB_LABELS } from '@/constants';
import type { ViewerType } from '@/types';

// 圖示元件
const TabIcons: Record<string, React.FC<{ className?: string }>> = {
  attributes: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  iso: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  ),
  pid: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  floorplan: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  pdf: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
};

interface TabContainerProps {
  /** Attributes 面板內容 */
  attributesPanel: React.ReactNode;
  /** ISO 視圖內容 */
  isoViewer: React.ReactNode;
  /** P&ID 視圖內容 */
  pidViewer: React.ReactNode;
  /** 平配圖視圖內容 */
  floorPlanViewer: React.ReactNode;
  /** PDF 視圖內容 */
  pdfViewer: React.ReactNode;
}

export function TabContainer({
  attributesPanel,
  isoViewer,
  pidViewer,
  floorPlanViewer,
  pdfViewer,
}: TabContainerProps) {
  const { activeTab, setActiveTab } = useViewerStore();

  const tabs: { id: ViewerType; content: React.ReactNode }[] = [
    { id: 'attributes', content: attributesPanel },
    { id: 'iso', content: isoViewer },
    { id: 'pid', content: pidViewer },
    { id: 'floorplan', content: floorPlanViewer },
    { id: 'pdf', content: pdfViewer },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <Tabs
        aria-label="詳細資訊標籤"
        variant="underline"
        onActiveTabChange={(tab) => setActiveTab(tabs[tab].id)}
        className="border-b border-gray-700"
      >
        {tabs.map((tab) => {
          const Icon = TabIcons[tab.id];
          return (
            <Tabs.Item
              key={tab.id}
              active={activeTab === tab.id}
              title={
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{TAB_LABELS[tab.id]}</span>
                </div>
              }
            >
              <div className="h-full overflow-auto p-4">{tab.content}</div>
            </Tabs.Item>
          );
        })}
      </Tabs>
    </div>
  );
}

export default TabContainer;
