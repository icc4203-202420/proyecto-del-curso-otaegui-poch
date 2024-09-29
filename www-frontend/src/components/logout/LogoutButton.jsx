import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { Button } from '@mui/material';

const LogoutButton = () => {
  const navigate = useNavigate(); // Usa useNavigate

  const handleLogout = () => {
    // Aquí puedes agregar la lógica para cerrar sesión, como eliminar el token
    localStorage.removeItem('token'); // Elimina el token del localStorage

    // Navega a la página de login
    navigate('/'); // Cambia a la ruta de login
  };

  return (
    <Button variant="outlined" color="error" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
