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

    const token = localStorage.getItem('token');

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
      const response = await axios.get(`/api/v1/events/${event.id}/pictures`);
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
          {pictures.map((pic, index) => (
            // pic.pictures_url es un array, así que mapeamos sobre él
            pic.pictures_url.map((url, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card>
                  <CardMedia
                    component="img"
                    alt={`Event Picture ${index + 1} - ${idx + 1}`}
                    height="140"
                    image={url}
                    title={`Event Picture ${index + 1} - ${idx + 1}`}
                  />
                  <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {pic.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default EventDetail;
