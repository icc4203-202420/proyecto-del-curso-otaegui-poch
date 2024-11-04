import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList } from 'react-native';
import axios from 'axios';
import UserCard from './UserCard'; // Asegúrate de importar tu componente UserCard

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://192.168.1.100:3000/api/v1/users'); // Cambia la URL si es necesario
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    // Filtrar usuarios según el texto de búsqueda
    const filteredUsers = users.filter(user =>
        user.handle.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View>
            {/* Campo de búsqueda */}
            <TextInput
                placeholder="Buscar por handle"
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
                data={filteredUsers} // Usa los usuarios filtrados
                renderItem={({ item }) => <UserCard user={item} />} // Usa UserCard aquí
                keyExtractor={item => item.id.toString()} // Asegúrate de que 'id' es la clave correcta
            />
        </View>
    );
};

export default UserList;
