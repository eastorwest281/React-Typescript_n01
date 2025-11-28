/**
 * 404 頁面 - 找不到頁面
 */

import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center max-w-md px-4">
        {/* 404 圖示 */}
        <div className="mb-8">
          <svg
            className="w-32 h-32 mx-auto text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* 錯誤訊息 */}
        <h1 className="text-6xl font-bold mb-4 text-gray-200">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-gray-300">找不到頁面</h2>
        <p className="text-gray-400 mb-8">
          您要尋找的頁面可能已被移除、名稱已變更，或暫時無法使用。
        </p>

        {/* 返回按鈕 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button color="blue" size="lg">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              返回首頁
            </Button>
          </Link>
          <Button
            color="gray"
            size="lg"
            onClick={() => window.history.back()}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            返回上一頁
          </Button>
        </div>
      </div>

      {/* 裝飾性背景 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
