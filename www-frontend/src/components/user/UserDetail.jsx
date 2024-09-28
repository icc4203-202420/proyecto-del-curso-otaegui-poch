import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

const UserDetail = ({ user }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h4">
          {user.first_name} {user.last_name}
        </Typography>
        <Typography variant="h6">
          Handle: {user.handle}
        </Typography>
        <Typography variant="body1">
          Email: {user.email}
        </Typography>
        <Typography variant="body1">
          Age: {user.age}
        </Typography>
        <Typography variant="body1">
          ID: {user.id}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserDetail;