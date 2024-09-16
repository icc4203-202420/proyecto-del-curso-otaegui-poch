import React from 'react';
import { Card, CardContent, CardHeader, Typography, Divider, Grid, Button,  } from '@mui/material';
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

export function BarCard({ bar }) {
  return (
    <Card variant="outlined" sx={{ marginBottom: 2 }}>
      <CardHeader
        title={bar.name}
        titleTypographyProps={{ variant: 'h6' }}
        subheaderTypographyProps={{ variant: 'body2' }}
        sx={{ backgroundColor: 'background.paper' }}
      />
      <CardContent>
        <Grid container spacing={2}>
          {bar.address && (
            <>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  Dirección: {bar.address.line1}, {bar.address.line2 || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  Ciudad: {bar.address.city || "N/A"}
                </Typography>
              </Grid>
              <Grid item>          
                <StyledButton component={Link} to={`/Bars/${bar.id}`} variant="contained" color="success">
                  Ver
                </StyledButton>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}
