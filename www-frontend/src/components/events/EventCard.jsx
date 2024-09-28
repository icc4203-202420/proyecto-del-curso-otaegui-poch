import React from 'react';
import { Card, CardContent, Typography, Button } from '@material-ui/core';

const EventCard = ({ event, handleViewEvent }) => {
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
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
          onClick={() => handleViewEvent(event.id)}
          style={{ marginTop: '10px' }}
        >
          Ver Evento
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;