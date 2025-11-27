/**
 * 工廠 3D 模型系統主頁面
 */

import { useEffect } from 'react';
import { MainLayout } from '@/layouts';
import AdaptiveViewerContainer from '@/layouts/AdaptiveViewerContainer';
import { 
  ThreeDViewer, 
  PointCloudViewer, 
  ISOViewer, 
  PIDViewer, 
  FloorPlanViewer, 
  PDFViewer,
  AttributesPanel,
  ComponentList,
  TabContainer,
  Loading,
  ErrorBoundary,
} from '@/components';
import { useModelStore, useViewerStore } from '@/stores';
import { modelApi } from '@/services';
import AppNavbar from '@/components/Navbar';

export function FactoryViewerPage() {
  const { setFactoryModel, setLoading, setError, isLoading, error } = useModelStore();
  const { setISODocuments, setPIDDocuments, setPDFDocuments } = useModelStore();

  // 初始化載入數據
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // 載入工廠模型
        const modelResponse = await modelApi.getFactoryModel();
        if (modelResponse.success && modelResponse.data) {
          setFactoryModel(modelResponse.data);
        } else {
          setError(modelResponse.error?.message || '載入模型失敗');
        }
      } catch (err) {
        setError('載入資料時發生錯誤');
        console.error('Load error:', err);
      }
    };

    loadData();
  }, [setFactoryModel, setLoading, setError, setISODocuments, setPIDDocuments, setPDFDocuments]);

  // 鍵盤快捷鍵支援
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const { setLayoutMode } = useViewerStore.getState();
        switch (e.key) {
          case '1':
            e.preventDefault();
            setLayoutMode('vertical');
            break;
          case '2':
            e.preventDefault();
            setLayoutMode('split');
            break;
          case '3':
            e.preventDefault();
            setLayoutMode('map');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 初始載入中
  if (isLoading) {
    return (
      <MainLayout navbar={<AppNavbar />}>
        <Loading text="載入工廠模型資料中..." fullScreen showProgress progress={50} />
      </MainLayout>
    );
  }

  // 錯誤狀態
  if (error) {
    return (
      <MainLayout navbar={<AppNavbar />}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-white mb-2">載入失敗</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              重新載入
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout navbar={<AppNavbar />}>
      <ErrorBoundary>
        <AdaptiveViewerContainer
          threeDViewer={
            <ErrorBoundary>
              <ThreeDViewer />
            </ErrorBoundary>
          }
          pointCloudViewer={
            <ErrorBoundary>
              <PointCloudViewer />
            </ErrorBoundary>
          }
          bottomContent={
            <ErrorBoundary>
              <TabContainer
                attributesPanel={<AttributesPanel />}
                isoViewer={<ISOViewer />}
                pidViewer={<PIDViewer />}
                floorPlanViewer={<FloorPlanViewer />}
                pdfViewer={<PDFViewer />}
              />
            </ErrorBoundary>
          }
          attributesPanel={<AttributesPanel />}
          componentListPanel={<ComponentList />}
          isoViewer={<ISOViewer />}
          pidViewer={<PIDViewer />}
          floorPlanViewer={<FloorPlanViewer />}
          pdfViewer={<PDFViewer />}
        />
      </ErrorBoundary>
    </MainLayout>
  );
}

export default FactoryViewerPage;
