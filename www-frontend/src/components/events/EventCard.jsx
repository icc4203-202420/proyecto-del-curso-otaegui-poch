import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, TextField } from '@material-ui/core';

const EventCard = ({ event, handleCheckIn, handleUploadPicture }) => {
  const [image, setImage] = useState(null);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUploadPicture(event.id, image);
  };

  return (
    <Card style={{ marginBottom: '20px' }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {event.name}
        </Typography>
        <Typography color="textSecondary">
          {formatDate(event.date) || 'Fecha no disponible'}
        </Typography>
        <Typography variant="body2" component="p">
          {event.description}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleCheckIn(event.id)}
          style={{ marginTop: '10px' }}
        >
          Check In
        </Button>
        <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
          <TextField type="file" onChange={handleImageChange} />
          <Button type="submit" variant="contained" color="secondary" style={{ marginTop: '10px' }}>
            Upload Picture
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventCard;