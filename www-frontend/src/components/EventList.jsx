import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BarEvents = ({ barId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (barId) {
      axios.get(`/api/v1/bars/${barId}/events`)
        .then(response => {
          setEvents(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    }
  }, [barId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading events: {error.message}</div>;

  return (
    <div>
      <h2>Events at this Bar</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>{event.name} - {new Date(event.date).toLocaleDateString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
