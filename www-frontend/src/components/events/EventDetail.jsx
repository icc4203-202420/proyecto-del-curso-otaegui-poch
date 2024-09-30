import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Grid, Card, CardMedia, CardContent, Modal, Backdrop, Fade } from '@material-ui/core';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '8px',
    padding: theme.spacing(4),
    outline: 'none',
    boxShadow: theme.shadows[5],
  },
  searchField: {
    width: '100%', // Cambiado a 100% para ocupar todo el ancho
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      width: '300px', // Ancho fijo para pantallas más grandes
    },
  },
  picture: {
    maxWidth: '90%',
    maxHeight: '70%',
    borderRadius: '8px',
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const EventDetail = ({ event }) => {
  const classes = useStyles();
  const [image, setImage] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [showPictures, setShowPictures] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [taggedUser, setTaggedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async (imageToUpload) => {
    const formData = new FormData();
    formData.append('image', imageToUpload);

    const token = localStorage.getItem('authToken');

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
      handleViewPictures();
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

  const handleOpenModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
  };

  const handleTagUser = async () => {
    if (!selectedUser) {
      alert('Por favor, selecciona un usuario a etiquetar.');
      return;
    }

    try {
      await axios.post(`http://localhost:3001/api/v1/events/${event.id}/tag_user`, { picture_id: selectedImage.id, user_id: selectedUser.id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      alert('Usuario etiquetado con éxito');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error etiquetando al usuario:', error);
      alert('Error etiquetando al usuario');
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
        Take a Picture
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
                    <Button variant="contained" color="primary" onClick={() => handleOpenModal({ id: pic.id, url })}>
                      TAG
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={classes.modalContent}>
            {selectedImage && (
              <>
                <img src={selectedImage.url} alt="Foto ampliada" className={classes.picture} />
                <Autocomplete
                  options={users}
                  getOptionLabel={(option) => option.handle}
                  className={classes.searchField}
                  renderInput={(params) => (
                    <TextField {...params} label="Buscar Usuario" variant="outlined" />
                  )}
                  onChange={(event, newValue) => setSelectedUser(newValue)}
                  filterOptions={(options, { inputValue }) =>
                    options.filter(option =>
                      option.handle.toLowerCase().includes(inputValue.toLowerCase())
                    )
                  }
                  size="small" // Ajustar el tamaño del campo de búsqueda
                />
                <Button variant="contained" color="primary" onClick={handleTagUser} className={classes.button}>
                  Tag User
                </Button>
                <Button variant="contained" color="default" onClick={handleCloseModal} className={classes.button}>
                  Go Back
                </Button>
              </>
            )}
          </div>
        </Fade>
      </Modal>
    </Container>
  );
};

export default EventDetail;
