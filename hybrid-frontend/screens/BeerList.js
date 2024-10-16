import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import BeerCard from './BeerCard'; // Asegúrate de que este componente exista

const BeerList = () => {
  const [beers, setBeers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const response = await axios.get('http://192.168.1.100:3000/api/v1/beers');
        console.log('API Response:', response.data); // Verificar la respuesta del API
        setBeers(response.data.beers);
      } catch (error) {
        console.error('Error fetching beers:', error.message); // Muestra solo el mensaje de error
        Alert.alert('Error', error.message || 'No se pudieron cargar las cervezas.');
      }
    };
    fetchBeers();
  }, []);

  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(search.toLowerCase())
  );

  console.log('Beers:', beers); // Verificar el estado de beers
  console.log('Filtered Beers:', filteredBeers); // Verificar el estado de filteredBeers

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar cervezas"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredBeers}
        renderItem={({ item }) => <BeerCard beer={item} />}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
});

export default BeerList;