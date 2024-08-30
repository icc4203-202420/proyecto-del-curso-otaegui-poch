import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EventList = () => {
  const { barId } = useParams();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`/api/v1/bar/${barId}/events`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [barId]);

  return (
    <Container>
      <Typography variant="h2" gutterBottom>Eventos en el Bar</Typography>
      <List>
        {events.map(event => (
          <ListItem key={event.id}>{event.name}</ListItem>
        ))}
      </List>
    </Container>
  );
};

export default EventList;
