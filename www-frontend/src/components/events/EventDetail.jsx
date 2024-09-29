import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Grid, Card, CardMedia, CardContent } from '@material-ui/core';
import axios from 'axios';

const EventDetail = ({ event }) => {
  const [image, setImage] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [showPictures, setShowPictures] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);

    const token = localStorage.getItem('authToken'); // Asegúrate de que el token se almacena en localStorage

    if (!token) {
      alert('Token no encontrado. Por favor, inicia sesión de nuevo.');
      return;
    }

    try {
      await axios.post(`http://localhost:3001/api/v1/events/${event.id}/upload_picture`, formData, {
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

  const handleViewPictures = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/events/${event.id}/pictures`);
      setPictures(response.data);
      setShowPictures(true);
    } catch (error) {
      console.error('Error obteniendo las fotos:', error);
      alert('Error obteniendo las fotos');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {event.name}
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        style={{ marginRight: '10px' }} 
        onClick={handleViewPictures}
      >
        Ver Fotos
      </Button>
      <form onSubmit={handleUpload} style={{ display: 'inline' }}>
        <TextField type="file" onChange={handleImageChange} style={{ marginRight: '10px' }} />
        <Button type="submit" variant="contained" color="secondary">
          Subir Fotos
        </Button>
      </form>

      {showPictures && (
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          {pictures.flatMap((pic, picIndex) =>
            pic.pictures_url.map((url, urlIndex) => (
              <Grid item xs={12} sm={6} md={4} key={`${picIndex}-${urlIndex}`}>
                <Card>
                  <CardMedia
                    component="img"
                    alt={`Foto ${urlIndex + 1} en el evento ${event.name}`}
                    height="140"
                    image={url}
                    title={`Foto ${urlIndex + 1} en el evento ${event.name}`}
                  />
                  <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {`Foto ${urlIndex + 1} en el evento ${event.name}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Container>
  );
};

export default EventDetail;