/**
 * 選取狀態 Context
 * @description 管理配件選取與關聯狀態
 */

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { Part, PartAttribute, PartRelation } from '../types/model.types';

// 選取狀態
interface SelectionState {
  selectedPartId: string | null;
  hoveredPartId: string | null;
  selectedPart: Part | null;
  selectedAttributes: PartAttribute[];
  partRelation: PartRelation | null;
  multiSelectedPartIds: string[];
  highlightedElements: {
    iso: string[];
    pid: string[];
    floorPlan: string[];
  };
}

// 選取動作
interface SelectionActions {
  selectPart: (partId: string | null) => void;
  hoverPart: (partId: string | null) => void;
  setSelectedPart: (part: Part | null) => void;
  setSelectedAttributes: (attributes: PartAttribute[]) => void;
  setPartRelation: (relation: PartRelation | null) => void;
  toggleMultiSelect: (partId: string) => void;
  clearMultiSelect: () => void;
  setHighlightedElements: (type: 'iso' | 'pid' | 'floorPlan', elementIds: string[]) => void;
  clearAllHighlights: () => void;
}

// Context 類型
interface SelectionContextType extends SelectionState, SelectionActions {}

// 初始狀態
const initialState: SelectionState = {
  selectedPartId: null,
  hoveredPartId: null,
  selectedPart: null,
  selectedAttributes: [],
  partRelation: null,
  multiSelectedPartIds: [],
  highlightedElements: {
    iso: [],
    pid: [],
    floorPlan: [],
  },
};

// Action 類型
type SelectionAction =
  | { type: 'SELECT_PART'; payload: string | null }
  | { type: 'HOVER_PART'; payload: string | null }
  | { type: 'SET_SELECTED_PART'; payload: Part | null }
  | { type: 'SET_SELECTED_ATTRIBUTES'; payload: PartAttribute[] }
  | { type: 'SET_PART_RELATION'; payload: PartRelation | null }
  | { type: 'TOGGLE_MULTI_SELECT'; payload: string }
  | { type: 'CLEAR_MULTI_SELECT' }
  | { type: 'SET_HIGHLIGHTED_ELEMENTS'; payload: { type: 'iso' | 'pid' | 'floorPlan'; elementIds: string[] } }
  | { type: 'CLEAR_ALL_HIGHLIGHTS' };

// Reducer
function selectionReducer(state: SelectionState, action: SelectionAction): SelectionState {
  switch (action.type) {
    case 'SELECT_PART':
      return { ...state, selectedPartId: action.payload };
    
    case 'HOVER_PART':
      return { ...state, hoveredPartId: action.payload };
    
    case 'SET_SELECTED_PART':
      return { ...state, selectedPart: action.payload };
    
    case 'SET_SELECTED_ATTRIBUTES':
      return { ...state, selectedAttributes: action.payload };
    
    case 'SET_PART_RELATION':
      return { ...state, partRelation: action.payload };
    
    case 'TOGGLE_MULTI_SELECT': {
      const partId = action.payload;
      const currentIds = state.multiSelectedPartIds;
      const isSelected = currentIds.includes(partId);
      return {
        ...state,
        multiSelectedPartIds: isSelected
          ? currentIds.filter((id) => id !== partId)
          : [...currentIds, partId],
      };
    }
    
    case 'CLEAR_MULTI_SELECT':
      return { ...state, multiSelectedPartIds: [] };
    
    case 'SET_HIGHLIGHTED_ELEMENTS':
      return {
        ...state,
        highlightedElements: {
          ...state.highlightedElements,
          [action.payload.type]: action.payload.elementIds,
        },
      };
    
    case 'CLEAR_ALL_HIGHLIGHTS':
      return {
        ...state,
        highlightedElements: {
          iso: [],
          pid: [],
          floorPlan: [],
        },
      };
    
    default:
      return state;
  }
}

// 建立 Context
const SelectionContext = createContext<SelectionContextType | null>(null);

// Provider Props
interface SelectionProviderProps {
  children: ReactNode;
}

// Provider 元件
export function SelectionProvider({ children }: SelectionProviderProps) {
  const [state, dispatch] = useReducer(selectionReducer, initialState);

  // Actions
  const selectPart = useCallback((partId: string | null) => {
    dispatch({ type: 'SELECT_PART', payload: partId });
  }, []);

  const hoverPart = useCallback((partId: string | null) => {
    dispatch({ type: 'HOVER_PART', payload: partId });
  }, []);

  const setSelectedPart = useCallback((part: Part | null) => {
    dispatch({ type: 'SET_SELECTED_PART', payload: part });
  }, []);

  const setSelectedAttributes = useCallback((attributes: PartAttribute[]) => {
    dispatch({ type: 'SET_SELECTED_ATTRIBUTES', payload: attributes });
  }, []);

  const setPartRelation = useCallback((relation: PartRelation | null) => {
    dispatch({ type: 'SET_PART_RELATION', payload: relation });
  }, []);

  const toggleMultiSelect = useCallback((partId: string) => {
    dispatch({ type: 'TOGGLE_MULTI_SELECT', payload: partId });
  }, []);

  const clearMultiSelect = useCallback(() => {
    dispatch({ type: 'CLEAR_MULTI_SELECT' });
  }, []);

  const setHighlightedElements = useCallback(
    (type: 'iso' | 'pid' | 'floorPlan', elementIds: string[]) => {
      dispatch({ type: 'SET_HIGHLIGHTED_ELEMENTS', payload: { type, elementIds } });
    },
    []
  );

  const clearAllHighlights = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_HIGHLIGHTS' });
  }, []);

  const value: SelectionContextType = {
    ...state,
    selectPart,
    hoverPart,
    setSelectedPart,
    setSelectedAttributes,
    setPartRelation,
    toggleMultiSelect,
    clearMultiSelect,
    setHighlightedElements,
    clearAllHighlights,
  };

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

// Hook
export function useSelection(): SelectionContextType {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
}

// 匯出 Context (用於測試)
export { SelectionContext };
