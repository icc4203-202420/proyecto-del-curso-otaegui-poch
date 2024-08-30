import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, List, ListItem } from '@mui/material';
import axios from 'axios';

const BeerList = () => {
  const [beers, setBeers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const response = await axios.get('/api/v1/beers');
        setBeers(response.data);
      } catch (error) {
        console.error("Error fetching beers:", error);
      }
    };
    fetchBeers();
  }, []);

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
        {beers.filter(beer => beer.name.toLowerCase().includes(search.toLowerCase())).map(beer => (
          <ListItem key={beer.id}>{beer.name}</ListItem>
        ))}
      </List>
    </Container>
  );
};

export default BeerList;
