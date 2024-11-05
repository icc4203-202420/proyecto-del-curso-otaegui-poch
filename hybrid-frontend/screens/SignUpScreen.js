import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    handle: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = () => {
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      Alert.alert('Error', errorMessage);
      return;
    }

    const { email, first_name, last_name, handle, password } = formData;

    fetch('http://192.168.1.100:3000/api/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {  // Aquí anidamos los parámetros dentro de "user"
            email,
            first_name,
            last_name,
            handle,
            password,
            password_confirmation: formData.confirmPassword
          }
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json(); // Si la respuesta es 201 o exitosa, continúa
          } else {
            return response.json().then((data) => {
              throw new Error(data.errors ? data.errors.join(', ') : 'Error en el registro');
            });
          }
        })
        .then((data) => {
          Alert.alert('Éxito', 'Registro exitoso');
          setTimeout(() => {
            navigation.replace('Home'); // Navegar a la pantalla de inicio
          }, 2000);
        })
        .catch((error) => {
          setErrorMessage(error.message);
          Alert.alert('Error', error.message);
        });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={formData.email}
        onChangeText={(value) => handleChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={formData.first_name}
        onChangeText={(value) => handleChange('first_name', value)}
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={formData.last_name}
        onChangeText={(value) => handleChange('last_name', value)}
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre de Usuario"
        value={formData.handle}
        onChangeText={(value) => handleChange('handle', value)}
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={formData.password}
        onChangeText={(value) => handleChange('password', value)}
        secureTextEntry
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        value={formData.confirmPassword}
        onChangeText={(value) => handleChange('confirmPassword', value)}
        secureTextEntry
        required
      />
      <Button title="Registrarse" onPress={handleSignUp} />
      <Button title="¿Ya tienes una cuenta? Iniciar Sesión" onPress={() => navigation.navigate('Login')} />
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
