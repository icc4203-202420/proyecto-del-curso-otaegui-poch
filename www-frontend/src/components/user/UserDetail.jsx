import React from 'react';
import { Card, CardContent, Typography, Button } from '@material-ui/core';
import axios from 'axios';

const UserDetail = ({ user }) => {
  const handleAddFriend = async () => {
    try {
      // Asumimos que la variable 'barId' tiene un valor definido que necesitas pasar
      const barId = 1; // Cambia esto según sea necesario
      
      const response = await axios.post(`/api/v1/users/${user.id}/friendships`, { friend_id: user.id, bar_id: barId });

      if (response.status === 201) {
        console.log(`${user.first_name} ${user.last_name} has been added as a friend.`);
        // Aquí podrías mostrar un mensaje de éxito o actualizar el estado si es necesario
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  return (
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
        
        {/* Botón "Add Friend" */}
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddFriend} 
          style={{ marginTop: '16px' }}
        >
          Add Friend
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserDetail;