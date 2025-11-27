/**
 * Error Boundary 元件
 * 捕獲子元件錯誤，防止整個應用程式崩潰
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Button } from 'flowbite-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    // 記錄錯誤
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 調用外部錯誤處理器
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // 如果提供了自定義 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 預設錯誤 UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-gray-900 rounded-lg">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">發生錯誤</h2>
          <p className="text-gray-400 mb-4 text-center max-w-md">
            很抱歉，發生了一些問題。請嘗試重新載入此區域。
          </p>
          {import.meta.env.DEV && this.state.error && (
            <details className="mb-4 p-4 bg-gray-800 rounded text-sm text-gray-300 max-w-lg overflow-auto">
              <summary className="cursor-pointer text-gray-400 mb-2">
                錯誤詳情 (僅開發環境顯示)
              </summary>
              <pre className="whitespace-pre-wrap wrap-break-word">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
          <Button color="blue" onClick={this.handleReset}>
            重新載入
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
