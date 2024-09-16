import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, List, ListItem } from '@mui/material';
import axios from 'axios';
import { BarCard } from './BarCard';

const BarList = () => {
  const [bars, setBars] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/v1/bars')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBars(data);
        } else {
          setError('La respuesta de la API no tiene el formato esperado');
          console.log('Respuesta de la API:', data);
        }
      })
      .catch(error => {
        setError('Error al cargar los bares');
        console.error('Error:', error);
      });
  }, []);

  const filteredBars = bars.filter(bar =>
    bar.name.toLowerCase().includes(search.toLowerCase())
  );

  console.log('Bares filtrados:', filteredBars); // Verifica los bares filtrados


  return (
    <Container>
      <Typography variant="h2" gutterBottom>Listado de Bares</Typography>
      <TextField
        label="Buscar Bares"
        variant="outlined"
        fullWidth
        onChange={(e) => setSearch(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      
      <List>
        {filteredBars.map(bar => (
          <BarCard key={bar.id} bar = {bar} />
        ))}
      </List>
    </Container>
  );
};

export default BarList;
