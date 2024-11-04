// UserCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserCard = ({ user }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        // Navegamos a la pantalla de detalles con el usuario seleccionado
        navigation.navigate('UserDetails', { user });
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={styles.card}>
                <Image
                    style={styles.image}
                    source={{ uri: user.image_url || 'https://via.placeholder.com/100' }} // Cambia esto si tienes una imagen específica
                />
                <View style={styles.info}>
                    <Text style={styles.handle}>{user.handle}</Text>
                    <Text style={styles.name}>{user.first_name}</Text>
                    
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 16,
    },
    info: {
        flex: 1,
    },
    handle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 14,
        color: 'gray',
    },
    bio: {
        fontSize: 12,
        color: 'gray',
    },
});

export default UserCard;
