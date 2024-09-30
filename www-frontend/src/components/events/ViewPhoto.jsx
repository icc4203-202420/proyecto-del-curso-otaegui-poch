import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const ViewPhoto = ({ photoUrl }) => {
  const [taggedUser, setTaggedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const img = new Image();
    img.src = decodeURIComponent(photoUrl);
    img.onload = () => setLoading(false);
    img.onerror = () => {
      setLoading(false);
      alert('Error cargando la imagen');
    };
  }, [photoUrl]);

  const handleTagUser = async () => {
    try {
      // Lógica para etiquetar al usuario
      alert('Usuario etiquetado con éxito');
    } catch (error) {
      console.error('Error etiquetando al usuario:', error);
      alert('Error etiquetando al usuario');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Ver Foto
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <img
          src={decodeURIComponent(photoUrl)}
          alt="Foto en grande"
          style={{ maxWidth: '100%', marginBottom: '20px' }}
        />
      )}
      <TextField
        label="Usuario a etiquetar"
        value={taggedUser}
        onChange={(e) => setTaggedUser(e.target.value)}
        fullWidth
        style={{ marginBottom: '20px' }}
      />
      <Button variant="contained" color="primary" onClick={handleTagUser}>
        Etiquetar Usuario
      </Button>
      <Button
        variant="contained"
        color="secondary"
        style={{ marginTop: '10px', marginLeft: '10px' }}
        onClick={() => history.goBack()}
      >
        Volver
      </Button>
    </Container>
  );
};

export default ViewPhoto;