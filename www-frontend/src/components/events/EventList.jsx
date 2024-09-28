import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from './EventCard';
import { Container, Typography } from '@material-ui/core';

const EventList = ({ handleCheckIn }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/v1/events');
        const sortedEvents = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sortedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Próximos Eventos..
      </Typography>
      {events.length > 0 ? (
        events.map(event => (
          <EventCard key={event.id} event={event} handleCheckIn={handleCheckIn} />
        ))
      ) : (
        <Typography variant="body1">No hay eventos próximos.</Typography>
      )}
    </Container>
  );
};

export default EventList;