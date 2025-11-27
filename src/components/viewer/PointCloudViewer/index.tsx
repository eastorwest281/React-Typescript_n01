/**
 * 點雲檢視器元件
 * 使用 React Three Fiber 顯示模擬點雲數據
 * 本地渲染，不使用外部 API
 */

import { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useModelStore } from '@/stores';
import { Loading } from '@/components/common/Loading';

/** 生成模擬點雲數據 */
function generateMockPointCloud(
  count: number,
  bounds: { min: THREE.Vector3; max: THREE.Vector3 }
): Float32Array {
  const positions = new Float32Array(count * 3);
  const range = {
    x: bounds.max.x - bounds.min.x,
    y: bounds.max.y - bounds.min.y,
    z: bounds.max.z - bounds.min.z,
  };

  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    
    // 創建更有結構的點雲 - 模擬工廠建築
    const section = Math.floor(Math.random() * 5);
    
    switch (section) {
      case 0: // 地面點
        positions[idx] = bounds.min.x + Math.random() * range.x;
        positions[idx + 1] = bounds.min.y + Math.random() * 0.5;
        positions[idx + 2] = bounds.min.z + Math.random() * range.z;
        break;
      case 1: // 牆面點
        positions[idx] = bounds.min.x + (Math.random() > 0.5 ? 0 : range.x);
        positions[idx + 1] = bounds.min.y + Math.random() * range.y;
        positions[idx + 2] = bounds.min.z + Math.random() * range.z;
        break;
      case 2: // 設備群 1
        positions[idx] = -5 + Math.random() * 4 - 2;
        positions[idx + 1] = Math.random() * 6;
        positions[idx + 2] = -3 + Math.random() * 4 - 2;
        break;
      case 3: // 設備群 2
        positions[idx] = 5 + Math.random() * 4 - 2;
        positions[idx + 1] = Math.random() * 8;
        positions[idx + 2] = 3 + Math.random() * 4 - 2;
        break;
      default: // 隨機點
        positions[idx] = bounds.min.x + Math.random() * range.x;
        positions[idx + 1] = bounds.min.y + Math.random() * range.y;
        positions[idx + 2] = bounds.min.z + Math.random() * range.z;
    }
  }

  return positions;
}

/** 生成點雲顏色 */
function generatePointColors(positions: Float32Array): Float32Array {
  const count = positions.length / 3;
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    const y = positions[idx + 1];
    
    // 根據高度著色 - 漸變效果
    const normalizedY = Math.max(0, Math.min(1, y / 10));
    
    // 從藍色(低) -> 綠色(中) -> 紅色(高)
    if (normalizedY < 0.5) {
      const t = normalizedY * 2;
      colors[idx] = 0.2 * (1 - t) + 0.2 * t;     // R
      colors[idx + 1] = 0.4 * (1 - t) + 0.8 * t; // G
      colors[idx + 2] = 0.8 * (1 - t) + 0.3 * t; // B
    } else {
      const t = (normalizedY - 0.5) * 2;
      colors[idx] = 0.2 * (1 - t) + 0.9 * t;     // R
      colors[idx + 1] = 0.8 * (1 - t) + 0.4 * t; // G
      colors[idx + 2] = 0.3 * (1 - t) + 0.2 * t; // B
    }
  }

  return colors;
}

/** 點雲渲染元件 */
interface PointCloudMeshProps {
  pointCount: number;
  pointSize: number;
  animate: boolean;
}

