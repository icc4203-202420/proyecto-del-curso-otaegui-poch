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

  const handleUpload = async (imageToUpload) => {
    const formData = new FormData();
    formData.append('image', imageToUpload);

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
      handleViewPictures(); // Actualizar la lista de fotos después de subir una nueva
    } catch (error) {
      console.error('Error subiendo la imagen:', error);
      alert('Error subiendo la imagen');
    }
  };

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        video.pause();
        stream.getTracks().forEach(track => track.stop());

        canvas.toBlob(blob => {
          handleUpload(blob);
        }, 'image/jpeg');
      });
    } catch (error) {
      console.error('Error capturando la foto:', error);
      alert('Error capturando la foto');
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
      <form onSubmit={(e) => { e.preventDefault(); handleUpload(image); }} style={{ display: 'inline' }}>
        <TextField type="file" onChange={handleImageChange} style={{ marginRight: '10px' }} />
        <Button type="submit" variant="contained" color="secondary">
          Subir Fotos
        </Button>
      </form>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleCapture}
        style={{ marginTop: '10px', marginLeft: '10px' }}
      >
        Tomar Foto y Subir
      </Button>

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