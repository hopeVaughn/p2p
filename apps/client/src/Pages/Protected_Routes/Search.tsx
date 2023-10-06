import React, { useEffect, useState } from 'react';
import {
  MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl
} from 'react-leaflet';
import L from 'leaflet';
import CustomMarker from '../../assets/images/icon-location.svg';

type ChangeViewProps = {
  center: [number, number];
  zoom: number;
};

const customMarker = new L.Icon({
  iconUrl: CustomMarker,
  iconSize: [35, 45],
});

const ChangeView: React.FC<ChangeViewProps> = ({ center, zoom }) => {
  const map = useMap();
  map.flyTo(center, zoom, { duration: 2 });
  return null;
};

export default function Search() {
  const [location, setLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  if (!location) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        center={location}
        zoom={13}
        zoomControl={false}
        scrollWheelZoom={false}
        className="z-0"
        style={{ height: "100%", width: "100%" }}
      >
        <ChangeView center={location} zoom={13} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={location} icon={customMarker}>
          <Popup>
            You are here!
          </Popup>
        </Marker>
        <ZoomControl position="bottomleft" />
      </MapContainer>
    </div>
  );
}
