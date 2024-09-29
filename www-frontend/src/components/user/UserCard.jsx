import React from 'react';
import { Card, CardContent, Typography, Button } from '@material-ui/core';

const UserCard = ({ user, handleViewUser }) => {
  return (
    <Card style={{ marginBottom: '20px' }}>
      <CardContent>
        <Typography variant="h5">
          {user.first_name} {user.last_name}
        </Typography>
        <Typography variant="body1">
          Handle: {user.handle}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleViewUser(user.id)}>
          View
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserCard;