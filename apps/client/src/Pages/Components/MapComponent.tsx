import React, { useEffect, useState } from 'react';
import {
  MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl
} from 'react-leaflet';
import L from 'leaflet';
import { useFindAllBathrooms } from '../../utils/hooks';
import 'leaflet/dist/leaflet.css';

type ChangeViewProps = {
  center: [number, number];
  zoom: number;
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

export default function MapComponent() {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const radius = 2000; // 100 meters
  const shouldFetch = Boolean(location);

  // Using the custom hook here to fetch bathrooms
  const { bathrooms, isLoading: bathroomsLoading } = useFindAllBathrooms(
    location ? location[0] : 0,
    location ? location[1] : 0,
    radius,
    shouldFetch
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  if (!location) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="h-[75vh] w-full">
      <MapContainer
        center={location}
        zoom={13}
        zoomControl={false}
        scrollWheelZoom={false}
        className="z-0"
        style={{ height: "100%", width: "100%" }}
      >
        {location && <ChangeView center={location} zoom={18} />}

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={location} icon={blueMarker}>
          <Popup>
            You are here!
          </Popup>
        </Marker>

        {/* Render bathroom markers here */}
        {!bathroomsLoading && bathrooms?.map((bathroom) => (
          <Marker
            key={bathroom.id}
            position={[bathroom.longitude, bathroom.latitude]}
            icon={redMarker}
          >
            <Popup>
              here we are!
            </Popup>
          </Marker>
        ))}

        <ZoomControl position="bottomleft" />
      </MapContainer>
    </div>
  );
}
