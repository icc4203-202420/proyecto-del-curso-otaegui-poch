import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, TextField, MenuItem, Container } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isFriend, setIsFriend] = useState(false); // Nuevo estado para verificar si ya son amigos
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Error fetching user details');
      }
    };

    fetchUserDetail();
  }, [id]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  // Nueva función para verificar si ya son amigos
  useEffect(() => {
    const checkFriendship = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const currentUser = JSON.parse(localStorage.getItem('current_user'));
        const userId = currentUser ? currentUser.id : null;

        if (!userId || !id) return;

        const response = await axios.get(`http://localhost:3001/api/v1/users/${userId}/friendships`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const isFriend = response.data.some(friend => friend.id === parseInt(id));
        setIsFriend(isFriend);
      } catch (error) {
        console.error('Error checking friendship status:', error);
      }
    };

    checkFriendship();
  }, [id]);

  const handleAddFriend = async (friendId) => {
    try {
      const token = localStorage.getItem('authToken');
      const currentUser = JSON.parse(localStorage.getItem('current_user'));
      const userId = currentUser ? currentUser.id : null;

      if (!userId || !friendId) {
        console.error('IDs faltantes: userId o friendId');
        return;
      }

      const response = await axios.post(
        `http://localhost:3001/api/v1/users/${friendId}/friendships`,
        { user_id: userId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Amigo agregado:', response.data);
      setIsFriend(true); // Cambia el estado a amigo después de agregar
      alert('Amigo agregado exitosamente');
    } catch (error) {
      console.error('Error al agregar amigo:', error);
      setError('Error al agregar amigo');
    }
  };

  // Nueva función para manejar la eliminación de amigo
  const handleRemoveFriend = async (friendId) => {
    try {
      const token = localStorage.getItem('authToken');
      const currentUser = JSON.parse(localStorage.getItem('current_user'));
      const userId = currentUser ? currentUser.id : null;

      if (!userId || !friendId) {
        console.error('IDs faltantes: userId o friendId');
        return;
      }

      const response = await axios.delete(
        `http://localhost:3001/api/v1/users/${friendId}/friendships`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          data: { user_id: userId },
        }
      );

      console.log('Amigo eliminado:', response.data);
      setIsFriend(false); // Cambia el estado a no amigo después de eliminar
      alert('Amigo eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar amigo:', error);
      setError('Error al eliminar amigo');
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

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

          {/* Botón que cambia entre "Agregar" y "Eliminar" amigo */}
          <Button
            variant="contained"
            color={isFriend ? "secondary" : "primary"}
            onClick={() => isFriend ? handleRemoveFriend(user.id) : handleAddFriend(user.id)}
            style={{ marginTop: '16px' }}
            disabled={!selectedEvent}
          >
            {isFriend ? "Remove Friend" : "Add Friend"}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserDetail;
