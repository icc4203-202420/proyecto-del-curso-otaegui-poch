import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, List, ListItem } from '@mui/material';
import axios from 'axios';
import { BeerCard } from './BeerCard';

const BeerList = () => {
  const [beers, setBeers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/beers');
        console.log('entro')
        console.log('jjajjajaja', response)
        setBeers(response.data.beers);
      } catch (error) {
        console.log('error', error)
        console.error("Error fetching beers:", error);
      }
    };
    fetchBeers();
  }, []);

  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h2" gutterBottom>Listado de Cervezas</Typography>
      <TextField
        label="Buscar cervezas"
        variant="outlined"
        fullWidth
        onChange={(e) => setSearch(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      
      <List>
        {filteredBeers.map(beer => (
          <BeerCard key={beer.key} beer = {beer} />
        ))}
      </List>
    </Container>
  );
};

export default BeerList;
