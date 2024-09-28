import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography } from '@material-ui/core';
import UserCard from './UserCard'; // Asegúrate de que la ruta sea correcta
import UserDetail from './UserDetail'; // Asegúrate de que la ruta sea correcta

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/v1/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Error fetching users, check console for details.'); // Muestra un alert si hay error
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.handle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewUser = (userId) => {
    const user = users.find(user => user.id === userId);
    setSelectedUser(user);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      {selectedUser ? (
        <UserDetail user={selectedUser} />
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            User List
          </Typography>

          <input
            type="text"
            placeholder="Search by handle"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              marginBottom: '20px',
              padding: '8px',
              width: '100%',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />

          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <UserCard key={user.id} user={user} handleViewUser={handleViewUser} />
            ))
          ) : (
            <Typography variant="body1">No users found.</Typography>
          )}
        </>
      )}
    </Container>
  );
};

export default UserList;