function PointCloudMesh({ pointCount, pointSize, animate }: PointCloudMeshProps) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const bounds = {
      min: new THREE.Vector3(-15, 0, -15),
      max: new THREE.Vector3(15, 12, 15),
    };
    const pos = generateMockPointCloud(pointCount, bounds);
    const col = generatePointColors(pos);
    return { positions: pos, colors: col };
  }, [pointCount]);

  // 動畫效果
  useFrame((state) => {
    if (animate && pointsRef.current) {
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={pointSize}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}

/** 場景內容 */
interface SceneContentProps {
  pointCount: number;
  pointSize: number;
  animate: boolean;
}

function SceneContent({ pointCount, pointSize, animate }: SceneContentProps) {
  return (
    <>
      {/* 光源 */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />

      {/* 相機控制 */}
      <PerspectiveCamera makeDefault position={[20, 15, 20]} fov={50} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={60}
      />

      {/* 坐標軸輔助 */}
      <axesHelper args={[10]} />

      {/* 點雲 */}
      <PointCloudMesh 
        pointCount={pointCount} 
        pointSize={pointSize} 
        animate={animate}
      />

      {/* 邊界框 */}
      <mesh position={[0, 6, 0]}>
        <boxGeometry args={[30, 12, 30]} />
        <meshBasicMaterial color="#4a5568" wireframe opacity={0.2} transparent />
      </mesh>
    </>
  );
}

/** 點雲檢視器主元件 */
export function PointCloudViewer() {
  const { factoryModel } = useModelStore();
  const pointCloudInfo = factoryModel?.pointClouds?.[0];

  // 控制狀態
  const [pointCount, setPointCount] = useState(50000);
  const [pointSize, setPointSize] = useState(0.05);
  const [animate, setAnimate] = useState(false);

  return (
    <div className="w-full h-full bg-gray-900 relative">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Loading text="載入點雲數據中..." />
          </div>
        }
      >
        <Canvas>
          <SceneContent 
            pointCount={pointCount} 
            pointSize={pointSize} 
            animate={animate}
          />
        </Canvas>
      </Suspense>

      {/* 點雲資訊面板 */}
      <div className="absolute top-4 left-4 bg-gray-800/90 rounded-lg p-3 text-xs">
        <div className="text-gray-300 font-semibold mb-2">點雲資訊</div>
        <div className="space-y-1 text-gray-400">
          <div>名稱: {pointCloudInfo?.name || '模擬點雲'}</div>
          <div>點數: {pointCount.toLocaleString()}</div>
          <div>格式: 本地生成</div>
        </div>
      </div>

      {/* 控制面板 */}
      <div className="absolute top-4 right-4 bg-gray-800/90 rounded-lg p-3 text-xs">
        <div className="text-gray-300 font-semibold mb-3">顯示控制</div>
        
        <div className="space-y-3">
          {/* 點數控制 */}
          <div>
            <label className="text-gray-400 block mb-1">點數量</label>
            <input
              type="range"
              min="10000"
              max="100000"
              step="10000"
              value={pointCount}
              onChange={(e) => setPointCount(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-gray-500 text-right">{pointCount.toLocaleString()}</div>
          </div>

          {/* 點大小控制 */}
          <div>
            <label className="text-gray-400 block mb-1">點大小</label>
            <input
              type="range"
              min="0.01"
              max="0.2"
              step="0.01"
              value={pointSize}
              onChange={(e) => setPointSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-gray-500 text-right">{pointSize.toFixed(2)}</div>
          </div>

          {/* 動畫開關 */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400">動畫效果</span>
            <button
              onClick={() => setAnimate(!animate)}
              className={`
                px-3 py-1 rounded text-xs transition-colors
                ${animate 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }
              `}
            >
              {animate ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* 操作提示 */}
      <div className="absolute bottom-4 left-4 bg-gray-800/90 rounded-lg p-3 text-xs text-gray-400">
        <div className="space-y-1">
          <div>🖱️ 左鍵拖曳: 旋轉視角</div>
          <div>🖱️ 右鍵拖曳: 平移視角</div>
          <div>🖱️ 滾輪: 縮放</div>
        </div>
      </div>

      {/* 顏色圖例 */}
      <div className="absolute bottom-4 right-4 bg-gray-800/90 rounded-lg p-3 text-xs">
        <div className="text-gray-300 font-semibold mb-2">高度圖例</div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-20 rounded" style={{
            background: 'linear-gradient(to top, #3366cc, #33cc66, #cc6633)'
          }} />
          <div className="flex flex-col justify-between h-20 text-gray-400">
            <span>高</span>
            <span>中</span>
            <span>低</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PointCloudViewer;
