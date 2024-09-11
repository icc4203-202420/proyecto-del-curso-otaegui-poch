import React from 'react';
import { TextField, Grid } from '@mui/material';

const AddressDetails = ({ handleChange, formData }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Calle Principal"
          name="address_attributes.line1"  
          variant="outlined"
          margin="normal"
          value={formData.address_attributes.line1 || ''}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Segunda Línea de Dirección"  
          name="address_attributes.line2"  
          variant="outlined"
          margin="normal"
          value={formData.address_attributes.line2 || ''}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Ciudad"
          name="address_attributes.city"
          variant="outlined"
          margin="normal"
          value={formData.address_attributes.city || ''}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="País"
          name="address_attributes.country_id"  
          variant="outlined"
          margin="normal"
          value={formData.address_attributes.country_id || ''}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
};

export default AddressDetails;
