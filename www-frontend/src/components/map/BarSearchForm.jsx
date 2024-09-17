import React, { useState, useEffect } from 'react';
import { Grid, Typography, TextField, Button, Paper } from '@mui/material';
import MapComponent from '../map/MapComponent';

const BarSearchForm = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bars, setBars] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/v1/bars')
      .then(response => response.json())
      .then(data => {
        setBars(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    // Actualiza el estado de la búsqueda
  };

  return (
    <Grid container direction="column" style={{ height: '100vh' }}>
      <Paper elevation={3} style={{ padding: 20, margin: '20px auto', width: '90%', maxWidth: '600px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Buscar Bar
        </Typography>
        <form onSubmit={handleSearch}>
          <TextField
            label="Nombre del Bar"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
            Buscar
          </Button>
        </form>
      </Paper>
      <MapComponent bars={bars} searchQuery={searchQuery} />
    </Grid>
  );
};

export default BarSearchForm;
