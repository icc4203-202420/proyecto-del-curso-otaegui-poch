import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from './EventCard';
import EventDetail from './EventDetail';
import { Container, Typography } from '@material-ui/core';

const EventList = ({ handleCheckIn }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/events');
        const sortedEvents = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sortedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleViewEvent = (eventId) => {
    const event = events.find(event => event.id === eventId);
    setSelectedEvent(event);
  };

  return (
    <Container>
      {selectedEvent ? (
        <EventDetail event={selectedEvent} />
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Próximos Eventos
          </Typography>
          {events.length > 0 ? (
            events.map(event => (
              <EventCard key={event.id} event={event} handleViewEvent={handleViewEvent} />
            ))
          ) : (
            <Typography variant="body1">No hay eventos próximos.</Typography>
          )}
        </>
      )}
    </Container>
  );
};

export default EventList;