import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Button } from 'react-native';

const BeerDetailsScreen = ({ route, navigation }) => {
  const { beer } = route.params;
  const [brewery, setBrewery] = useState(null);
  const [bars, setBars] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://192.168.1.110:3000/api/v1/brands/${beer.brand_id}`);
        const brandData = await response.json();

        if (brandData && brandData.brewery_id) {
          const breweryResponse = await fetch(`http://192.168.1.110:3000/api/v1/breweries/${brandData.brewery_id}`);
          const breweryData = await breweryResponse.json();
          setBrewery(breweryData);
        }

        const barsResponse = await fetch(`http://192.168.1.110:3000/api/v1/bars_beers?beer_id=${beer.id}`);
        const barsData = await barsResponse.json();
        setBars(barsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDetails();
  }, [beer.brand_id, beer.id]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: beer.image_url || 'https://via.placeholder.com/100' }}
      />
      <Text style={styles.name}>{beer.name}</Text>
      <Text style={styles.manufacturer}>Estilo: {beer.style}</Text>
      <Text style={styles.alcohol}>Alcohol: {beer.alcohol}</Text>
      <Text style={styles.ibu}>IBU: {beer.ibu}</Text>
      <Text style={styles.rating}>Calificación promedio: {beer.avg_rating}</Text>
      <Text style={styles.brewery}>Cervecería: {brewery ? brewery.name : 'Cargando...'}</Text>

      <Text style={styles.barsHeader}>Bares que sirven esta cerveza:</Text>
      {bars.length > 0 ? (
        <FlatList
          data={bars}
          keyExtractor={(bar) => bar.id.toString()}
          renderItem={({ item }) => <Text style={styles.barName}>{item.name}</Text>}
        />
      ) : (
        <Text>No hay bares disponibles para esta cerveza.</Text>
      )}

      {/* Botón para navegar a la pantalla de reseña */}
      <Button
        title="Hacer una reseña"
        onPress={() => navigation.navigate('ReviewScreen', { beerId: beer.id })}
      />

      {/* Nuevo botón para ver reseñas */}
      <Button
        title="Ver reseñas"
        onPress={() => navigation.navigate('ReviewListScreen', { beerId: beer.id })}
      />
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
  barsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  barName: {
    fontSize: 16,
    marginTop: 4,
  },
});

export default BeerDetailsScreen;