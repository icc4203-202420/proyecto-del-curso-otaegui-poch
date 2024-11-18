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
      const fetchFriendsReviews = async () => {
        try {
          // Obtener las relaciones de amistad del usuario
          const response = await fetch(`http://192.168.1.101:3000/api/v1/friendships?user_id=${currentUser.id}`);
          if (!response.ok) {
            throw new Error('Error al obtener las relaciones de amistad');
          }
          const friendshipsData = await response.json();
          
          // Obtener reseñas de los amigos
          const friendIds = friendshipsData.friendships.map(friend => friend.friend_id);
          const reviewsPromises = friendIds.map(async (friendId) => {
            const reviewsResponse = await fetch(`http://192.168.1.101:3000/api/v1/reviews?user_id=${friendId}`);
            if (!reviewsResponse.ok) {
              throw new Error(`Error al obtener reseñas del amigo con id ${friendId}`);
            }
            return reviewsResponse.json();
          });

          const reviewsData = await Promise.all(reviewsPromises);
          const allFriendReviews = reviewsData.flatMap(data => data.reviews);

          // Obtener las reseñas del usuario actual
          const userReviewsResponse = await fetch(`http://192.168.1.101:3000/api/v1/reviews?user_id=${currentUser.id}`);
          if (!userReviewsResponse.ok) {
            throw new Error('Error al obtener las reseñas del usuario actual');
          }
          const userReviewsData = await userReviewsResponse.json();

          // Combina las reseñas de los amigos y el usuario actual
          const allReviews = [...userReviewsData.reviews, ...allFriendReviews];
          setReviews(allReviews);
        } catch (error) {
          console.error(error);
          setError(error.message);
        }
      };

      fetchFriendsReviews();
    }
  }, [currentUser]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Posts</Text>
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
        <Text style={styles.noReviewsText}>Aún no tienes reseñas de tus amigos o tuyas.</Text>
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
