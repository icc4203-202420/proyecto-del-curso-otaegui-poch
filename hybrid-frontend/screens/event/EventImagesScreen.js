import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, Alert, TouchableOpacity, Modal, Button, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const EventImagesScreen = ({ route }) => {
  const { event } = route.params;
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigation = useNavigation();

  // Obtener el usuario actual una vez al montar
  useFocusEffect(
    React.useCallback(() => {
      const fetchCurrentUser = async () => {
        try {
          const currentUser = await AsyncStorage.getItem('current_user');
          const parsedUser = JSON.parse(currentUser);
          setCurrentUserId(parsedUser.id);
        } catch (error) {
          console.error('Error al obtener el ID del usuario actual:', error);
        }
      };

      const fetchEventImages = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://192.168.1.13:3000/api/v1/events/${event.id}/pictures`);
          const data = await response.json();

          if (response.ok) {
            setImages(data);
          } else {
            Alert.alert("Error", "No se pudieron cargar las imágenes del evento.");
          }
        } catch (error) {
          Alert.alert("Error", "No se pudo conectar con el servidor.");
        } finally {
          setLoading(false);
        }
      };

      fetchCurrentUser();
      fetchEventImages();
    }, [event.id])
  );

  const handleDeleteImage = async (imageId) => {
    try {
      const response = await fetch(`http://192.168.1.13:3000/api/v1/events/${event.id}/pictures/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: currentUserId }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', data.success || 'Imagen eliminada exitosamente.');
        setImages(images.filter((img) => img.id !== imageId));
      } else {
        Alert.alert('Error', data.error || 'No se pudo eliminar la imagen.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
    }
  };

  const handleImagePress = (img) => {
    setSelectedImage(img);
    setModalVisible(true);
  };

  const handleUserPress = (user) => {
    navigation.navigate('UserDetails', { user });
  };

  const renderImageItem = ({ item, index }) => (
    <View style={styles.imageItemContainer} key={index}>
      <TouchableOpacity onPress={() => handleImagePress(item)}>
        <Image source={{ uri: item.pictures_url[0] }} style={styles.imageThumbnail} />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Imágenes de {event.name}</Text>
      {images.length === 0 ? (
        <Text style={styles.noImagesText}>No hay imágenes disponibles para este evento.</Text>
      ) : (
        <FlatList
          data={images}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.imageList}
        />
      )}

      {selectedImage && (
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={{ uri: selectedImage.pictures_url[0] }} style={styles.modalImage} />
              <Text style={styles.description}>{selectedImage.description}</Text>

              {selectedImage.users_tagged && selectedImage.users_tagged.length > 0 ? (
                <View style={styles.taggedUsersContainer}>
                  <Text style={styles.taggedTitle}>Usuarios Etiquetados:</Text>
                  {selectedImage.users_tagged.map((user, index) => (
                    <TouchableOpacity 
                      key={index}
                      onPress={() => handleUserPress(user)} 
                      style={styles.taggedUser}
                    >
                      <Text style={styles.taggedUserName}>{user.handle || `Usuario ${user.id}`}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.noTaggedUsersText}>No hay usuarios etiquetados.</Text>
              )}

              {selectedImage.user_id === currentUserId && (
                <TouchableOpacity onPress={() => handleDeleteImage(selectedImage.id)} style={styles.deleteButtonModal}>
                  <FontAwesome name="trash" size={24} color="red" />
                </TouchableOpacity>
              )}
              <Button title="Cerrar" onPress={() => setModalVisible(false)} />
            </View>
          </ScrollView>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  noImagesText: {
    fontSize: 18,
    color: '#666',
  },
  imageList: {
    alignItems: 'center',
  },
  imageItemContainer: {
    position: 'relative',
    margin: 5,
  },
  imageThumbnail: {
    width: 150,
    height: 100,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalImage: {
    width: 300,
    height: 300,
    borderRadius: 8,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  taggedUsersContainer: {
    marginVertical: 10,
    width: '100%',
  },
  taggedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#007AFF',
  },
  taggedUser: {
    marginBottom: 5,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 5,
    width: '100%',
  },
  taggedUserName: {
    fontSize: 16,
    color: '#005f99',
  },
  noTaggedUsersText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  deleteButtonModal: {
    marginTop: 10,
    alignItems: 'center',
  },
});

export default EventImagesScreen;
