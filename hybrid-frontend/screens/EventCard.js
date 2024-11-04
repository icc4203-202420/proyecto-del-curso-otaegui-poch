// EventCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EventCard = ({ event }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        // Navegamos a la pantalla de detalles con el evento seleccionado
        navigation.navigate('EventDetails', { event });
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={styles.card}>
                <Image
                    style={styles.image}
                    source={{ uri: event.image_url || 'https://via.placeholder.com/100' }} // Cambia esto si tienes una imagen específica
                />
                <View style={styles.info}>
                    <Text style={styles.name}>{event.name}</Text>
                    <Text style={styles.date}>{event.date}</Text>
                    <Text style={styles.description}>{event.description}</Text>
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
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 14,
        color: 'gray',
    },
    description: {
        fontSize: 12,
        color: 'gray',
    },
});

export default EventCard;
