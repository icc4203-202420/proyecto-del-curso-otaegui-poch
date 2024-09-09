import React from 'react';
import { Button, Grid } from '@mui/material';

const SubmitButton = ({ onSubmit }) => {
  return (
    <Grid container spacing={2} marginTop={2}>
      <Grid item xs={12}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          onClick={onSubmit} // Usa la función pasada como propiedad
        >
          Registrarse
        </Button>
      </Grid>
    </Grid>
  );
};

export default SubmitButton;
