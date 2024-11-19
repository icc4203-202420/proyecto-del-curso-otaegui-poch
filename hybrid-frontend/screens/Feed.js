import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Feed = ({ navigation }) => {
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

  const handlePress = (beer) => {
    // Navegar a la pantalla BeerDetails y pasar los datos de la cerveza
    navigation.navigate('BeerDetails', { beer });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reseñas</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          keyExtractor={(review) => review.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item.beer)} style={styles.post}>
              <View style={styles.postHeader}>
                <Text style={styles.postUser}>{item.user.name}</Text>
                <Text style={styles.postDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
              </View>
              <Image
                source={{ uri: item.beer.image_url }} // Si tienes una URL de imagen
                style={styles.beerImage}
              />
              <Text style={styles.postBeerName}>{item.beer.name}</Text>
              <Text style={styles.postRating}>Calificación: {item.rating} ⭐</Text>
              <Text style={styles.postText}>{item.text}</Text>
            </TouchableOpacity>
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
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  post: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  postUser: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  postDate: {
    fontSize: 14,
    color: '#888',
  },
  beerImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 8,
    resizeMode: 'cover',
  },
  postBeerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 4,
  },
  postRating: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  postText: {
    fontSize: 16,
    color: '#555',
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
