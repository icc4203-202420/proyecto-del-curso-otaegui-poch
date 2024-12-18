import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserCard = ({ user }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isFriend, setIsFriend] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await AsyncStorage.getItem('current_user');
                setCurrentUser(JSON.parse(user)); // Esto es correcto porque el usuario está en formato JSON

                // Verifica si el usuario actual es amigo de este usuario
                if (user && user.friends && user.friends.some(friend => friend.id === user.id)) {
                    setIsFriend(true);
                }
            } catch (err) {
                console.error('Error al obtener datos de usuario', err);
            }
        };
        fetchUserData();
    }, [user]); // Dependencia en `user` para asegurarse de verificar la amistad cada vez que cambie

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

    const handleUnfriend = async () => {
        if (!currentUser) {
            Alert.alert("Error", "No se pudo obtener los datos del usuario actual.");
            return;
        }
    
        try {
            const authToken = await AsyncStorage.getItem('authToken'); // Obtener el token almacenado
            const url = `http://192.168.1.101:3000/api/v1/users/${user.id}/destroy_friendship?friend_id=${currentUser.id}`;
    
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`, // Agregar el token a la cabecera
                }
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setIsFriend(false);
                Alert.alert("Éxito", "Amistad eliminada");
            } else {
                Alert.alert("Error", data.error || "No se pudo eliminar la amistad");
            }
        } catch (error) {
            console.error('Error removing friend:', error);
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

                {currentUser && currentUser.id !== user.id && isFriend && (
                    <TouchableOpacity 
                        style={[styles.button, styles.unfriendButton]} 
                        onPress={handleUnfriend}
                    >
                        <Text style={styles.buttonText}>Eliminar Amigo</Text>
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
    unfriendButton: {
        backgroundColor: '#dc3545',
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
