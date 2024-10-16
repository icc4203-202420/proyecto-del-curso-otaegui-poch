import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const BeerCard = ({ beer }) => {
  return (
    <View style={styles.card}>
      <Image
        style={styles.image}
        source={{ uri: beer.image_url || 'https://via.placeholder.com/100' }} // Placeholder si no hay imagen
      />
      <View style={styles.info}>
        <Text style={styles.name}>{beer.name}</Text>
        <Text style={styles.manufacturer}>{beer.manufacturer}</Text>
        <Text style={styles.description}>{beer.description}</Text>
      </View>
    </View>
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
  manufacturer: {
    fontSize: 14,
    color: 'gray',
  },
  description: {
    fontSize: 12,
    color: 'gray',
  },
});

export default BeerCard;
