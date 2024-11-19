import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, Alert, TouchableOpacity, Modal, Button } from 'react-native';

const EventImagesScreen = ({ route }) => {
  const { event } = route.params; // Se obtiene el evento desde la navegación
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // Estado para la imagen seleccionada
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal

  useEffect(() => {
    // Función para obtener las imágenes del evento desde el servidor
    const fetchEventImages = async () => {
      try {
        const response = await fetch(`http://192.168.1.101:3000/api/v1/events/${event.id}/pictures`);
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

    fetchEventImages();
  }, [event.id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Función para manejar la selección de una imagen
  const handleImagePress = (img) => {
    setSelectedImage(img);
    setModalVisible(true);
  };

  // Renderizar cada elemento de la lista de imágenes
  const renderImageItem = ({ item, index }) => (
    <TouchableOpacity key={index} onPress={() => handleImagePress(item)}>
      <Image source={{ uri: item.pictures_url[0] }} style={styles.imageThumbnail} />
    </TouchableOpacity>
  );

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
          numColumns={2} // Mostrar las imágenes en 2 columnas
          contentContainerStyle={styles.imageList}
        />
      )}

      {/* Modal para mostrar la imagen ampliada */}
      {selectedImage && (
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={{ uri: selectedImage.pictures_url[0] }} style={styles.modalImage} />
              <Text style={styles.description}>{selectedImage.description}</Text>
              <Button title="Cerrar" onPress={() => setModalVisible(false)} />
            </View>
          </View>
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
  imageThumbnail: {
    width: 150,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
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
});

export default EventImagesScreen;
