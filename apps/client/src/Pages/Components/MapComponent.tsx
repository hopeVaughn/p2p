import React, { useEffect, useRef, useMemo } from 'react';
import {
  MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, useMapEvents,
} from 'react-leaflet';
import L, { Marker as LeafletMarker } from 'leaflet';
import { AddBathroomModal } from '../Components';
import { useFindAllBathrooms } from '../../utils/hooks';
import { useMapContext, LocationPayload } from '../../utils/context/MapContextProvider';
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
  setShowConfirmButton: React.Dispatch<React.SetStateAction<boolean>>;
  setPinLocation: (location: LocationPayload) => void;
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


const ChangeView: React.FC<ChangeViewProps> = ({ center, zoom }) => {
  const map = useMap();
  map.flyTo(center, zoom, { duration: 2 });
  return null;
};

const MapView = ({ location, zoomLevel }: { location: [number, number]; zoomLevel: number; }) => {
  const { bathrooms, isLoadingFindAllBathrooms } = useFindAllBathrooms(
    location[0],
    location[1],
    500, // radius
    Boolean(location)
  );
  return (
    <>
      {isLoadingFindAllBathrooms && <div>Loading...</div>}
      <ChangeView center={location} zoom={zoomLevel} />
      <Marker position={location} icon={blueMarker}>
        <Popup>You are here!</Popup>
      </Marker>
      {!isLoadingFindAllBathrooms && bathrooms?.map((bathroom: CustomMarkerProps) => (
        <Marker
          key={bathroom.id}
          position={[bathroom.longitude, bathroom.latitude]}
          icon={redMarker}
        >
          <Popup>Here we are!</Popup>
        </Marker>
      ))}
    </>
  );
};
const MemoizedMapView = React.memo(MapView);

const DraggablePinMarker = ({ setShowConfirmButton, setPinLocation, pinLocation }: DraggablePinMarkerProps) => {
  const markerRef = useRef<LeafletMarker | null>(null);

  useMapEvents({
    click: (e) => {
      const newLocation: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPinLocation(newLocation);
      setShowConfirmButton(true);
    }
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          const newLocation: [number, number] = [lat, lng];
          setPinLocation(newLocation);
          console.log("Updated Pin Coordinates:", newLocation);
          setShowConfirmButton(true);
        }
      }
    }),
    []
  );

  if (!pinLocation) return null;

  return (
    <Marker
      draggable={true}
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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      dispatch({ type: 'SET_LOCATION', payload: [position.coords.latitude, position.coords.longitude] });
    });
  }, [dispatch]);

  if (!state.location) {
    return <div>Loading map...</div>;
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
            setShowConfirmButton={(value) => dispatch({ type: 'TOGGLE_CONFIRM_BUTTON', payload: value })}
            setPinLocation={(location) => dispatch({ type: 'SET_PIN_LOCATION', payload: location })}
            pinLocation={state.pinLocation}
          />
        )}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ZoomControl position="bottomleft" />
      </MapContainer>

      {state.showConfirmButton && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_ADD_BATHROOM_MODAL' })}
            className="bg-cyan-700 text-white p-2 rounded"
          >
            Confirm Location
          </button>
        </div>
      )}

      {state.isAddBathroomModalOpen && (
        <AddBathroomModal
          onClose={() => dispatch({ type: 'TOGGLE_ADD_BATHROOM_MODAL' })}
          coordinates={state.pinLocation}
        />
      )}
    </div>
  );
}