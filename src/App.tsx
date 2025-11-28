import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { ErrorBoundary, ToastProvider } from "@/components";
import { useGlobalErrorListener, useNetworkStatus } from "@/hooks";
import { useEffect } from "react";
import "./App.css";

/**
 * 網路狀態提示元件
 */
function NetworkStatusIndicator() {
  const { isOnline, wasOffline } = useNetworkStatus();

  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-center py-2 px-4">
        <span className="flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
          網路連線已中斷，部分功能可能無法使用
        </span>
      </div>
    );
  }

  if (wasOffline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white text-center py-2 px-4 animate-fadeOut">
        <span className="flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          網路連線已恢復
        </span>
      </div>
    );
  }

  return null;
}

/**
 * 全域錯誤處理元件
 */
function GlobalErrorHandler() {
  useGlobalErrorListener((error) => {
    // 在這裡可以添加全域錯誤處理邏輯
    // 例如發送到錯誤追蹤服務
    if (import.meta.env.DEV) {
      console.error("[Global Error]", error);
    }
  });

  return null;
}

function App() {
  // 設置 CSP 違規監聽 (開發環境)
  useEffect(() => {
    if (import.meta.env.DEV) {
      document.addEventListener("securitypolicyviolation", (e) => {
        console.warn("[CSP Violation]", {
          blockedURI: e.blockedURI,
          violatedDirective: e.violatedDirective,
        });
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <GlobalErrorHandler />
        <NetworkStatusIndicator />
        <RouterProvider router={router} />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
