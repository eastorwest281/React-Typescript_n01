/**
 * 頁面載入包裝器元件
 */

import { Suspense, type ReactNode } from 'react';
import { Loading, ErrorBoundary } from '@/components';

interface PageLoaderProps {
  children: ReactNode;
}

/**
 * 載入中包裝器
 */
export function PageLoader({ children }: PageLoaderProps) {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen bg-gray-900">
            <Loading size="lg" text="載入頁面中..." />
          </div>
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
