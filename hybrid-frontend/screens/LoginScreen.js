import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        navigation.replace('Home'); // Navegar a Home si el token existe
      } else {
        setLoading(false); // Mostrar la pantalla de login si no hay token
      }
    };

    checkToken();
  }, []);

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
      .then(async (data) => {
        const statusCode = data.status?.code || 0;
        const success = statusCode === 200;
        const token = data.status?.data?.token;

        if (success && token) {
          await SecureStore.setItemAsync('authToken', token); // Guardar token en SecureStore
          Alert.alert('Éxito', 'Inicio de sesión exitoso');
          navigation.replace('Home'); // Navegar a Home inmediatamente
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
      <Button title="¿No tienes una cuenta? Regístrate" onPress={goToSignup} />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});
