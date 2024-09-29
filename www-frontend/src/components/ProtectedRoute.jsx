import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />; // Redirigir a la página de login si no está autenticado
  }

  return children; // Renderizar los hijos si está autenticado
};

export default ProtectedRoute;
