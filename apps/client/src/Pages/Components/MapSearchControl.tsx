import React, { useState } from 'react';
import { useMap } from 'react-leaflet';

interface Location {
  latitude: number;
  longitude: number;
  display_name: string;
}

interface SearchControlProps {
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
}

const SearchControl: React.FC<SearchControlProps> = ({ location, setLocation }) => {
  const map = useMap();
  const [city, setCity] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    const url = `https://nominatim.openstreetmap.org/search?city='${city}'&format=json&limit=1`;

    fetch(url, {
      method: "GET",
      mode: "cors",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to fetch location data');
      })
      .then((data) => {
        const newLocation = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          display_name: data[0].display_name,
        };
        setLocation(newLocation);
        map.flyTo([newLocation.latitude, newLocation.longitude], 15);
      })
      .catch(() => alert("Please check your input"));
  };

  return (
    <div className="leaflet-search-control">
      <form onSubmit={submitHandler}>
        <label>Enter the city:</label>
        <input
          placeholder="Los Angeles"
          type="text"
          value={city}
          onChange={handleChange}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchControl;
