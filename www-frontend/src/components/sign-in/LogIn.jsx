import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Paper, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(null);  // Resetea el mensaje de error antes de intentar el inicio de sesión

    try {
      const response = await axios.post('/api/v1/login', {
        user: {
          email: email,
          password: password
        }
      });

      console.log('Usuario autenticado con éxito:', response.data);
      
      if (response.status === 200) {
        navigate('/'); // Redirige al home si el inicio de sesión es exitoso
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrorMessage(error.response.data.errors.join(', '));  // Muestra los errores del backend
      } else {
        setErrorMessage('Error desconocido.');  // Mensaje genérico de error
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Log In
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>} {/* Mensaje de error */}
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Log In
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
