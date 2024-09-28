import React from 'react';
import { Card, CardContent, CardHeader, Typography, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';

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
    backgroundColor: theme.palette.primary.light,
    boxShadow: theme.shadows[8],
  },
}));

export function UserCard({ user }) {
  return (
    <Card variant="outlined" sx={{ marginBottom: 2 }}>
      <CardHeader
        title={user.name}
        titleTypographyProps={{ variant: 'h6' }}
        subheaderTypographyProps={{ variant: 'body2' }}
        sx={{ backgroundColor: 'background.paper' }}
      />
      <CardContent>
        <Grid container spacing={2}>
          {user.email && (
            <>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  Email: {user.email}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  Ciudad: {user.city || "N/A"}
                </Typography>
              </Grid>
              <Grid item>
                <StyledButton component={Link} to={`/Users/${user.id}`} variant="contained" color="success">
                  Ver Perfil
                </StyledButton>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}
