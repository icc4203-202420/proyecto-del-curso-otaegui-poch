import React from 'react';
import { TextField, Grid } from '@mui/material';

const UserDetails = ({ handleChange, formData }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Nombre"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Apellido"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Handle"
          name="handle"
          value={formData.handle}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
            required
            label="Contraseña"
            name="password"  // Nombre único para este campo
            type="password"
            variant="outlined"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
          />
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Confirmar Contraseña"
              name="password_confirmation" 
              type="password"
              variant="outlined"
              margin="normal"
              value={formData.password_confirmation}
              onChange={handleChange}
            />
          </Grid>
      </Grid>
    </Grid>
  );
};

export default UserDetails;
