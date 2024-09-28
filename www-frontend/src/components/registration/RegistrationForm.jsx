import React, { useState } from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import AddressDetails from './AddressDetails';
import UserDetails from './UserDetails';
import SubmitButton from './SubmitButton';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    handle: '',
    password: '',
    password_confirmation: '',
    address_attributes: {
      line1: '',
      line2: '',
      city: '',
      country_id: ''
    }
  });

  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    const [field, subfield] = name.split('.');

    if (field === 'address_attributes' && subfield) {
      setFormData((prevState) => ({
        ...prevState,
        address_attributes: {
          ...prevState.address_attributes,
          [subfield]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('http://localhost:3001/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        user: {
          ...formData,
          address_attributes: formData.address_attributes
        }
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.errors) {
        setErrors(data.errors);
        setSuccessMessage('');
      } else {
        setSuccessMessage('Usuario registrado con éxito. Redirigiendo...');
        setErrors([]);
        setTimeout(() => navigate('/home'), 2000);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setErrors(['Ocurrió un error al intentar registrar el usuario.']);
      setSuccessMessage('');
    });
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: 20, borderRadius: 8 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Registro de Usuario
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <UserDetails handleChange={handleChange} formData={formData} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <AddressDetails handleChange={handleChange} formData={formData} />
              </Grid>
              <Grid item xs={12}>
                <SubmitButton onSubmit={handleSubmit} />
              </Grid>
            </Grid>
          </form>
          {successMessage && (
            <Typography variant="h6" color="success" align="center" style={{ marginTop: '20px' }}>
              {successMessage}
            </Typography>
          )}
          {errors.length > 0 && (
            <Typography variant="h6" color="error" align="center" style={{ marginTop: '20px' }}>
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RegistrationForm;