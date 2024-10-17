import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const BeerDetailsScreen = ({ route }) => {
  const { beer } = route.params; // Obtenemos los detalles de la cerveza desde los parámetros de navegación
  const [brewery, setBrewery] = useState(null); // Estado para almacenar la cervecería

  useEffect(() => {
    // Función para obtener la cervecería
    const fetchBrewery = async () => {
      try {
        const response = await fetch(`http://192.168.1.100:3000/api/v1/brands/${beer.brand_id}`); // Cambia a tu URL real
        const brandData = await response.json();
        
        if (brandData && brandData.brewery_id) {
          const breweryResponse = await fetch(`http://192.168.1.100:3000/api/v1/breweries/${brandData.brewery_id}`); // Cambia a tu URL real
          const breweryData = await breweryResponse.json();
          setBrewery(breweryData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchBrewery();
  }, [beer.brand_id]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: beer.image_url || 'https://via.placeholder.com/100' }} // Placeholder si no hay imagen
      />
      <Text style={styles.name}>{beer.name}</Text>
      <Text style={styles.manufacturer}>Estilo: {beer.style}</Text>
      <Text style={styles.alcohol}>Alcohol: {beer.alcohol}%</Text>
      <Text style={styles.ibu}>IBU: {beer.ibu}</Text>
      <Text style={styles.rating}>Calificación promedio: {beer.avg_rating}</Text>
      <Text style={styles.brewery}>Cervecería: {brewery ? brewery.name : 'Cargando...'}</Text> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  manufacturer: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 4,
  },
  alcohol: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ibu: {
    fontSize: 14,
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    marginBottom: 4,
  },
  brewery: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: 'bold',
  },
});

export default BeerDetailsScreen;
