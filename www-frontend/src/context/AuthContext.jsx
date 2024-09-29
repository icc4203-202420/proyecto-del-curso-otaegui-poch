import React, { createContext, useContext, useState } from 'react';

// Crear un contexto de autenticación
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para la autenticación

  const login = () => {
    setIsAuthenticated(true); // Iniciar sesión
  };

  const logout = () => {
    setIsAuthenticated(false); // Cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};
