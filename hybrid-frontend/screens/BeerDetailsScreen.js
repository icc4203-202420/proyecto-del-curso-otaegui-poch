import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Button, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';

const BeerDetailsScreen = ({ route }) => {
  const { beer } = route.params;
  const [brewery, setBrewery] = useState(null);
  const [bars, setBars] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState('');
  
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://192.168.1.100:3000/api/v1/brands/${beer.brand_id}`);
        const brandData = await response.json();

        if (brandData && brandData.brewery_id) {
          const breweryResponse = await fetch(`http://192.168.1.100:3000/api/v1/breweries/${brandData.brewery_id}`);
          const breweryData = await breweryResponse.json();
          setBrewery(breweryData);
        }

        const barsResponse = await fetch(`http://192.168.1.100:3000/api/v1/bars_beers?beer_id=${beer.id}`);
        const barsData = await barsResponse.json();
        setBars(barsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDetails();
  }, [beer.brand_id, beer.id]);

  const handleReviewSubmit = async () => {
    if (!rating || !reviewText) {
      Alert.alert('Error', 'Por favor, proporciona una calificación y una reseña.');
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.100:3000/api/v1/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review: {
            text: reviewText,
            rating: parseFloat(rating),
            user_id: 1, // Cambia este valor por el ID real del usuario logueado
            beer_id: beer.id,
          },
        }),
      });

      if (response.ok) {
        Alert.alert('¡Éxito!', 'Tu reseña ha sido enviada.');
        setModalVisible(false);
        setReviewText('');
        setRating('');
      } else {
        Alert.alert('Error', 'No se pudo enviar la reseña. Inténtalo nuevamente.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: beer.image_url || 'https://via.placeholder.com/100' }}
      />
      <Text style={styles.name}>{beer.name}</Text>
      <Text style={styles.manufacturer}>Estilo: {beer.style}</Text>
      <Text style={styles.alcohol}>Alcohol: {beer.alcohol}%</Text>
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

      {/* Botón para hacer una reseña */}
      <Button title="Hacer una reseña" onPress={() => setModalVisible(true)} />

      {/* Modal para escribir reseña */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Agregar Reseña</Text>

          <TextInput
            style={styles.input}
            placeholder="Escribe tu reseña..."
            value={reviewText}
            onChangeText={setReviewText}
            multiline={true}
          />

          <TextInput
            style={styles.input}
            placeholder="Calificación (0-5)"
            value={rating}
            onChangeText={setRating}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleReviewSubmit}>
            <Text style={styles.submitButtonText}>Enviar</Text>
          </TouchableOpacity>

          <Button title="Cerrar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
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
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default BeerDetailsScreen;
