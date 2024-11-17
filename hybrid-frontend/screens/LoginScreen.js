import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    fetch('http://192.168.1.101:3000/api/v1/login', {
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
        const user = data.status?.data?.user;
        
        if (success && token) {
          // Guardar el token (usando AsyncStorage o SecureStore)
          const storeToken = async (token) => {
            await AsyncStorage.setItem('authToken', token);
          
            // Espera a que se haya almacenado el valor
            const storedToken = await AsyncStorage.getItem('authToken');
          };
          
          storeToken(token);

          AsyncStorage.setItem('current_user', JSON.stringify({
            email: user.email,
            first_name: user.first_name,
            id: user.id,
            last_name: user.last_name
          })); 
          
          Alert.alert('Éxito', 'Inicio de sesión exitoso');
          setTimeout(() => {
            navigation.replace('Home'); // Navegar a la pantalla Home
          }, 2000); // Espera 2 segundos antes de navegar
        } else {
          setErrorMessage(data.status?.message || 'Error en el inicio de sesión');
          Alert.alert('Error muy feo', data.status?.message || 'Error en el inicio de sesión');
        }
      })
      .catch((error) => {
        setErrorMessage(error.message || 'Ocurrió un error durante el inicio de sesión');
        Alert.alert('Error hola', error.message || 'Ocurrió un error durante el inicio de sesión');
        console.log(error.message)
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
      <Button title="¿No tienes una cuenta? Regístrate" onPress={() => navigation.navigate('SignUp')} />
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
