/**
 * 主佈局元件
 * 包含 Navbar、主要視圖區域和底部面板
 */

import { type ReactNode } from 'react';
import { ErrorBoundary } from '@/components/common';

interface MainLayoutProps {
  children: ReactNode;
  navbar?: ReactNode;
}

export function MainLayout({ children, navbar }: MainLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
      {/* 導航列 */}
      {navbar && (
        <header className="shrink-0 border-b border-gray-700">
          {navbar}
        </header>
      )}

      {/* 主要內容區域 */}
      <main className="flex-1 overflow-hidden">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default MainLayout;
