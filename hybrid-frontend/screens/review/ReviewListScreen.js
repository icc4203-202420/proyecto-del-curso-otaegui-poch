import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ReviewListScreen = ({ route }) => {
  const { beerId } = route.params;
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState({}); // Almacenar los nombres de los usuarios
  const [error, setError] = useState(null); // Para manejar errores

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://192.168.1.101:3000/api/v1/reviews?beer_id=${beerId}`);
        if (!response.ok) {
          throw new Error('Error en la obtención de reseñas'); // Maneja errores de la respuesta
        }
        const data = await response.json();
        setReviews(data.reviews); // Ajusta para acceder a 'reviews'

        // Obtener los IDs de usuarios únicos para hacer una consulta adicional
        const userIds = [...new Set(data.reviews.map(review => review.user_id))];
        fetchUsers(userIds);
      } catch (error) {
        console.error(error);
        setError(error.message); // Captura y guarda el error
      }
    };

    const fetchUsers = async (userIds) => {
      try {
        const userResponses = await Promise.all(userIds.map(userId =>
          fetch(`http://192.168.1.100:3000/api/v1/users/${userId}`) // Asegúrate de que esta ruta exista
        ));

        const userData = await Promise.all(userResponses.map(res => res.json()));
        const usersMap = {};
        userData.forEach(user => {
          // Almacena el nombre del usuario como una combinación de first_name y last_name
          usersMap[user.id] = `${user.first_name} ${user.last_name}`;
        });
        setUsers(usersMap); // Actualiza el estado de usuarios
      } catch (error) {
        console.error('Error obteniendo usuarios:', error);
      }
    };

    fetchReviews();
  }, [beerId]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reseñas para la cerveza</Text>
      {error && <Text style={styles.errorText}>{error}</Text>} 
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          keyExtractor={(review) => review.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.reviewItem}>
              <Text style={styles.reviewText}>
                <Text style={styles.boldText}>Usuario:</Text> {users[item.user_id] || 'Desconocido'}
              </Text>
              <Text style={styles.reviewText}>
                <Text style={styles.boldText}>Calificación:</Text> {item.rating}
              </Text>
              <Text style={styles.reviewText}>
                <Text style={styles.boldText}>Comentario:</Text> {item.text}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text>No hay reseñas disponibles para esta cerveza.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  reviewItem: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});

export default ReviewListScreen;
