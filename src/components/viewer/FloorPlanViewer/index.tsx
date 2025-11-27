/**
 * 平配圖視圖元件
 */

import { useEffect, useState } from 'react';
import { useModelStore } from '@/stores';
import { Loading, EmptyState } from '@/components/common';
import { documentApi } from '@/services';
import type { FloorInfo } from '@/types';

export function FloorPlanViewer() {
  const { floors, setFloors } = useModelStore();
  const [selectedFloor, setSelectedFloor] = useState<FloorInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFloors = async () => {
      setIsLoading(true);
      const response = await documentApi.getFloors();
      if (response.success && response.data) {
        setFloors(response.data);
        if (response.data.length > 0) {
          setSelectedFloor(response.data[0]);
        }
      }
      setIsLoading(false);
    };

    loadFloors();
  }, [setFloors]);

  if (isLoading) {
    return <Loading text="載入平配圖..." />;
  }

  if (floors.length === 0) {
    return (
      <EmptyState
        title="無平配圖資料"
        description="目前沒有可用的平配圖"
      />
    );
  }

  return (
    <div className="flex h-full">
      {/* 樓層列表 */}
      <div className="w-48 border-r border-gray-700 bg-gray-850">
        <div className="p-3 border-b border-gray-700">
          <h3 className="text-sm font-medium text-white">樓層</h3>
        </div>
        <ul className="divide-y divide-gray-700">
          {floors.map((floor) => (
            <li key={floor.id}>
              <button
                className={`
                  w-full px-3 py-3 text-left transition-colors
                  ${selectedFloor?.id === floor.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                  }
                `}
                onClick={() => setSelectedFloor(floor)}
              >
                <div className="font-medium">{floor.name}</div>
                <div className="text-xs opacity-70">
                  標高: {floor.elevation}m | 設備: {floor.components.length}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 平配圖顯示區域 */}
      <div className="flex-1 bg-gray-900 overflow-auto p-4">
        {selectedFloor ? (
          <div className="relative">
            {/* 工具列 */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">{selectedFloor.name}</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-white text-sm">
                  放大
                </button>
                <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-white text-sm">
                  縮小
                </button>
                <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-white text-sm">
                  重置
                </button>
              </div>
            </div>

            {/* 模擬平配圖 */}
            <div className="bg-gray-100 rounded-lg p-4" style={{ minHeight: '500px' }}>
              <svg className="w-full h-full" viewBox="0 0 800 500">
                {/* 建築外框 */}
                <rect x="50" y="50" width="700" height="400" fill="none" stroke="#333" strokeWidth="3" />
                
                {/* 網格 */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <line
                    key={`v${i}`}
                    x1={50 + i * 100}
                    y1="50"
                    x2={50 + i * 100}
                    y2="450"
                    stroke="#ddd"
                    strokeWidth="1"
                  />
                ))}
                {Array.from({ length: 5 }).map((_, i) => (
                  <line
                    key={`h${i}`}
                    x1="50"
                    y1={50 + i * 100}
                    x2="750"
                    y2={50 + i * 100}
                    stroke="#ddd"
                    strokeWidth="1"
                  />
                ))}

                {/* 房間/區域 */}
                <rect x="60" y="60" width="180" height="180" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2" />
                <text x="150" y="150" textAnchor="middle" fontSize="14" fill="#1976d2">製程區 A</text>

                <rect x="260" y="60" width="230" height="180" fill="#e8f5e9" stroke="#388e3c" strokeWidth="2" />
                <text x="375" y="150" textAnchor="middle" fontSize="14" fill="#388e3c">製程區 B</text>

                <rect x="510" y="60" width="230" height="180" fill="#fff3e0" stroke="#f57c00" strokeWidth="2" />
                <text x="625" y="150" textAnchor="middle" fontSize="14" fill="#f57c00">公用區</text>

                <rect x="60" y="260" width="300" height="180" fill="#fce4ec" stroke="#c2185b" strokeWidth="2" />
                <text x="210" y="350" textAnchor="middle" fontSize="14" fill="#c2185b">儲存區</text>

                <rect x="380" y="260" width="360" height="180" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2" />
                <text x="560" y="350" textAnchor="middle" fontSize="14" fill="#7b1fa2">控制室</text>

                {/* 設備標記 */}
                {selectedFloor.components.slice(0, 6).map((_, idx) => (
                  <g key={idx}>
                    <circle
                      cx={120 + (idx % 3) * 200}
                      cy={100 + Math.floor(idx / 3) * 200}
                      r="15"
                      fill="#2196f3"
                      opacity="0.8"
                    />
                    <text
                      x={120 + (idx % 3) * 200}
                      y={105 + Math.floor(idx / 3) * 200}
                      textAnchor="middle"
                      fontSize="10"
                      fill="white"
                    >
                      {idx + 1}
                    </text>
                  </g>
                ))}

                {/* 指北針 */}
                <g transform="translate(700, 420)">
                  <circle cx="0" cy="0" r="20" fill="white" stroke="#333" strokeWidth="1" />
                  <polygon points="0,-15 5,10 -5,10" fill="#333" />
                  <text x="0" y="-22" textAnchor="middle" fontSize="10" fill="#333">N</text>
                </g>
              </svg>
            </div>

            {/* 樓層資訊 */}
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-800 p-3 rounded">
                <div className="text-gray-400">樓層</div>
                <div className="text-white font-medium">{selectedFloor.level}F</div>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <div className="text-gray-400">標高</div>
                <div className="text-white font-medium">{selectedFloor.elevation}m</div>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <div className="text-gray-400">設備數量</div>
                <div className="text-white font-medium">{selectedFloor.components.length}</div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState title="請選擇樓層" description="從左側列表選擇要檢視的樓層" />
        )}
      </div>
    </div>
  );
}

export default FloorPlanViewer;
