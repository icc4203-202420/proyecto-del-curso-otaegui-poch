import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Grid, Paper, Button, Collapse, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/system';

// Estilos personalizados
const StyledContainer = styled(Container)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(4),
}));

// Función para formatear la fecha
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', options); // Formato en español
};

const BarDetail = () => {
  const { id } = useParams();
  const [bar, setBar] = useState(null);
  const [beers, setBeers] = useState([]);
  const [showBeers, setShowBeers] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBarDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/bars/${id}`);
        setBar(response.data.bar);
        setBeers(response.data.beers);
      } catch (error) {
        console.error('Error: ', error);
        setError('Error fetching bar details');
      }
    };

    fetchBarDetail();
  }, [id]);

  // Función para manejar el check-in
  const handleCheckIn = async (eventId) => {
    try {
      await axios.post(`http://localhost:3001/api/v1/events/${eventId}/check_in`);
      alert('Check-in realizado con éxito');
    } catch (error) {
      console.error('Error al hacer check-in:', error);
      setError('Error al realizar el check-in');
    }
  };

  if (error) return <Typography variant="h6" color="error">{error}</Typography>;
  if (!bar) return <Typography variant="h6">Loading...</Typography>;

  return (
    <StyledContainer>
      <Typography variant="h2" gutterBottom>
        {bar.name}
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom>
        {bar.address.line1}, {bar.address.line2}, {bar.address.city}
      </Typography>
      
      <Typography variant="h4" gutterBottom>
        Próximos Eventos en {bar.name}
      </Typography>

      {/* Tabla de eventos */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nombre del Evento</strong></TableCell>
              <TableCell><strong>Fecha</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bar.events && bar.events.length > 0 ? (
              bar.events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{formatDate(event.date) || 'Fecha no disponible'}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleCheckIn(event.id)}
                    >
                      Check In
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">No hay eventos programados</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => setShowBeers(!showBeers)}
        style={{ marginTop: '20px' }}
      >
        {showBeers ? 'Ocultar Cervezas' : 'Ver Cervezas'}
      </Button>

      <Collapse in={showBeers}>
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h5">Cervezas:</Typography>
          <ul>
            {beers.length > 0 ? (
              beers.map((beer) => (
                <li key={beer.id}>
                  {beer.name} - {beer.beer_type || 'Unknown type'}
                </li>
              ))
            ) : (
              <li>No hay cervezas disponibles</li>
            )}
          </ul>
        </Paper>
      </Collapse>
    </StyledContainer>
  );
};

export default BarDetail;
