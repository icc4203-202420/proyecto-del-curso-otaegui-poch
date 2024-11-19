import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const EventDetail = ({ route }) => {
  const { event } = route.params;
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');
  const [friends, setFriends] = useState([]);
  const [taggedFriends, setTaggedFriends] = useState([]);
  const [searchHandle, setSearchHandle] = useState('');
  const [showFriendsList, setShowFriendsList] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Función para obtener la lista de amigos desde el backend
    const fetchFriends = async () => {
      try {
        const currentUser = await AsyncStorage.getItem('current_user');
        const parsedUser = JSON.parse(currentUser);
        console.log(parsedUser)
        const response = await fetch(`http://192.168.1.101:3000/api/v1/users/${parsedUser.id}/friendships`);
        const data = await response.json();
        console.log(data)
        
        if (response.ok) {
          setFriends(data);
          setFilteredFriends(data);
        } else {
          Alert.alert('Error', 'No se pudieron cargar los amigos.');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo conectar con el servidor.');
      }
    };

    fetchFriends();
  }, []);

  // Filtrar amigos según lo que se escribe en el campo de búsqueda
  const filteredFriends = searchHandle === ''
    ? []
    : friends.filter(friend => friend.handle.toLowerCase().includes(searchHandle.toLowerCase()));


  // Función para elegir la imagen del dispositivo
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere permiso para acceder a la galería de fotos.');
      return;
    }

    let response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!response.canceled && response.assets && response.assets.length > 0) {
      const uri = response.assets[0].uri;
      setSelectedImage(uri);
    }
  };

  // Función para subir la imagen al servidor
  const handleUploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Primero selecciona una imagen.');
      return;
    }

    const currentUser = await AsyncStorage.getItem('current_user');
    const parsedUser = JSON.parse(currentUser);
    const userId = parsedUser.id;

    const formData = new FormData();
    formData.append('image', {
      uri: selectedImage,
      name: 'event_picture.jpg',
      type: 'image/jpeg',
    });
    formData.append('description', description);
    formData.append('user_id', userId);
    formData.append('tagged_user_ids', JSON.stringify(taggedFriends)); // Enviar IDs de los amigos etiquetados

    try {
      const response = await fetch(`http://192.168.1.101:3000/api/v1/events/${event.id}/upload_picture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', data.success || 'Imagen subida exitosamente.');
        setSelectedImage(null);
        setDescription('');
        setTaggedFriends([]);
      } else {
        Alert.alert('Error', data.error || 'Error al subir la imagen.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
    }
  };

  // Función para el Check-In
  const handleCheckIn = async () => {
    try {
      const response = await fetch(`http://192.168.1.101:3000/api/v1/events/${event.id}/check_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${yourJwtToken}`, // Reemplaza con el token de autenticación JWT del usuario
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Check In", data.message || "Check-in realizado exitosamente.");
      } else {
        Alert.alert("Error", data.errors ? data.errors.join(", ") : "Error al realizar el check-in.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.");
    }
  };

  const viewImagesBottom = () => {
    // Navegamos a la pantalla de imágenes del evento con el evento seleccionado
    navigation.navigate('EventImages', { event });
  };

  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.date}>Fecha: {new Date(event.date).toLocaleDateString()}</Text>
      <Button title="Check In" onPress={handleCheckIn} color="#007AFF" />

      <View style={styles.imageUploadContainer}>
        <TouchableOpacity onPress={handlePickImage} style={styles.pickImageButton}>
          <FontAwesome name="paperclip" size={24} color="#007AFF" />
          <Text style={styles.pickImageText}>Añadir Imagen</Text>
        </TouchableOpacity>

        {selectedImage && (
          <View style={styles.formContainer}>
            <Image source={{ uri: selectedImage }} style={styles.image} />
            <TextInput
              style={styles.input}
              placeholder="Descripción de la imagen"
              value={description}
              onChangeText={(text) => setDescription(text)}
            />

            <Text style={styles.subTitle}>Etiquetar Amigos:</Text>
            <TextInput
              style={styles.input}
              placeholder="Buscar amigos por handle"
              value={searchHandle}
              onFocus={() => setShowFriendsList(true)}
              onChangeText={(text) => setSearchHandle(text)}
            />

            {showFriendsList && filteredFriends.length > 0 && (
              <View style={styles.friendsListContainer}>
                {filteredFriends.map((friend) => (
                  <TouchableOpacity
                    key={friend.id}
                    style={styles.friendItem}
                    onPress={() => {
                      if (!taggedFriends.includes(friend.id)) {
                        setTaggedFriends([...taggedFriends, friend.id]);
                      }
                      setSearchHandle('');
                      setShowFriendsList(false); // Ocultar la lista después de seleccionar un amigo
                    }}
                  >
                    <Text>{friend.handle}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Button title="Subir Imagen" onPress={handleUploadImage} color="#007AFF" />
          </View>
        )}
      </View>

      <View style={styles.container}>
        <Button title="Ver Imágenes del Evento" onPress={viewImagesBottom} color="#007AFF" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  imageUploadContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  pickImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#e6e6e6',
    marginBottom: 20,
  },
  pickImageText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#007AFF',
  },
  formContainer: {
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '90%',
    padding: 10,
    marginVertical: 10,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 10,
  },
  friendsListContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    maxHeight: 150,
    marginBottom: 10,
  },
  friendItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default EventDetail;
