import React, { createContext, useReducer, ReactNode, useContext } from 'react';

export type LocationPayload = [number, number] | null;

type MapState = {
  location: LocationPayload;
  zoomLevel: number;
  isAddBathroomMode: boolean;
  isAddBathroomModalOpen: boolean;
  pinLocation: LocationPayload;
  hasInitialZoomed: boolean;
  confirmButton: boolean;
};
// Define initial state
const initialState: MapState = {
  location: null,
  zoomLevel: 15,
  isAddBathroomMode: false,
  isAddBathroomModalOpen: false,
  pinLocation: null,
  hasInitialZoomed: false,
  confirmButton: false,
};

// Define action types
type ActionType =
  | { type: 'SET_LOCATION'; payload: LocationPayload; }
  | { type: 'SET_ZOOM_LEVEL'; payload: number; }
  | { type: 'TOGGLE_ADD_BATHROOM_MODE'; }
  | { type: 'TOGGLE_ADD_BATHROOM_MODAL'; }
  | { type: 'SET_PIN_LOCATION'; payload: LocationPayload; }
  | { type: 'SET_HAS_INITIAL_ZOOMED'; payload: boolean; }
  | { type: 'REMOVE_PIN'; }
  | { type: 'SET_CONFIRM_BUTTON'; payload?: boolean | ((prevState: boolean) => boolean); };

// Define reducer
const mapReducer: React.Reducer<MapState, ActionType> = (state: typeof initialState, action: ActionType) => {
  switch (action.type) {
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_ZOOM_LEVEL':
      return { ...state, zoomLevel: action.payload };
    case 'TOGGLE_ADD_BATHROOM_MODE':
      return { ...state, isAddBathroomMode: !state.isAddBathroomMode };
    case 'TOGGLE_ADD_BATHROOM_MODAL':
      return { ...state, isAddBathroomModalOpen: !state.isAddBathroomModalOpen };
    case 'SET_PIN_LOCATION':
      return { ...state, pinLocation: action.payload };
    case 'SET_HAS_INITIAL_ZOOMED':
      return { ...state, hasInitialZoomed: action.payload }; // Update the state with the new value
    case 'REMOVE_PIN':
      return { ...state, pinLocation: null };
    case 'SET_CONFIRM_BUTTON':
      return { ...state, confirmButton: !state.confirmButton };
    default:
      return state;
  }
};

// Define context
const MapContext = createContext<{
  state: typeof initialState;
  dispatch: React.Dispatch<ActionType>;
}>({ state: initialState, dispatch: () => { } });

// Define provider component
type MapContextProviderProps = {
  children: ReactNode;
};

const MapContextProvider: React.FC<MapContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer<React.Reducer<MapState, ActionType>>(mapReducer, initialState);

  return (
    <MapContext.Provider value={{ state, dispatch }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  return useContext(MapContext);
};

export { MapContext, MapContextProvider };
