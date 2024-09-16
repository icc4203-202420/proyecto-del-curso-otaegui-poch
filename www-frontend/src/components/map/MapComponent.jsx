import { Loader } from '@googlemaps/js-api-loader';
import { useEffect, useRef } from 'react';

const MapComponent = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY, // Asegúrate de definir esta variable en tu archivo .env
      version: 'weekly',
    });
    
    loader.importLibrary('maps').then((lib) => {
      const { Map } = lib;
      const map = new Map(mapRef.current, {
        center: { lat: -34.397, lng: 150.644 }, // Cambia las coordenadas por las de tu área de interés
        zoom: 8,
      });
      return map;
    })
    .then((map) => {
      loader.importLibrary('marker').then((lib) => {
        const { AdvancedMarkerElement } = lib;
        new AdvancedMarkerElement({
          position: { lat: -34.397, lng: 150.644 },
          map,
        });
      });
    });
  }, []);

  return <div ref={mapRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default MapComponent;
