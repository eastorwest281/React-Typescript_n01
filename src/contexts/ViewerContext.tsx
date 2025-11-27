/**
 * 檢視器 Context
 * @description 管理檢視器全域狀態
 */

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import { ViewerMode, type ViewerState, type ViewerContextType, type CameraSettings } from '../types/viewer.types';
import { APP_CONFIG } from '../config/app.config';

// 預設相機設定
const defaultCamera: CameraSettings = {
  position: APP_CONFIG.viewer3D.defaultCameraPosition,
  target: APP_CONFIG.viewer3D.defaultCameraTarget,
  fov: APP_CONFIG.viewer3D.defaultFov,
  near: APP_CONFIG.viewer3D.nearPlane,
  far: APP_CONFIG.viewer3D.farPlane,
};

// 初始狀態
const initialState: ViewerState = {
  currentMode: ViewerMode.THREE_D_VIEW,
  selectedPartId: null,
  isLoading: false,
  error: null,
  camera: defaultCamera,
  zoom: 1,
};

// Action 類型
type ViewerAction =
  | { type: 'SET_MODE'; payload: ViewerMode }
  | { type: 'SELECT_PART'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_CAMERA' }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_CAMERA'; payload: Partial<CameraSettings> };

// Reducer
function viewerReducer(state: ViewerState, action: ViewerAction): ViewerState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, currentMode: action.payload };
    case 'SELECT_PART':
      return { ...state, selectedPartId: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_CAMERA':
      return { ...state, camera: defaultCamera, zoom: 1 };
    case 'SET_ZOOM':
      return { ...state, zoom: action.payload };
    case 'SET_CAMERA':
      return { ...state, camera: { ...state.camera, ...action.payload } };
    default:
      return state;
  }
}

// 建立 Context
const ViewerContext = createContext<ViewerContextType | null>(null);

// Provider Props
interface ViewerProviderProps {
  children: ReactNode;
}

// Provider 元件
export function ViewerProvider({ children }: ViewerProviderProps) {
  const [state, dispatch] = useReducer(viewerReducer, initialState);

  // Actions
  const setMode = useCallback((mode: ViewerMode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  }, []);

  const selectPart = useCallback((partId: string | null) => {
    dispatch({ type: 'SELECT_PART', payload: partId });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const resetCamera = useCallback(() => {
    dispatch({ type: 'RESET_CAMERA' });
  }, []);

  const setZoom = useCallback((zoom: number) => {
    dispatch({ type: 'SET_ZOOM', payload: zoom });
  }, []);

  const value: ViewerContextType = {
    ...state,
    setMode,
    selectPart,
    setLoading,
    setError,
    resetCamera,
    setZoom,
  };

  return (
    <ViewerContext.Provider value={value}>
      {children}
    </ViewerContext.Provider>
  );
}

// Hook
export function useViewer(): ViewerContextType {
  const context = useContext(ViewerContext);
  if (!context) {
    throw new Error('useViewer must be used within a ViewerProvider');
  }
  return context;
}

// 匯出 Context (用於測試)
export { ViewerContext };
