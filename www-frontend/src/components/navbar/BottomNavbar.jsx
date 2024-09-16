import React from 'react';
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';

const BottomNavbar = () => {
  return (
    <Box sx={{ width: '100%', position: 'fixed', bottom: 0, left: 0 }}>
      <BottomNavigation
        showLabels
        sx={{ backgroundColor: '#f5f5f5', boxShadow: '0px -2px 5px rgba(0,0,0,0.1)' }}
      >
        <BottomNavigationAction
          component={Link}
          to="/home"
          label="Home"
          icon={<HomeIcon />}
        />
        {/* Puedes agregar más botones de navegación aquí */}
      </BottomNavigation>
    </Box>
  );
};

export default BottomNavbar;
