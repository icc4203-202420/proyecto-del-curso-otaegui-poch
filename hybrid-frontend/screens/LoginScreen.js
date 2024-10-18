import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    fetch('http://192.168.1.100:3000/api/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la autenticación');
        }
        return response.json();
      })
      .then((data) => {
        const statusCode = data.status?.code || 0;
        const success = statusCode === 200;
        const token = data.status?.data?.token;

        if (success && token) {
          // Guardar el token (usando AsyncStorage o SecureStore)
          // AsyncStorage.setItem('authToken', token); // Opción básica para almacenamiento
          
          Alert.alert('Éxito', 'Inicio de sesión exitoso');
          setTimeout(() => {
            navigation.replace('Home'); // Navegar a la pantalla Home
          }, 2000); // Espera 2 segundos antes de navegar
        } else {
          setErrorMessage(data.status?.message || 'Error en el inicio de sesión');
          throw new Error('No se recibió token de autenticación');
        }
      })
      .catch((error) => {
        setErrorMessage(error.message || 'Ocurrió un error durante el inicio de sesión');
        Alert.alert('Error', errorMessage);
      });
  };

  const goToSignup = () => {
    navigation.replace('Signup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        required
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
      <Button title="¿No tienes una cuenta? Regístrate" onPress={goToSignup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});
