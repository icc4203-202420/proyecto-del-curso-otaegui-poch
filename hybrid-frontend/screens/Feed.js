import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Feed = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await AsyncStorage.getItem('current_user');
        if (user) {
          setCurrentUser(JSON.parse(user)); // Almacena al usuario actual como objeto
        } else {
          console.warn('Usuario no encontrado en AsyncStorage');
        }
      } catch (err) {
        console.error('Error al obtener datos de usuario', err);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      const fetchUserReviews = async () => {
        try {
          const response = await fetch(`http://192.168.1.101:3000/api/v1/reviews?user_id=${currentUser.id}`);
          if (!response.ok) {
            throw new Error('Error en la obtención de reseñas');
          }
          const data = await response.json();
          setReviews(data.reviews); // Ajusta según la estructura de tu API
        } catch (error) {
          console.error(error);
          setError(error.message);
        }
      };

      fetchUserReviews();
    }
  }, [currentUser]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tus Publicaciones</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          keyExtractor={(review) => review.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.post}>
              <Text style={styles.postText}>
                <Text style={styles.boldText}>Usuario:</Text> {item.user.name}
              </Text>
              <Text style={styles.postText}>
                <Text style={styles.boldText}>Cerveza:</Text> {item.beer.name}
              </Text>
              <Text style={styles.postText}>
                <Text style={styles.boldText}>Calificación:</Text> {item.rating}
              </Text>
              <Text style={styles.postText}>
                <Text style={styles.boldText}>Comentario:</Text> {item.text}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noReviewsText}>Aún no has publicado ninguna reseña.</Text>
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
  post: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  postText: {
    fontSize: 16,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },
  noReviewsText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});

export default Feed;
