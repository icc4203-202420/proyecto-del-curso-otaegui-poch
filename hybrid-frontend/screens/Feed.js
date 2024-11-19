import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Feed = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [feedItems, setFeedItems] = useState([]); // Arreglo para combinar fotos y reseñas
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [filteredFeedItems, setFilteredFeedItems] = useState([]); // Posts filtrados
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
      const fetchUserPictures = async () => {
        try {
          const response = await fetch(`http://192.168.1.101:3000/api/v1/events/pictures_by_user/${currentUser.id}`);
          if (!response.ok) {
            throw new Error('Error al obtener las imágenes del usuario');
          }
          const picturesData = await response.json();

          const postsData = picturesData.map((picture) => ({
            id: picture.id,
            image_url: picture.pictures_url[0],
            description: picture.description,
            user_name: currentUser.name,
            created_at: picture.created_at,
            event_id: picture.event_id,
            type: 'photo',
          }));

          const fetchFriendsReviews = async () => {
            try {
              const response = await fetch(`http://192.168.1.101:3000/api/v1/friendships?user_id=${currentUser.id}`);
              if (!response.ok) {
                throw new Error('Error al obtener las relaciones de amistad');
              }
              const friendshipsData = await response.json();

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

              const friendImagesPromises = friendIds.map(async (friendId) => {
                const imagesResponse = await fetch(`http://192.168.1.101:3000/api/v1/events/pictures_by_user/${friendId}`);
                if (!imagesResponse.ok) {
                  throw new Error(`Error al obtener imágenes del amigo con id ${friendId}`);
                }
                return imagesResponse.json();
              });

              const friendImagesData = await Promise.all(friendImagesPromises);
              const allFriendImages = friendImagesData.flatMap((data, index) => 
                data.map(picture => ({
                  id: picture.id,
                  image_url: picture.pictures_url[0],
                  description: picture.description,
                  user_name: friendshipsData.friendships[index].friend_name,
                  created_at: picture.created_at,
                  event_id: picture.event_id,
                  type: 'photo',
                }))
              );

              const userReviewsResponse = await fetch(`http://192.168.1.101:3000/api/v1/reviews?user_id=${currentUser.id}`);
              if (!userReviewsResponse.ok) {
                throw new Error('Error al obtener las reseñas del usuario actual');
              }
              const userReviewsData = await userReviewsResponse.json();

              const allReviews = [...userReviewsData.reviews, ...allFriendReviews].map((review) => ({
                id: review.id,
                user_name: review.user.name,
                created_at: review.created_at,
                rating: review.rating,
                text: review.text,
                beer_name: review.beer.name,
                beer_image_url: review.beer.image_url,
                type: 'review',
              }));

              setFeedItems([...postsData, ...allFriendImages, ...allReviews]);
            } catch (error) {
              console.error(error);
              setError(error.message);
            }
          };

          fetchFriendsReviews();

        } catch (error) {
          console.error(error);
          setError(error.message);
        }
      };

      fetchUserPictures();
    }
  }, [currentUser]);

  // Filtrar posts por término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFeedItems(feedItems);
    } else {
      const filteredItems = feedItems.filter(item =>
        item.user_name?.toLowerCase()?.includes(searchTerm.toLowerCase()) // Validación de existencia
      );
      setFilteredFeedItems(filteredItems);
    }
  }, [searchTerm, feedItems]);

  const handlePress = (item) => {
    if (item.type === 'photo') {
      navigation.navigate('EventDetails', { eventId: item.event_id });
    } else if (item.type === 'review') {
      navigation.navigate('BeerDetails', { beer: item });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Feed</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre de usuario..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {filteredFeedItems.length > 0 ? (
        <FlatList
          data={filteredFeedItems}
          keyExtractor={(item) => `${item.id}_${item.type}`}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)} style={styles.post}>
              {item.type === 'photo' ? (
                <>
                  <View style={styles.postHeader}>
                    <Text style={styles.postUser}>{item.user_name}</Text>
                    <Text style={styles.postDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                  </View>
                  {item.image_url ? (
                    <Image source={{ uri: item.image_url }} style={styles.postImage} />
                  ) : (
                    <Text>Imagen no disponible</Text>
                  )}
                  {item.description && <Text style={styles.postDescription}>{item.description}</Text>}
                </>
              ) : (
                <>
                  <View style={styles.postHeader}>
                    <Text style={styles.postUser}>{item.user_name}</Text>
                    <Text style={styles.postDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                  </View>
                  <Image source={{ uri: item.beer_image_url }} style={styles.beerImage} />
                  <Text style={styles.postBeerName}>{item.beer_name}</Text>
                  <Text style={styles.postRating}>Calificación: {item.rating} ⭐</Text>
                  <Text style={styles.postText}>{item.text}</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noItemsText}>No hay publicaciones o reseñas para mostrar.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
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
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  postUser: {
    fontWeight: 'bold',
  },
  postDate: {
    fontSize: 12,
    color: '#777',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 8,
  },
  postDescription: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  postBeerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  postRating: {
    fontSize: 14,
    color: '#555',
  },
  postText: {
    marginTop: 4,
    fontSize: 14,
    color: '#333',
  },
  beerImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  noItemsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default Feed;
