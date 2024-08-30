import React, { useState } from 'react';
import { Container, Typography, TextField } from '@mui/material';

const UserSearch = () => {
  const [handle, setHandle] = useState('');

  return (
    <Container>
      <Typography variant="h2" gutterBottom>Buscar Usuarios</Typography>
      <TextField
        label="Buscar por handle"
        variant="outlined"
        fullWidth
        onChange={(e) => setHandle(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
    </Container>
  );
};

export default UserSearch;
