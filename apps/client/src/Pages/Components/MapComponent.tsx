import { useEffect, useRef, useMemo, useState } from 'react';
import {
  MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, useMapEvents
} from 'react-leaflet';
import L, { Marker as LeafletMarker } from 'leaflet';
import { AddBathroomModal, AddRatingModal, AddReportModal, LoadingSpinner } from '../Components';
import { UpdateModal } from '../Protected_Routes/components';
import {
  SET_USER_LOCATION,
  SET_ZOOM_LEVEL,
  TOGGLE_ADD_BATHROOM_MODAL,
  SET_PIN_LOCATION,
  SET_HAS_INITIAL_ZOOMED,
  REMOVE_PIN,
  SET_CONFIRM_BUTTON,
  TOGGLE_SHOULD_RECENTER,
} from '../../utils/actions';
import 'leaflet/dist/leaflet.css';
import { useMapContext, LocationPayload } from '../../utils/context/MapContextProvider';
import { useFindAllBathrooms } from '../../utils/hooks';
import BathroomMarker from '../Protected_Routes/components/BathroomMarker';

type ChangeViewProps = {
  center: [number, number];
  zoom: number;
};

// type CustomMarkerProps = {
//   id: React.Key | null | undefined;
//   longitude: number;
//   latitude: number;
//   gender: string;
//   stallType: string;
//   hoursOfOperation: string;
//   keyRequirement: boolean;
//   stars: number;
//   wheelchairAccessible: boolean;
//   address: string;
//   verification_count: number;
// };

type DraggablePinMarkerProps = {
  pinLocation: [number, number] | null;
};

const customBlueMarkerSVG = `
data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="46" height="56">
    <path fill="%2300F" fill-rule="evenodd" d="M39.263 7.673c8.897 8.812 8.966 23.168.153 32.065l-.153.153L23 56 6.737 39.89C-2.16 31.079-2.23 16.723 6.584 7.826l.153-.152c9.007-8.922 23.52-8.922 32.526 0zM23 14.435c-5.211 0-9.436 4.185-9.436 9.347S17.79 33.128 23 33.128s9.436-4.184 9.436-9.346S28.21 14.435 23 14.435z"/>
</svg>
`;

const customRedMarkerSVG = `
data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="46" height="56">
    <path fill="%23F00" fill-rule="evenodd" d="M39.263 7.673c8.897 8.812 8.966 23.168.153 32.065l-.153.153L23 56 6.737 39.89C-2.16 31.079-2.23 16.723 6.584 7.826l.153-.152c9.007-8.922 23.52-8.922 32.526 0zM23 14.435c-5.211 0-9.436 4.185-9.436 9.347S17.79 33.128 23 33.128s9.436-4.184 9.436-9.346S28.21 14.435 23 14.435z"/>
</svg>
`;

const blueMarker = new L.Icon({
  iconUrl: customBlueMarkerSVG,
  iconSize: [35, 45],
});

const redMarker = new L.Icon({
  iconUrl: customRedMarkerSVG,
  iconSize: [35, 45],
});


const ChangeView = ({ center, zoom }: ChangeViewProps) => {
  const map = useMap();
  const { state, dispatch } = useMapContext();

  useEffect(() => {
    if (state.shouldRecenter) {
      map.flyTo(center, zoom, { duration: 1.25 });
      // Optionally, toggle recentering off after moving
      dispatch({ type: TOGGLE_SHOULD_RECENTER });
    }
  }, [center, zoom, state.shouldRecenter, map, dispatch]);

  return null;
};



const MapView = ({ location, zoomLevel }: { location: [number, number]; zoomLevel: number; }) => {
  const { state, dispatch } = useMapContext();
  const [shouldFetchBathrooms, setShouldFetchBathrooms] = useState(false);

  useEffect(() => {
    // Check if userLocation is not null and different from initial [0, 0]
    if (state.userLocation && (state.userLocation[0] !== 0 || state.userLocation[1] !== 0)) {
      setShouldFetchBathrooms(true);
    }
  }, [state.userLocation]);

  const { bathrooms, isLoading } = useFindAllBathrooms(
    location[0],
    location[1],
    500, // radius
    shouldFetchBathrooms // shouldFetch
  );

  const markerRef = useRef<LeafletMarker | null>(null);

  const userLocationEventHandlers = useMemo(() => ({
    dragend: () => {
      const marker = markerRef.current;
      if (marker) {
        const { lat, lng } = marker.getLatLng();
        const newUserLocation: LocationPayload = [lat, lng];
        dispatch({ type: SET_USER_LOCATION, payload: newUserLocation });
      }
    }
  }), [dispatch]);


  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <ChangeView center={location} zoom={zoomLevel} />
      {state.userLocation && (
        <Marker
          position={state.userLocation}
          icon={blueMarker}
          draggable={true}
          eventHandlers={userLocationEventHandlers}
          ref={markerRef}
        >
          <Popup>Your selected location</Popup>
        </Marker>
      )}
      {bathrooms.map(bathroom => (
        <BathroomMarker key={bathroom.id} bathroom={bathroom} />
      ))}
    </>
  );
};


