import React, { useEffect, useRef, useMemo } from 'react';
import {
  MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, useMapEvents,
} from 'react-leaflet';
import L, { Marker as LeafletMarker } from 'leaflet';
import { AddBathroomModal, AddRatingModal, AddReportModal, LoadingSpinner } from '../Components';
import {
  SET_LOCATION,
  SET_ZOOM_LEVEL,
  TOGGLE_ADD_BATHROOM_MODAL,
  TOGGLE_ADD_RATING_MODAL,
  TOGGLE_ADD_REPORT_MODAL,
  SET_PIN_LOCATION,
  SET_HAS_INITIAL_ZOOMED,
  REMOVE_PIN,
  SET_CONFIRM_BUTTON,
  SET_BATHROOM_ID,
} from '../../utils/actions';
import 'leaflet/dist/leaflet.css';
import { useMapContext } from '../../utils/context/MapContextProvider';
import { VerifyBathroom } from '../../utils/api';
import { useFindAllBathrooms, useCountVerify, useCreateVerify } from '../../utils/hooks';
import { CheckBadgeIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

type ChangeViewProps = {
  center: [number, number];
  zoom: number;
};

type CustomMarkerProps = {
  id: React.Key | null | undefined;
  longitude: number;
  latitude: number;
  gender: string;
  stallType: string;
  hoursOfOperation: string;
  keyRequirement: boolean;
  stars: number;
  wheelchairAccessible: boolean;
  address: string;
};

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
  map.flyTo(center, zoom, { duration: 1.25 });
  return null;
};


const MapView = ({ location, zoomLevel }: { location: [number, number]; zoomLevel: number; }) => {
  const { dispatch, state } = useMapContext();

  const { bathrooms, isLoadingFindAllBathrooms } = useFindAllBathrooms(
    location[0],
    location[1],
    500, // radius
    Boolean(location)
  );
  console.log("bathrooms", bathrooms);

  const { countVerify } = useCountVerify(state.bathroomId);
  console.log("countVerify", countVerify);

  const { createVerify } = useCreateVerify();

  const handleRateClick = () => {
    dispatch({ type: TOGGLE_ADD_RATING_MODAL });
  };

  const handleReportClick = () => {
    dispatch({ type: TOGGLE_ADD_REPORT_MODAL });
  };

  const handleVerifyClick = () => {
    const data: VerifyBathroom = {
      bathroomId: state.bathroomId,
    };
    createVerify(data);
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
            click: () => dispatch({ type: SET_BATHROOM_ID, payload: bathroom.id as string }),
          }}
        >
          <Popup>
            <div className="bg-white p-3 rounded-md shadow-sm space-y-2">
              <div className="text-center font-bold text-lg">Bathroom Details</div>

              <dl className="space-y-2">
                <div className="flex items-center space-x-2">
                  <dt className="text-sm font-bold text-gray-600">Gender:</dt>
                  <dd className="text-sm text-gray-800">{bathroom.gender}</dd>
                </div>

                <div className="flex items-center space-x-2">
                  <dt className="text-sm font-bold text-gray-600">Stall Type:</dt>
                  <dd className="text-sm text-gray-800">{bathroom.stallType}</dd>
                </div>

                <div className="flex items-center space-x-2">
                  <dt className="text-sm font-bold text-gray-600">Hours:</dt>
                  <dd className="text-sm text-gray-800">{bathroom.hoursOfOperation}</dd>
                </div>

                <div className="flex items-center space-x-2">
                  <dt className="text-sm font-bold text-gray-600">Key Required:</dt>
                  <dd className="text-sm text-gray-800">{bathroom.keyRequirement ? 'Yes' : 'No'}</dd>
                </div>

                <div className="flex items-center space-x-2">
                  <dt className="text-sm font-bold text-gray-600">Rating:</dt>
                  <dd className="text-sm text-gray-800">{bathroom.stars} stars</dd>
                </div>

                <div className="flex items-center space-x-2">
                  <dt className="text-sm font-bold text-gray-600">Wheelchair Accessible:</dt>
                  <dd className="text-sm text-gray-800">{bathroom.wheelchairAccessible ? 'Yes' : 'No'}</dd>
                </div>

                <div className="flex flex-wrap items-center space-x-2">
                  <dt className="text-sm font-bold text-gray-600">Address Notes:</dt>
                  <dd className="text-sm text-gray-800">{bathroom.address}</dd>
                </div>

                <div className="flex justify-between mt-2 text-xs space-x-4">
                  <button
                    type="button"
                    className="text-blue-500 hover:underline"
                    onClick={handleVerifyClick}
                  >verify</button>
                  <button
                    type="button"
                    className="text-blue-500 hover:underline"
                    onClick={handleRateClick}
                  >rate</button>
                  <button
                    type="button"
                    className="text-blue-500 hover:underline"
                    onClick={handleReportClick}
                  >report</button>
                </div>
              </dl>
              {countVerify > 0 ? (
                <div className="flex justify-end items-center mt-2 space-x-2">
                  <span className="text-sm font-medium text-gray-600">verified</span>
                  <CheckBadgeIcon className="h-5 w-5 text-green-600" />
                </div>
              ) : (
                <div className="flex justify-center items-center mt-2 space-x-2">
                  <span className="text-sm font-medium text-gray-600">awaiting verification</span>
                  <ShieldExclamationIcon className="h-5 w-5 text-grey-600" />
                </div>
              )}
            </div>
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
  }, [dispatch, state.hasInitialZoomed]);

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
      {state.isAddRatingModalOpen && (
        <AddRatingModal bathroomId={state.bathroomId} />
      )}
      {state.isAddReportModalOpen && (
        <AddReportModal bathroomId={state.bathroomId} />
      )}
    </div>
  );
}