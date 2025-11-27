/**
 * 3D 模型檢視器元件
 * 使用 React Three Fiber 顯示 3D 工廠模型
 * 支援配件點選、高亮顯示功能
 */

import { useRef, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Grid, 
  PerspectiveCamera,
  Html
} from '@react-three/drei';
import * as THREE from 'three';
import { useSelectionStore, useModelStore } from '@/stores';
import type { Component3D } from '@/types';
import { Loading } from '@/components/common/Loading';

/** 配件網格元件 Props */
interface ComponentMeshProps {
  component: Component3D;
  isSelected: boolean;
  isHighlighted: boolean;
  isHovered: boolean;
  onSelect: (component: Component3D) => void;
  onHover: (componentId: string | null) => void;
}

/** 根據配件類型獲取顏色 */
function getComponentColor(type: Component3D['type'], status: string): string {
  // 狀態顏色優先
  if (status === 'fault') return '#ef4444'; // 紅色
  if (status === 'maintenance') return '#f59e0b'; // 橙色
  if (status === 'inactive') return '#6b7280'; // 灰色

  // 類型顏色
  const colorMap: Record<string, string> = {
    valve: '#3b82f6',        // 藍色
    pump: '#10b981',         // 綠色
    tank: '#8b5cf6',         // 紫色
    vessel: '#6366f1',       // 靛藍
    heat_exchanger: '#f97316', // 橙色
    pipe: '#64748b',         // 灰藍
    compressor: '#14b8a6',   // 青色
    instrument: '#eab308',   // 黃色
    equipment: '#84cc16',    // 萊姆綠
    structure: '#78716c',    // 暖灰
    other: '#a3a3a3',        // 灰色
  };

  return colorMap[type] || '#a3a3a3';
}

/** 根據配件類型獲取幾何體 */
function getComponentGeometry(type: Component3D['type']): React.JSX.Element {
  switch (type) {
    case 'valve':
      return <cylinderGeometry args={[0.3, 0.3, 0.5, 16]} />;
    case 'pump':
      return <boxGeometry args={[0.8, 0.6, 1]} />;
    case 'tank':
      return <cylinderGeometry args={[0.8, 0.8, 2, 24]} />;
    case 'vessel':
      return <capsuleGeometry args={[0.6, 1.2, 8, 16]} />;
    case 'heat_exchanger':
      return <cylinderGeometry args={[0.4, 0.4, 1.5, 16]} />;
    case 'pipe':
      return <cylinderGeometry args={[0.1, 0.1, 2, 8]} />;
    case 'compressor':
      return <boxGeometry args={[1, 0.8, 0.8]} />;
    case 'instrument':
      return <sphereGeometry args={[0.15, 16, 16]} />;
    default:
      return <boxGeometry args={[0.5, 0.5, 0.5]} />;
  }
}

