import React, { useEffect, useRef, useMemo } from 'react';
import {
  MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, useMapEvents,
} from 'react-leaflet';
import L, { Marker as LeafletMarker } from 'leaflet';
import { AddBathroomModal, LoadingSpinner } from '../Components';
import { useFindAllBathrooms, useFindBathroomById } from '../../utils/hooks';
import { useMapContext } from '../../utils/context/MapContextProvider';
import {
  SET_LOCATION,
  SET_ZOOM_LEVEL,
  TOGGLE_ADD_BATHROOM_MODAL,
  SET_PIN_LOCATION,
  SET_HAS_INITIAL_ZOOMED,
  REMOVE_PIN,
  SET_CONFIRM_BUTTON
} from '../../utils/actions';
import 'leaflet/dist/leaflet.css';

type ChangeViewProps = {
  center: [number, number];
  zoom: number;
};

type CustomMarkerProps = {
  id: React.Key | null | undefined;
  longitude: number;
  latitude: number;
};

type DraggablePinMarkerProps = {
  pinLocation: [number, number] | null;
};

type CustomMarkerPopupProps = {
  bathroomId: string;
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
  map.flyTo(center, zoom, { duration: 1.25 });
  return null;
};

const BathroomDetails = ({ bathroomId }: CustomMarkerPopupProps) => {
  const { bathroom, isLoadingFindBathroomById, errorFindBathroomById } = useFindBathroomById(bathroomId, true);

  if (isLoadingFindBathroomById) {
    return <LoadingSpinner />;
  }

  if (errorFindBathroomById) {
    return <div>Error fetching bathroom: {errorFindBathroomById.message}</div>;
  }

  if (!bathroom || typeof bathroom !== 'object') {
    return <div>Error: Bathroom data is not available or invalid.</div>;
  }

  // Render the properties conditionally
  return (
    <div>
      {bathroom.gender && <p>Gender: {bathroom.gender}</p>}
      {bathroom.stallType && <p>Stall Type: {bathroom.stallType}</p>}
      {bathroom.wheelchairAccessible && <p>Accessible: {bathroom.wheelchairAccessible ? "Wheelchair Accessible" : "Not Wheelchair Accessible"}</p>}
      {bathroom.hoursOfOperation && <p>Hours of Operation: {bathroom.hoursOfOperation}</p>}
      {bathroom.keyRequirement && <p>Key Requirement: {bathroom.keyRequirement ? "Yes" : "No"}</p>}
      {bathroom.stars && <p>Rating: {bathroom.stars} Stars</p>}
      {bathroom.address && <p>Location Notes: {bathroom.address}</p>}
    </div>
  );
};


const MapView = ({ location, zoomLevel }: { location: [number, number]; zoomLevel: number; }) => {
  const { bathrooms, isLoadingFindAllBathrooms } = useFindAllBathrooms(
    location[0],
    location[1],
    500, // radius
    Boolean(location)
  );
  const handleMarkerClick = (id: React.Key | null | undefined) => {
    console.log("Clicked on bathroom with ID:", id);
  };
  return (
    <>
      {isLoadingFindAllBathrooms && <LoadingSpinner />}
      <ChangeView center={location} zoom={zoomLevel} />
      <Marker position={location} icon={blueMarker}>
        <Popup>You are here!</Popup>
      </Marker>
      {!isLoadingFindAllBathrooms && bathrooms?.map((bathroom: CustomMarkerProps) => (
        <Marker
          key={bathroom.id}
          position={[bathroom.longitude, bathroom.latitude]}
          icon={redMarker}
          eventHandlers={{
            click: () => handleMarkerClick(bathroom.id)
          }}
        >
          <Popup>
            <BathroomDetails bathroomId={bathroom.id as string} />
          </Popup>
        </Marker>
      ))}
    </>
  );
};
const MemoizedMapView = React.memo(MapView);

const DraggablePinMarker = ({ pinLocation }: DraggablePinMarkerProps) => {
  const markerRef = useRef<LeafletMarker | null>(null);
  const { dispatch, state } = useMapContext();
  useMapEvents({
    click: (e) => {
      const newLocation: [number, number] = [e.latlng.lat, e.latlng.lng];
      dispatch({ type: SET_PIN_LOCATION, payload: newLocation });
      dispatch({ type: SET_CONFIRM_BUTTON });
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
          console.log("Updated Pin Coordinates:", newLocation);
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

const MemoizedDraggablePinMarker = React.memo(DraggablePinMarker);

export default function MapComponent() {
  const { state, dispatch } = useMapContext(); // Use global context
  const LOAD_ZOOM = 13;
  const SEARCH_ZOOM = 15;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      dispatch({ type: SET_LOCATION, payload: [position.coords.latitude, position.coords.longitude] });

      // Check if the initial zoom animation has not been performed yet
      if (!state.hasInitialZoomed) {
        // Perform the initial zoom animation
        dispatch({ type: SET_ZOOM_LEVEL, payload: LOAD_ZOOM });

        // Set a timeout to zoom to SEARCH_ZOOM after a delay (e.g., 2 seconds)
        setTimeout(() => {
          dispatch({ type: SET_ZOOM_LEVEL, payload: SEARCH_ZOOM });

          // Update the state to indicate that the initial zoom has been completed
          dispatch({ type: SET_HAS_INITIAL_ZOOMED, payload: true });
        }, 500); // Adjust the delay as needed
      }
    });
  }, [dispatch, state.hasInitialZoomed, state.addBathroomCount]);

  if (!state.location) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <div className="h-[85vh] w-full relative">
      <MapContainer
        center={state.location}
        zoom={state.zoomLevel}
        zoomControl={false}
        scrollWheelZoom={true}
        className="z-0"
        style={{ height: "100%", width: "100%" }}
      >
        <MemoizedMapView
          location={state.location}
          zoomLevel={state.zoomLevel}
        />
        {state.isAddBathroomMode && (
          <MemoizedDraggablePinMarker
            pinLocation={state.pinLocation}
          />
        )}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ZoomControl position="bottomleft" />
      </MapContainer>

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
    </div>
  );
}