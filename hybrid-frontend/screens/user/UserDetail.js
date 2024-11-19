import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';

export default function UserDetail({ route }) {
  const { user } = route.params;

  const handleSendMessage = async () => {
    try {
      const response = await fetch(`http://192.168.1.13:3000/api/v1/users/${user.id}/send_message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${yourJwtToken}`, // Reemplaza con el token de autenticación JWT del usuario
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Mensaje Enviado", data.message || "Mensaje enviado exitosamente.");
      } else {
        Alert.alert("Error", data.errors ? data.errors.join(", ") : "Error al enviar el mensaje.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{user.name}</Text>
      <Text style={styles.email}>Correo: {user.email}</Text>
      <Text style={styles.date}>Registrado el: {new Date(user.created_at).toLocaleDateString()}</Text>
      <Button title="Send Message" onPress={handleSendMessage} color="#007AFF" />
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
  email: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
  date: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
    marginBottom: 20,
  },
});
