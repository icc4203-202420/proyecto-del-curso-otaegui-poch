import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserCard = ({ user }) => {
    const [currentUser, setCurrentUser] = useState(null); // Agregar estado para el usuario actual
    const [isFriend, setIsFriend] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await AsyncStorage.getItem('current_user');
                const authToken = await AsyncStorage.getItem('authToken');
                setCurrentUser(JSON.parse(user)); // Esto es correcto porque el usuario está en formato JSON
                // Si necesitas el authToken puedes también guardarlo, pero no es necesario para esta parte
            } catch (err) {
                console.error('Error al obtener datos de usuario', err);
            }
        };
        fetchUserData();
    }, []);

    const handlePress = () => {
        console.log(user)
        navigation.navigate('UserDetails', { user });
    };

    const handleFriendship = async () => {
        if (!currentUser) {
            Alert.alert("Error", "No se pudo obtener los datos del usuario actual.");
            return;
        }

        try {
            const url = `http://192.168.1.101:3000/api/v1/users/${user.id}/create_friendship`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: currentUser.id,  // Usar el ID del currentUser
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                setIsFriend(true);
                Alert.alert("Éxito", "Usuario agregado como amigo");
            } else {
                Alert.alert("Error", data.error || "No se pudo agregar como amigo");
            }
        } catch (error) {
            console.error('Error adding friend:', error);
            Alert.alert("Error", "Error de conexión. Inténtalo de nuevo más tarde.");
        }
    };

    return (
        <View style={styles.card}>
            <Image
                style={styles.image}
                source={{ uri: user.image_url || 'https://via.placeholder.com/100' }}
            />
            <View style={styles.info}>
                <Text style={styles.handle}>{user.handle}</Text>
                <Text style={styles.name}>{user.first_name}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                {currentUser && currentUser.id !== user.id && (
                    <TouchableOpacity 
                        style={[styles.button, styles.friendButton, 
                            isFriend && styles.friendButtonActive]} 
                        onPress={handleFriendship}
                    >
                        <Text style={styles.buttonText}>
                            {isFriend ? '✓ Amigos' : '+ Agregar'}
                        </Text>
                    </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                    style={[styles.button, styles.detailsButton]} 
                    onPress={handlePress}
                >
                    <Text style={styles.buttonText}>Ver Perfil</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
    },
    info: {
        marginVertical: 8,
    },
    handle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    name: {
        fontSize: 14,
        color: 'gray',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        gap: 8,
    },
    button: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    friendButton: {
        backgroundColor: '#007bff',
    },
    friendButtonActive: {
        backgroundColor: '#28a745',
    },
    detailsButton: {
        backgroundColor: '#6c757d',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default UserCard;