const DraggablePinMarker = ({ pinLocation }: DraggablePinMarkerProps) => {
  const { dispatch, state } = useMapContext();
  const markerRef = useRef<LeafletMarker | null>(null);

  useMapEvents({
    click: (e) => {
      const newLocation: [number, number] = [e.latlng.lat, e.latlng.lng];
      dispatch({ type: SET_PIN_LOCATION, payload: newLocation });
      dispatch({ type: SET_CONFIRM_BUTTON, payload: true });
    }
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          const newLocation: [number, number] = [lat, lng];
          dispatch({ type: SET_PIN_LOCATION, payload: newLocation });
          dispatch({ type: SET_CONFIRM_BUTTON, payload: true });
        }
      }
    }),
    []
  );

  if (!pinLocation) return null;

  return (
    <Marker
      draggable={state.confirmButton}
      eventHandlers={eventHandlers}
      position={pinLocation}
      icon={redMarker}
      ref={markerRef}
    >
      <Popup>Chosen location!</Popup>
    </Marker>
  );
};

function MapClickHandler() {
  const { state, dispatch } = useMapContext();

  useMapEvents({
    click: (e) => {
      const newLocation: LocationPayload = [e.latlng.lat, e.latlng.lng];

      if (state.isAddBathroomMode) {
        // If in add bathroom mode, update pinLocation
        dispatch({ type: SET_PIN_LOCATION, payload: newLocation });
      } else {
        // Otherwise, update userLocation
        dispatch({ type: SET_USER_LOCATION, payload: newLocation });
      }
    }
  });

  return null;
}


export default function MapComponent() {
  const { state, dispatch } = useMapContext();
  const LOAD_ZOOM = 2; // Zoom level to show the world map

  useEffect(() => {
    if (!state.hasInitialZoomed) {
      dispatch({ type: SET_ZOOM_LEVEL, payload: LOAD_ZOOM });
      dispatch({ type: SET_HAS_INITIAL_ZOOMED, payload: true });
    }
  }, [dispatch, state.hasInitialZoomed]);

  const recenterMap = () => {
    dispatch({ type: TOGGLE_SHOULD_RECENTER });
  };

  if (!state.location) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-[70vh] w-full relative">
      <MapContainer
        center={state.location}
        zoom={state.zoomLevel}
        zoomControl={false}
        scrollWheelZoom={true}
        className="z-0"
        style={{ height: "100%", width: "100%" }}
      >
        <MapClickHandler />
        <MapView location={state.userLocation || [0, 0]} zoomLevel={state.zoomLevel} />
        {/* <UserLocationMarker /> */}

        {state.isAddBathroomMode && (
          <DraggablePinMarker
            pinLocation={state.pinLocation}
          />
        )}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ZoomControl position="bottomleft" />
      </MapContainer>

      {/* Recenter button */}
      {
        !state.isAddBathroomModalOpen && !state.isAddRatingModalOpen && !state.isAddReportModalOpen && !state.isUpdateModalOpen && (
          <button
            onClick={recenterMap}
            className="absolute bottom-4 right-4 bg-cyan-700 text-white p-2 rounded hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-opacity-50"
            style={{ zIndex: 1000 }}
          >
            Recenter Map
          </button>
        )
      }

      {/* Confirm button */}
      {state.isAddBathroomMode && (
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button
            onClick={() => dispatch({ type: TOGGLE_ADD_BATHROOM_MODAL })}
            className="bg-cyan-700 text-white p-2 rounded"
            disabled={!state.confirmButton}
          >
            Confirm Location
          </button>
          <button
            onClick={() => dispatch({ type: REMOVE_PIN })}
            className="bg-red-700 text-white p-2 rounded"
            disabled={!state.confirmButton}
          >
            Remove Pin
          </button>
        </div>
      )}

      {state.isAddBathroomModalOpen && (
        <AddBathroomModal
          coordinates={state.pinLocation as [number, number]}
        />
      )}
      {state.isAddRatingModalOpen && (
        <AddRatingModal bathroomId={state.bathroomId} />
      )}
      {state.isAddReportModalOpen && (
        <AddReportModal bathroomId={state.bathroomId} />
      )}
      {state.isUpdateModalOpen && (
        <UpdateModal />
      )}
    </div>
  );
}