import React, { useState, useEffect } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');  // Estado para almacenar el término de búsqueda
  const [loading, setLoading] = useState(true);

  // Obtener los usuarios del backend
  useEffect(() => {
    fetch('/api/v1/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  // Filtrar los usuarios según el término de búsqueda por `handle`
  const filteredUsers = users.filter(user =>
    user.handle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {/* Campo de búsqueda */}
      <input
        type="text"
        placeholder="Search by handle"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginBottom: '10px',
          padding: '8px',
          width: '100%',
          fontSize: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      
      {/* Mostrar mensaje si no hay usuarios */}
      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {filteredUsers.map(user => (
            <li key={user.id}>
              {user.handle} - {user.first_name} {user.last_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
