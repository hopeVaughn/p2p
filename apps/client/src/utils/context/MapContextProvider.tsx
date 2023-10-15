import { createContext, useReducer, ReactNode, useContext } from 'react';

type LocationPayload = [number, number] | null;

type MapState = {
  location: LocationPayload;
  zoomLevel: number;
  isAddBathroomMode: boolean;
  showConfirmButton: boolean;
  isAddBathroomModalOpen: boolean;
  pinLocation: LocationPayload;
};
// Define initial state
const initialState: MapState = {
  location: null,
  zoomLevel: 15,
  isAddBathroomMode: false,
  showConfirmButton: false,
  isAddBathroomModalOpen: false,
  pinLocation: null,
};

// Define action types
type ActionType =
  | { type: 'SET_LOCATION'; payload: LocationPayload; }
  | { type: 'SET_ZOOM_LEVEL'; payload: number; }
  | { type: 'TOGGLE_ADD_BATHROOM_MODE'; }
  | { type: 'TOGGLE_CONFIRM_BUTTON'; }
  | { type: 'TOGGLE_ADD_BATHROOM_MODAL'; }
  | { type: 'SET_PIN_LOCATION'; payload: LocationPayload; };

// Define reducer
const mapReducer = (state: typeof initialState, action: ActionType) => {
  switch (action.type) {
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_ZOOM_LEVEL':
      return { ...state, zoomLevel: action.payload };
    case 'TOGGLE_ADD_BATHROOM_MODE':
      return { ...state, isAddBathroomMode: !state.isAddBathroomMode };
    case 'TOGGLE_CONFIRM_BUTTON':
      return { ...state, showConfirmButton: !state.showConfirmButton };
    case 'TOGGLE_ADD_BATHROOM_MODAL':
      return { ...state, isAddBathroomModalOpen: !state.isAddBathroomModalOpen };
    case 'SET_PIN_LOCATION':
      return { ...state, pinLocation: action.payload };
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
  const [state, dispatch] = useReducer(mapReducer, initialState);

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
