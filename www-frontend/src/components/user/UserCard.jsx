import React from 'react';
import { Card, CardContent, Typography, Button } from '@material-ui/core';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';


// Estilo del botón
const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(0.7, 3),
  borderRadius: '50px',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '16px',
  letterSpacing: '0.5px',
  boxShadow: theme.shadows[6],
  transition: 'background-color 0.3s, box-shadow 0.3s',
  '&:hover': {
    backgroundColor: "primary",
    boxShadow: theme.shadows[8],
  },
}));

const UserCard = ({ user, handleViewUser }) => {
  return (
    <Card style={{ marginBottom: '20px' }}>
      <CardContent>
        <Typography variant="h5">
          {user.first_name} {user.last_name}
        </Typography>
        <Typography variant="body1">
          Handle: {user.handle}
        </Typography>
        <StyledButton component={Link} to={`/users/${user.id}`} variant="contained" color="success">
          Ver
        </StyledButton>
      </CardContent>
    </Card>
  );
};

export default UserCard;