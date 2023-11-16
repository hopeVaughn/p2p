import React, { createContext, useReducer, ReactNode, useContext } from 'react';
import {
  SET_LOCATION,
  SET_ZOOM_LEVEL,
  TOGGLE_ADD_BATHROOM_MODE,
  TOGGLE_ADD_BATHROOM_MODAL,
  TOGGLE_ADD_RATING_MODAL,
  TOGGLE_ADD_REPORT_MODAL,
  TOGGLE_UPDATE_MODAL,
  SET_PIN_LOCATION,
  SET_HAS_INITIAL_ZOOMED,
  REMOVE_PIN,
  SET_CONFIRM_BUTTON,
  SET_BATHROOM_ID,
  SET_CONFIRM_CREATOR,
  SET_IS_LOADING,
  SET_CURRENT_NAVIGATION,
  TOGGLE_SHOULD_RECENTER,
  SET_USER_LOCATION_MODE,
  SET_USER_LOCATION,
} from '../actions';

export type LocationPayload = [number, number] | null;

type MapState = {
  location: LocationPayload;
  zoomLevel: number;
  isAddBathroomMode: boolean;
  isAddBathroomModalOpen: boolean;
  isAddRatingModalOpen: boolean;
  isAddReportModalOpen: boolean;
  isUpdateModalOpen: boolean;
  isBathroomCreator: boolean;
  bathroomId: string;
  pinLocation: LocationPayload;
  userLocation: LocationPayload;
  hasInitialZoomed: boolean;
  confirmButton: boolean;
  isLoading: boolean;
  currentNavigation: string;
  shouldRecenter: boolean;
  isUserLocationMode: boolean;
};
// Define initial state
const initialState: MapState = {
  location: [0, 0],
  zoomLevel: 2,
  isAddBathroomMode: false,
  isAddBathroomModalOpen: false,
  isAddRatingModalOpen: false,
  isAddReportModalOpen: false,
  isUpdateModalOpen: false,
  isBathroomCreator: false,
  bathroomId: '',
  pinLocation: null,
  userLocation: null,
  hasInitialZoomed: false,
  confirmButton: false,
  isLoading: false,
  currentNavigation: 'Search',
  shouldRecenter: true,
  isUserLocationMode: false,
};

// Define action types
type ActionType =
  | { type: typeof SET_LOCATION; payload: LocationPayload; }
  | { type: typeof SET_ZOOM_LEVEL; payload: number; }
  | { type: typeof TOGGLE_ADD_BATHROOM_MODE; payload: boolean; }
  | { type: typeof TOGGLE_ADD_BATHROOM_MODAL; }
  | { type: typeof TOGGLE_ADD_RATING_MODAL; }
  | { type: typeof TOGGLE_ADD_REPORT_MODAL; }
  | { type: typeof TOGGLE_UPDATE_MODAL; }
  | { type: typeof SET_PIN_LOCATION; payload: LocationPayload; }
  | { type: typeof SET_USER_LOCATION; payload: LocationPayload; }
  | { type: typeof SET_HAS_INITIAL_ZOOMED; payload: boolean; }
  | { type: typeof REMOVE_PIN; }
  | { type: typeof SET_CONFIRM_BUTTON; payload: boolean; }
  | { type: typeof SET_BATHROOM_ID; payload: string; }
  | { type: typeof SET_CONFIRM_CREATOR; payload: boolean; }
  | { type: typeof SET_IS_LOADING; payload: boolean; }
  | { type: typeof SET_CURRENT_NAVIGATION; payload: string; }
  | { type: typeof TOGGLE_SHOULD_RECENTER; }
  | { type: typeof SET_USER_LOCATION_MODE; payload: boolean; };


// Define reducer
const mapReducer: React.Reducer<MapState, ActionType> = (state: typeof initialState, action: ActionType) => {
  switch (action.type) {
    case SET_LOCATION:
      return { ...state, location: action.payload };
    case SET_ZOOM_LEVEL:
      return { ...state, zoomLevel: action.payload };
    case TOGGLE_ADD_BATHROOM_MODE:
      return { ...state, isAddBathroomMode: action.payload };
    case TOGGLE_ADD_BATHROOM_MODAL:
      return { ...state, isAddBathroomModalOpen: !state.isAddBathroomModalOpen };
    case TOGGLE_ADD_RATING_MODAL:
      return { ...state, isAddRatingModalOpen: !state.isAddRatingModalOpen };
    case TOGGLE_ADD_REPORT_MODAL:
      return { ...state, isAddReportModalOpen: !state.isAddReportModalOpen };
    case TOGGLE_UPDATE_MODAL:
      return { ...state, isUpdateModalOpen: !state.isUpdateModalOpen };
    case SET_PIN_LOCATION:
      return { ...state, pinLocation: action.payload };
    case SET_USER_LOCATION:
      return { ...state, userLocation: action.payload };
    case SET_HAS_INITIAL_ZOOMED:
      return { ...state, hasInitialZoomed: action.payload };
    case REMOVE_PIN:
      return { ...state, pinLocation: null, confirmButton: false };
    case SET_CONFIRM_BUTTON:
      return { ...state, confirmButton: action.payload };
    case SET_BATHROOM_ID:
      return { ...state, bathroomId: action.payload };
    case SET_CONFIRM_CREATOR:
      return { ...state, isBathroomCreator: action.payload };
    case SET_IS_LOADING:
      return { ...state, isLoading: action.payload };
    case SET_CURRENT_NAVIGATION:
      return { ...state, currentNavigation: action.payload };
    case TOGGLE_SHOULD_RECENTER:
      return { ...state, shouldRecenter: !state.shouldRecenter };
    case SET_USER_LOCATION_MODE:
      return { ...state, isUserLocationMode: action.payload };
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
