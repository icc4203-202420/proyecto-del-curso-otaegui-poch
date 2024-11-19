import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Asegúrate de importar AsyncStorage

const ReviewScreen = ({ route, navigation }) => {
  const { beerId } = route.params; // Recibe el id de la cerveza
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState('');
  const [currentUser, setCurrentUser] = useState(null); // Estado para almacenar el usuario actual

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await AsyncStorage.getItem('current_user');
        if (user) {
          setCurrentUser(JSON.parse(user)); // Parsear el usuario si existe
        }
      } catch (err) {
        console.error('Error al obtener datos de usuario', err);
      }
    };

    fetchUserData();
  }, []);

  const handleReviewSubmit = async () => {
    // Verificar si la calificación está vacía o la reseña tiene menos de 15 palabras
    if (!rating || !reviewText) {
      Alert.alert('Error', 'Por favor, proporciona una calificación y una reseña.');
      return;
    }

    // Verificar que la reseña tenga al menos 15 palabras
    const wordCount = reviewText.trim().split(/\s+/).length;
    if (wordCount < 15) {
      Alert.alert('Error', 'La reseña debe tener al menos 15 palabras.');
      return;
    }

    // Reemplazar coma por punto en la calificación
    const normalizedRating = rating.replace(',', '.');

    // Verificar que la calificación sea un número entre 0 y 5
    const parsedRating = parseFloat(normalizedRating);
    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      Alert.alert('Error', 'La calificación debe ser un número entre 0 y 5.');
      return;
    }

    // Verificar si el usuario actual existe
    if (!currentUser || !currentUser.id) {
      Alert.alert('Error', 'No se pudo identificar al usuario logueado.');
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.13:3000/api/v1/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review: {
            text: reviewText,
            rating: parsedRating,
            user_id: currentUser.id, // Usar el ID del usuario logueado
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
      Alert.alert('Error', 'Ocurrió un error al enviar la reseña. Inténtalo nuevamente.');
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
