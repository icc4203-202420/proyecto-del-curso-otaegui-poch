import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Paper, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [handle, setHandle] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate(); // Inicializa useNavigate

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage(null);  // Resetea el mensaje de error antes de intentar el registro

    try {
      const response = await axios.post('/api/v1/signup', {
        user: {
          email: email,
          first_name: firstName,
          last_name: lastName,
          handle: handle,
          password: password,
          password_confirmation: passwordConfirmation
        }
      });

      console.log('Usuario registrado con éxito:', response.data);
      
      if (response.status === 200) {
        navigate('/'); // Redirige al home si el registro es exitoso
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
          Sign Up
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>} {/* Mensaje de error */}
        <form onSubmit={handleSignUp}>
          <TextField
            label="First Name"
            fullWidth
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <TextField
            label="Handle"
            fullWidth
            margin="normal"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            required
          />
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
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default SignUp;
