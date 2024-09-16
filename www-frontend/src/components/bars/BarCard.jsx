import React from 'react';
import { Card, CardContent, CardHeader, Typography, Divider, Grid } from '@mui/material';

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
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              Latitud: {bar.latitude || "Desconocida"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              Longitud: {bar.longitude || "Desconocida"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              ID de Dirección: {bar.address_id}
            </Typography>
          </Grid>
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
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}
