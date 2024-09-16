import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BarEvents = ({ barId }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`/api/v1/bar/${barId}/events`)
      .then(response => setEvents(response.data))
      .catch(error => console.error(error));
  }, [barId]);

  return (
    <div>
      <h2>Events at this Bar</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>{event.name} - {event.date}</li>
        ))}
      </ul>
    </div>
  );
};

export default BarEvents;