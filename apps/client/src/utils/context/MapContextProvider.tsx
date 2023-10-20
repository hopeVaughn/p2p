import React, { createContext, useReducer, ReactNode, useContext } from 'react';
import {
  SET_LOCATION,
  SET_ZOOM_LEVEL,
  TOGGLE_ADD_BATHROOM_MODE,
  TOGGLE_ADD_BATHROOM_MODAL,
  SET_PIN_LOCATION,
  SET_HAS_INITIAL_ZOOMED,
  REMOVE_PIN,
  SET_CONFIRM_BUTTON,
  SINGLE_BATHROOM_ID
} from '../actions';
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
  | { type: typeof SET_LOCATION; payload: LocationPayload; }
  | { type: typeof SET_ZOOM_LEVEL; payload: number; }
  | { type: typeof TOGGLE_ADD_BATHROOM_MODE; }
  | { type: typeof TOGGLE_ADD_BATHROOM_MODAL; }
  | { type: typeof SET_PIN_LOCATION; payload: LocationPayload; }
  | { type: typeof SET_HAS_INITIAL_ZOOMED; payload: boolean; }
  | { type: typeof REMOVE_PIN; }
  | { type: typeof SET_CONFIRM_BUTTON; }
  | { type: typeof SINGLE_BATHROOM_ID; payload: string; };


// Define reducer
const mapReducer: React.Reducer<MapState, ActionType> = (state: typeof initialState, action: ActionType) => {
  switch (action.type) {
    case SET_LOCATION:
      return { ...state, location: action.payload };
    case SET_ZOOM_LEVEL:
      return { ...state, zoomLevel: action.payload };
    case TOGGLE_ADD_BATHROOM_MODE:
      return { ...state, isAddBathroomMode: !state.isAddBathroomMode };
    case TOGGLE_ADD_BATHROOM_MODAL:
      return { ...state, isAddBathroomModalOpen: !state.isAddBathroomModalOpen };
    case SET_PIN_LOCATION:
      return { ...state, pinLocation: action.payload };
    case SET_HAS_INITIAL_ZOOMED:
      return { ...state, hasInitialZoomed: action.payload };
    case REMOVE_PIN:
      return { ...state, pinLocation: null, confirmButton: false };
    case SET_CONFIRM_BUTTON:
      return { ...state, confirmButton: !state.confirmButton };
    case SINGLE_BATHROOM_ID:
      return { ...state, singleBathroomId: action.payload };
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
