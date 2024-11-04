import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList } from 'react-native';
import axios from 'axios';
import EventCard from './EventCard'; // Asegúrate de importar tu componente EventCard

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://192.168.1.100:3000/api/v1/events');
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    // Filtrar eventos según el texto de búsqueda
    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View>
            {/* Campo de búsqueda */}
            <TextInput
                placeholder="Buscar por nombre"
                value={searchText}
                onChangeText={setSearchText}
                style={{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    margin: 10,
                    paddingHorizontal: 10,
                }}
            />
            <FlatList
                data={filteredEvents} // Usa los eventos filtrados
                renderItem={({ item }) => <EventCard event={item} />} // Usa EventCard aquí
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
};

export default EventList;
