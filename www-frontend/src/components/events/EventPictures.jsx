import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Card, CardMedia, CardContent } from '@material-ui/core';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EventPictures = () => {
  const { id } = useParams();
  const [pictures, setPictures] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPictures = async () => {
      try {
        const response = await axios.get(`/api/v1/events/${id}/pictures`);
        setPictures(response.data);
      } catch (error) {
        console.error('Error obteniendo las fotos:', error);
        setError('Error obteniendo las fotos');
      }
    };

    fetchPictures();
  }, [id]);

  if (error) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Galería de Fotos
      </Typography>
      <Grid container spacing={2} style={{ maxHeight: '80vh', overflowY: 'scroll' }}>
        {pictures.map((pic, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                alt={`Event Picture ${index + 1}`}
                height="140"
                image={pic.url}
                title={`Event Picture ${index + 1}`}
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  {pic.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EventPictures;