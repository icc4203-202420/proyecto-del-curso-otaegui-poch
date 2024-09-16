import React from 'react';
import { Card, CardContent, CardHeader, Typography, Grid } from '@mui/material';

export function BeerCard({ beer }) {
  return (
    <Card variant="outlined" sx={{ marginBottom: 2 }}>
      <CardHeader
        title={beer.name}
        titleTypographyProps={{ variant: 'h6' }}
        subheaderTypographyProps={{ variant: 'body2' }}
        sx={{ backgroundColor: 'background.paper' }}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              Estilo: {beer.style || "Desconocido"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              Alcohol: {beer.alcohol || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              IBU: {beer.ibu || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              Malta: {beer.malts || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              Lúpulo: {beer.hop || "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
