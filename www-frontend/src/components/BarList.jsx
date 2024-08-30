import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, List, ListItem } from '@mui/material';
import axios from 'axios';

const BarList = () => {
  const [bars, setBars] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBars = async () => {
      try {
        const response = await axios.get('/api/v1/bars');
        setBars(response.data);
      } catch (error) {
        console.error("Error fetching bars:", error);
      }
    };
    fetchBars();
  }, []);

  return (
    <Container>
      <Typography variant="h2" gutterBottom>Listado de Bares</Typography>
      <TextField
        label="Buscar bares"
        variant="outlined"
        fullWidth
        onChange={(e) => setSearch(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <List>
        {bars.filter(bar => bar.name.toLowerCase().includes(search.toLowerCase())).map(bar => (
          <ListItem key={bar.id}>{bar.name}</ListItem>
        ))}
      </List>
    </Container>
  );
};

export default BarList;
