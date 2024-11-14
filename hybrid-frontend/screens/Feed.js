import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  console.log(currentUser);
  console.log(token, "hola")

  // ID del usuario, este puede venir del estado global o contexto
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await AsyncStorage.getItem('current_user');
        const authToken = await AsyncStorage.getItem('authToken');
        setCurrentUser(JSON.parse(user));
        setToken(JSON.parse(authToken));
      } catch (err) {
        console.error('Error al obtener datos de usuario', err);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (currentUser && token) {
      // Consulta la API para obtener el feed
      const fetchFeed = async () => {
        try {
          const response = await axios.get(`http://192.168.1.14:3001/api/v1/users/${currentUser.id}/feed`, {
            headers: {
              'Authorization': `Bearer ${token}`,  // Agregar el token JWT
            },
          });
          setPosts(response.data);  // Asume que la API devuelve un arreglo de publicaciones
        } catch (err) {
          setError('Error al obtener las publicaciones');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchFeed();
    }
  }, [currentUser, token]); // Dependencias para volver a ejecutar si el usuario o el token cambian

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.postCard}>
          <Text style={styles.postUser}>{item.user_name}</Text>
          <Text style={styles.postBar}>{item.bar_name}</Text>
          <Text style={styles.postContent}>{item.content}</Text>
          <Text style={styles.postDate}>{new Date(item.created_at).toLocaleString()}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postCard: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  postUser: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postBar: {
    fontSize: 14,
    color: 'gray',
  },
  postContent: {
    marginTop: 5,
    fontSize: 16,
  },
  postDate: {
    marginTop: 5,
    fontSize: 12,
    color: 'gray',
  },
});

export default Feed;
