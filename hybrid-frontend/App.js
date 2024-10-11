import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';

export default function App() {
  // Estados para el formulario de registro
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    handle: '',
    password: '',
    password_confirmation: '',
    age: '',
  });

  const handleRegister = async () => {
    console.log("Iniciando el registro...");
    
    if (password !== confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
    }

    try {
        console.log("Enviando datos...");
        const response = await fetch('http://192.168.0.24:3001/api/v1/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: {
                    first_name: firstName,
                    last_name: lastName,
                    age: age,
                    email: email,
                    password: password,
                    password_confirmation: confirmPassword,
                    handle: handle
                },
            }),
        });

        console.log("Respuesta del servidor:", response);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors ? errorData.errors.join(', ') : 'Error desconocido');
        }

        const data = await response.json();
        Alert.alert('Éxito', 'Usuario registrado exitosamente');

    } catch (error) {
        console.error('Error en el registro:', error);
        Alert.alert('Error', error.message || 'Hubo un problema con el registro. Inténtalo más tarde.');
    }
};



  // Manejar cambios en los campos de entrada
  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={formData.first_name}
        onChangeText={(value) => handleChange('first_name', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={formData.last_name}
        onChangeText={(value) => handleChange('last_name', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={formData.age}
        onChangeText={(value) => handleChange('age', value)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Handle"
        value={formData.handle}
        onChangeText={(value) => handleChange('handle', value)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(value) => handleChange('email', value)}
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={formData.password}
        onChangeText={(value) => handleChange('password', value)}
        secureTextEntry
      />
      
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        value={formData.password_confirmation}
        onChangeText={(value) => handleChange('password_confirmation', value)}
        secureTextEntry
      />

      <Button title="Registrarse" onPress={handleRegister} />
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});
