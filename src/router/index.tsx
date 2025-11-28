/**
 * 路由配置
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import { PageLoader } from './PageLoader';

// 懶載入頁面
const FactoryViewerPage = lazy(() =>
  import('@/pages/FactoryViewerPage').then((module) => ({
    default: module.FactoryViewerPage,
  }))
);

// 404 頁面
const NotFoundPage = lazy(() => import('./NotFoundPage'));

/**
 * 路由配置
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PageLoader>
        <FactoryViewerPage />
      </PageLoader>
    ),
  },
  {
    path: '/viewer',
    element: <Navigate to="/" replace />,
  },
  {
    path: '/viewer/:modelId',
    element: (
      <PageLoader>
        <FactoryViewerPage />
      </PageLoader>
    ),
  },
  {
    path: '*',
    element: (
      <PageLoader>
        <NotFoundPage />
      </PageLoader>
    ),
  },
]);

export default router;
