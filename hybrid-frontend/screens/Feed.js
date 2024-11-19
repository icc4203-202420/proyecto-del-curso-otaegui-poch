import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Feed = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [feedItems, setFeedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFeedItems, setFilteredFeedItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await AsyncStorage.getItem('current_user');
        if (user) {
          setCurrentUser(JSON.parse(user));
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
          if (!response.ok) throw new Error('Error al obtener las imágenes del usuario');
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

          const fetchFriendsReviewsAndPictures = async () => {
            const friendshipsResponse = await fetch(`http://192.168.1.101:3000/api/v1/friendships?user_id=${currentUser.id}`);
            if (!friendshipsResponse.ok) throw new Error('Error al obtener las relaciones de amistad');
            const friendshipsData = await friendshipsResponse.json();

            const friendIds = friendshipsData.friendships.map(friend => friend.friend_id);

            const friendsPostsPromises = friendIds.map(async (friendId) => {
              const [reviewsResponse, picturesResponse] = await Promise.all([
                fetch(`http://192.168.1.101:3000/api/v1/reviews?user_id=${friendId}`),
                fetch(`http://192.168.1.101:3000/api/v1/events/pictures_by_user/${friendId}`)
              ]);

              if (!reviewsResponse.ok || !picturesResponse.ok) {
                throw new Error(`Error al obtener publicaciones del amigo con id ${friendId}`);
              }

              const reviewsData = await reviewsResponse.json();
              const picturesData = await picturesResponse.json();

              return {
                reviews: reviewsData.reviews.map(review => ({
                  id: review.id,
                  user_name: review.user.name,
                  created_at: review.created_at,
                  rating: review.rating,
                  text: review.text,
                  beer_name: review.beer.name,
                  beer_image_url: review.beer.image_url,
                  beer_id: review.beer.id,
                  type: 'review',
                })),
                pictures: picturesData.map(picture => ({
                  id: picture.id,
                  image_url: picture.pictures_url[0],
                  description: picture.description,
                  user_name: friendshipsData.friendships.find(friend => friend.friend_id === friendId)?.friend_name,
                  created_at: picture.created_at,
                  event_id: picture.event_id,
                  type: 'photo',
                })),
              };
            });

            const friendsPostsData = await Promise.all(friendsPostsPromises);

            const combinedPosts = [
              ...postsData,
              ...friendsPostsData.flatMap(data => [...data.reviews, ...data.pictures]),
            ];

            setFeedItems(combinedPosts);
          };

          fetchFriendsReviewsAndPictures();
        } catch (error) {
          console.error(error);
          setError(error.message);
        }
      };

      fetchUserPictures();
    }
  }, [currentUser]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFeedItems(feedItems);
    } else {
      const filteredItems = feedItems.filter(item => 
        item.user_name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || 
        (item.type === 'review' && item.beer_name?.toLowerCase()?.includes(searchTerm.toLowerCase()))
      );
      setFilteredFeedItems(filteredItems);
    }
  }, [searchTerm, feedItems]);

  const handlePress = async (item) => {
    if (item.type === 'photo') {
      navigation.navigate('EventDetails', { eventId: item.event_id });
    } else if (item.type === 'review') {
      try {
        // Fetch complete beer details before navigation
        const beerResponse = await fetch(`http://192.168.1.101:3000/api/v1/beers/${item.beer_id}`);
        const beerData = await beerResponse.json();
  
        navigation.navigate('BeerDetails', {
          beer: {
            id: item.beer_id,
            name: item.beer_name,
            image_url: item.beer_image_url,
            style: beerData.style || '',
            alcohol: beerData.alcohol || '',
            ibu: beerData.ibu || '',
            avg_rating: beerData.avg_rating || '',
            brand_id: beerData.brand_id
          }
        });
      } catch (error) {
        console.error('Error fetching beer details:', error);
        alert('No se pudieron obtener los detalles de la cerveza');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Feed</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por usuario o cerveza..."
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
                  <Image source={{ uri: item.image_url }} style={styles.postImage} />
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
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
    marginBottom: 8,
    borderRadius: 8,
  },
  beerImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 8,
  },
  postBeerName: {
    fontWeight: 'bold',
  },
  postRating: {
    color: '#f5a623',
  },
  postText: {
    marginTop: 8,
    color: '#555',
  },
  postDescription: {
    color: '#777',
  },
  noItemsText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default Feed;
