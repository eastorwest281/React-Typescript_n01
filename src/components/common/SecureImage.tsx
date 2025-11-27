/**
 * SecureImage 安全圖片元件
 * 防止 XSS 攻擊，驗證圖片來源
 */

import { useState, useCallback } from 'react';
import { sanitizeUrl } from '@/utils/security';

interface SecureImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
  onLoad?: () => void;
  width?: number | string;
  height?: number | string;
  loading?: 'lazy' | 'eager';
}

export function SecureImage({
  src,
  alt,
  className = '',
  fallbackSrc = '/placeholder-image.svg',
  onError,
  onLoad,
  width,
  height,
  loading = 'lazy',
}: SecureImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 消毒 URL
  const sanitizedSrc = sanitizeUrl(src);
  const sanitizedFallback = sanitizeUrl(fallbackSrc);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  }, [onError]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  // 如果 URL 不安全，使用 fallback
  const imageSrc = sanitizedSrc || sanitizedFallback;
  const displaySrc = hasError ? sanitizedFallback : imageSrc;

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 animate-pulse">
          <svg
            className="w-8 h-8 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      <img
        src={displaySrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onError={handleError}
        onLoad={handleLoad}
        width={width}
        height={height}
        loading={loading}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
      />
    </div>
  );
}

export default SecureImage;
