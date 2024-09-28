import React, { useState } from 'react';
import { Container, Typography, Button, TextField } from '@material-ui/core';
import axios from 'axios';

const EventDetail = ({ event }) => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);

    const token = localStorage.getItem('token'); // Asumiendo que el token se almacena en localStorage

    try {
      await axios.post(`/api/v1/events/${event.id}/upload_picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      alert('Imagen subida con éxito');
    } catch (error) {
      console.error('Error subiendo la imagen:', error);
      alert('Error subiendo la imagen');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {event.name}
      </Typography>
      <Button variant="contained" color="primary" style={{ marginRight: '10px' }}>
        Ver Fotos
      </Button>
      <form onSubmit={handleUpload} style={{ display: 'inline' }}>
        <TextField type="file" onChange={handleImageChange} style={{ marginRight: '10px' }} />
        <Button type="submit" variant="contained" color="secondary">
          Subir Fotos
        </Button>
      </form>
    </Container>
  );
};

export default EventDetail;