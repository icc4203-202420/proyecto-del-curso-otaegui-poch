import React, { useState } from 'react';
import { TextField, Button, Grid, Snackbar, Alert, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('http://localhost:3000/api/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setOpenSuccess(true); // Mostrar snackbar de éxito
          setTimeout(() => {
            navigate('/home'); // Redirigir después de un tiempo
          }, 2000); // Espera 2 segundos antes de redirigir
        } else {
          setOpenError(true); // Mostrar snackbar de error
          setErrorMessage(data.message || 'Error en el inicio de sesión');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setOpenError(true);
        setErrorMessage('Ocurrió un error durante el inicio de sesión');
      });
  };

  const handleClose = () => {
    setOpenSuccess(false);
    setOpenError(false);
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={4}>
        <Box
          sx={{
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            textAlign: 'center',
            backgroundColor: 'white',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Iniciar Sesión
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Correo Electrónico"
              name="email"
              variant="outlined"
              margin="normal"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              variant="outlined"
              margin="normal"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Iniciar Sesión
            </Button>
          </form>
          <Button
            fullWidth
            color="secondary"
            sx={{ mt: 2 }}
            onClick={goToSignup}
          >
            ¿No tienes una cuenta? Regístrate
          </Button>
        </Box>

        {/* Snackbars de éxito y error */}
        <Snackbar
          open={openSuccess}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Inicio de sesión exitoso
          </Alert>
        </Snackbar>

        <Snackbar
          open={openError}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
