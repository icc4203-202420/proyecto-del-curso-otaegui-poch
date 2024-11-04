import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, TextField, MenuItem, Container } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserDetail = () => {
  const { id } = useParams(); // Obtener el ID del usuario de los parámetros de la URL
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [error, setError] = useState(null); // Estado para manejar errores

  // Obtener los detalles del usuario al montar el componente
  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/users/${id}`); // Llamada a la API para obtener el usuario
        setUser(response.data); // Guardar los detalles del usuario en el estado
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Error fetching user details'); // Manejar errores
      }
    };

    fetchUserDetail();
  }, [id]);

  // Obtener la lista de eventos al montar el componente
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/events');
        setEvents(response.data); // Guardar eventos en el estado
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleAddFriend = async (friendId) => {
    try {
      const token = localStorage.getItem('authToken'); // Obtener el token de autenticación
      const currentUser = JSON.parse(localStorage.getItem('current_user')); // Obtener el objeto de usuario
      const userId = currentUser ? currentUser.id : null; // Acceder al ID del usuario

      if (!userId || !friendId) {
        console.error('IDs faltantes: userId o friendId');
        return;
      }

      const response = await axios.post(
        `http://localhost:3001/api/v1/users/${friendId}/friendships`,
        { user_id: userId }, // Enviar el userId en el cuerpo de la solicitud
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Enviar el token si es necesario
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Amigo agregado:', response.data); // Registro de éxito
      alert('Amigo agregado exitosamente');
    } catch (error) {
      console.error('Error al agregar amigo:', error);
      setError('Error al agregar amigo'); // Manejar errores
    }
  };

  // Renderizar un mensaje de error si hay uno
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  // Si no hay usuario, mostrar un mensaje de carga o un estado vacío
  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container style={{ padding: '20px' }}>
      <Card>
        <CardContent>
          <Typography variant="h4">
            {user.first_name} {user.last_name}
          </Typography>
          <Typography variant="h6">
            Handle: {user.handle}
          </Typography>
          <Typography variant="body1">
            Email: {user.email}
          </Typography>
          <Typography variant="body1">
            Age: {user.age}
          </Typography>
          <Typography variant="body1">
            ID: {user.id}
          </Typography>

          {/* Selector de evento */}
          <TextField
            select
            label="Event where you met"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          >
            {events.map((event) => (
              <MenuItem key={event.id} value={event.id}>
                {event.name} - {event.date}
              </MenuItem>
            ))}
          </TextField>

          {/* Botón "Add Friend" */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAddFriend(user.id)}
            style={{ marginTop: '16px' }}
            disabled={!selectedEvent} // Deshabilitar si no se selecciona un evento
          >
            Add Friend
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserDetail;
