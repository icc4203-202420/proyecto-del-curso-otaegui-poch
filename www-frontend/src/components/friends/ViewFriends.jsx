import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography } from '@material-ui/core';
import UserCard from '../user/UserCard'; // Asegúrate de que la ruta sea correcta
import UserDetail from '../user/UserDetail'; // Asegúrate de que la ruta sea correcta

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const currentUser = JSON.parse(localStorage.getItem('current_user')); // Obtener el objeto de usuario
        const userId = currentUser ? currentUser.id : null; // Acceder al ID del usuario

        if (!userId) {
            console.error('IDs faltantes: userId ');
            return;
        }

        const response = await axios.get(`http://localhost:3001/api/v1/users/${userId}/friendships`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setFriends(response.data);  // Guarda la lista de amigos en el estado
      } catch (error) {
        console.error('Error fetching friends:', error);
        alert('Error fetching friends, check console for details.'); // Muestra un alert si hay error
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);  // El array vacío significa que esto se ejecutará una vez al montar el componente

  const handleViewFriend = (friendId) => {
    const friend = friends.find(friend => friend.id === friendId);
    setSelectedFriend(friend);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      {selectedFriend ? (
        <UserDetail user={selectedFriend} />
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Mis Amistades
          </Typography>

          {friends.length > 0 ? (
            friends.map(friend => (
              <UserCard key={friend.id} user={friend} handleViewUser={handleViewFriend} />
            ))
          ) : (
            <Typography variant="body1">No tienes amistades.</Typography>
          )}
        </>
      )}
    </Container>
  );
};

export default FriendList;
