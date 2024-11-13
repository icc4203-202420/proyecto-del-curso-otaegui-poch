import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';

export default function EventDetail({ route }) {
  const { event } = route.params;

  const handleCheckIn = async () => {
    try {
      const response = await fetch(`http://192.168.1.100:3000/api/v1/events/${event.id}/check_in`, {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.date}>Fecha: {new Date(event.date).toLocaleDateString()}</Text>
      <Button title="Check In" onPress={handleCheckIn} color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
