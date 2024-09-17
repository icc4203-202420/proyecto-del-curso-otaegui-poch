import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];

const MapComponent = ({ bars, searchQuery }) => {
  const [center, setCenter] = useState({ lat: -33.4489, lng: -70.6693 }); // Coordenadas de Santiago por defecto
  const [markers, setMarkers] = useState([]);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries,
  });

  useEffect(() => {
    // Detectar ubicación actual del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error al obtener la ubicación del usuario:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    // Filtrar los bares según el término de búsqueda
    if (searchQuery) {
      const filteredBars = bars.filter(bar => bar.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setMarkers(filteredBars);
    } else {
      setMarkers([]);
    }
  }, [searchQuery, bars]);

  if (loadError) return <div>Error al cargar Google Maps</div>;

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100vh' }}
      center={center}
      zoom={13}
    >
      {markers.map((bar) => (
        <Marker
          key={bar.id}
          position={{ lat: bar.latitude, lng: bar.longitude }}
          label={bar.name}
          title={bar.name} // Opcional: Muestra el nombre del bar como un título emergente
        />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;
