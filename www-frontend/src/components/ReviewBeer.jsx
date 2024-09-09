import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReviewBeer = () => {
  const { beerId } = useParams();
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(1);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3001/api/v1/reviews`, {
        review: {
          text: review,
          rating: rating,
          beer_id: beerId
        }
      });
      setSuccess(true);
      setError('');
      setTimeout(() => navigate(`/beers/${beerId}`), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Error al enviar la reseña. Intenta nuevamente.");
    }
  };

  return (
    <Container>
      <Typography variant="h2" gutterBottom>Reseñar Cerveza</Typography>
      <TextField
        label="Escribe tu reseña"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={review}
        onChange={(e) => setReview(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Puntuación (1-5)"
        variant="outlined"
        type="number"
        fullWidth
        value={rating}
        onChange={(e) => setRating(parseInt(e.target.value, 10))}
        inputProps={{ min: 1, max: 5 }}
        sx={{ marginBottom: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleReviewSubmit}
      >
        Enviar Reseña
      </Button>
      {success && <Typography variant="body1" color="success.main">Reseña enviada con éxito!</Typography>}
      {error && <Typography variant="body1" color="error.main">{error}</Typography>}
    </Container>
  );
};

export default ReviewBeer;
