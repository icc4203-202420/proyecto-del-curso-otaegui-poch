import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';

const ReviewScreen = ({ route, navigation }) => {
  const { beerId } = route.params; // Recibe el id de la cerveza
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState('');

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
            beer_id: beerId,
          },
        }),
      });

      if (response.ok) {
        Alert.alert('¡Éxito!', 'Tu reseña ha sido enviada.');
        navigation.goBack(); // Vuelve a la pantalla anterior
      } else {
        Alert.alert('Error', 'No se pudo enviar la reseña. Inténtalo nuevamente.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Reseña</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
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

export default ReviewScreen;