/** 配件網格元件 */
function ComponentMesh({
  component,
  isSelected,
  isHighlighted,
  onSelect,
  onHover,
}: Omit<ComponentMeshProps, 'isHovered'>) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [localHover, setLocalHover] = useState(false);

  // 動畫效果 - 選中或懸停時輕微浮動
  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected || localHover) {
        meshRef.current.position.y = 
          component.position.y + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      } else {
        meshRef.current.position.y = component.position.y;
      }
    }
  });

  const baseColor = getComponentColor(component.type, component.metadata.status);
  
  // 計算材質顏色
  const getMaterialColor = () => {
    if (isSelected) return '#ffffff';
    if (isHighlighted) return '#60a5fa';
    if (localHover) return '#93c5fd';
    return baseColor;
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(component);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setLocalHover(true);
    onHover(component.id);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setLocalHover(false);
    onHover(null);
    document.body.style.cursor = 'default';
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[component.position.x, component.position.y, component.position.z]}
        rotation={[
          THREE.MathUtils.degToRad(component.rotation.x),
          THREE.MathUtils.degToRad(component.rotation.y),
          THREE.MathUtils.degToRad(component.rotation.z),
        ]}
        scale={[component.scale.x, component.scale.y, component.scale.z]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {getComponentGeometry(component.type)}
        <meshStandardMaterial
          color={getMaterialColor()}
          emissive={isSelected || isHighlighted ? getMaterialColor() : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : isHighlighted ? 0.2 : 0}
          metalness={0.3}
          roughness={0.7}
          transparent={localHover && !isSelected}
          opacity={localHover && !isSelected ? 0.9 : 1}
        />
      </mesh>

      {/* 選中時顯示外框 */}
      {(isSelected || isHighlighted) && (
        <mesh
          position={[component.position.x, component.position.y, component.position.z]}
          rotation={[
            THREE.MathUtils.degToRad(component.rotation.x),
            THREE.MathUtils.degToRad(component.rotation.y),
            THREE.MathUtils.degToRad(component.rotation.z),
          ]}
          scale={[
            component.scale.x * 1.1,
            component.scale.y * 1.1,
            component.scale.z * 1.1,
          ]}
        >
          {getComponentGeometry(component.type)}
          <meshBasicMaterial
            color={isSelected ? '#3b82f6' : '#60a5fa'}
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      )}

      {/* 懸停時顯示標籤 */}
      {localHover && (
        <Html
          position={[
            component.position.x,
            component.position.y + component.scale.y + 0.5,
            component.position.z,
          ]}
          center
          distanceFactor={10}
        >
          <div className="px-2 py-1 bg-gray-900/90 text-white text-xs rounded shadow-lg whitespace-nowrap">
            <div className="font-semibold">{component.metadata.tag}</div>
            <div className="text-gray-300">{component.name}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

/** 場景內容 */
function SceneContent() {
  const { factoryModel } = useModelStore();
  const {
    selectedComponentId,
    highlightedComponentIds,
    selectComponent,
    setHoveredComponent,
  } = useSelectionStore();

  const handleSelectComponent = useCallback(
    (component: Component3D) => {
      selectComponent(component.id, '3d', component);
    },
    [selectComponent]
  );

  const handleHoverComponent = useCallback(
    (componentId: string | null) => {
      setHoveredComponent(componentId);
    },
    [setHoveredComponent]
  );

  const components = factoryModel?.components || [];

  return (
    <>
      {/* 環境光源 */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, 10, -5]} intensity={0.5} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />

      {/* 相機控制 */}
      <PerspectiveCamera makeDefault position={[15, 10, 15]} fov={50} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2.1}
      />

      {/* 網格地面 */}
      <Grid
        args={[50, 50]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#444"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#666"
        fadeDistance={50}
        position={[0, -0.01, 0]}
      />

      {/* 地面 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* 渲染所有配件 */}
      {components.map((component) => (
        <ComponentMesh
          key={component.id}
          component={component}
          isSelected={selectedComponentId === component.id}
          isHighlighted={highlightedComponentIds.includes(component.id)}
          onSelect={handleSelectComponent}
          onHover={handleHoverComponent}
        />
      ))}

      {/* 環境 */}
      <Environment preset="city" />
    </>
  );
}

/** 3D 檢視器主元件 */
export function ThreeDViewer() {
  return (
    <div className="w-full h-full bg-gray-900">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Loading text="載入 3D 場景中..." />
          </div>
        }
      >
        <Canvas shadows>
          <SceneContent />
        </Canvas>
      </Suspense>

      {/* 圖例 */}
      <div className="absolute bottom-4 left-4 bg-gray-800/90 rounded-lg p-3 text-xs">
        <div className="text-gray-300 font-semibold mb-2">圖例</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-400">閥門 (Valve)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-400">泵浦 (Pump)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-gray-400">儲槽 (Tank)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-400">故障 (Fault)</span>
          </div>
        </div>
      </div>

      {/* 操作提示 */}
      <div className="absolute top-4 left-4 bg-gray-800/90 rounded-lg p-3 text-xs text-gray-400">
        <div className="space-y-1">
          <div>🖱️ 左鍵拖曳: 旋轉視角</div>
          <div>🖱️ 右鍵拖曳: 平移視角</div>
          <div>🖱️ 滾輪: 縮放</div>
          <div>🖱️ 點擊配件: 選取</div>
        </div>
      </div>
    </div>
  );
}

export default ThreeDViewer;
