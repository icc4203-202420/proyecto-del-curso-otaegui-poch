import { Link } from 'react-router-dom';
import { Container, Typography, Button, Grid, Paper } from '@mui/material';

function Home() {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
        <Typography variant="h2" align="center" gutterBottom>
          Welcome to the Beer App
        </Typography>
        <Typography variant="h6" align="center" paragraph>
          Discover the best beers, bars, and events. Navigate through the app to explore.
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button component={Link} to="/beers" variant="contained" color="primary" size="large">
              Explore Beers
            </Button>
          </Grid>
          <Grid item>
            <Button component={Link} to="/bars" variant="contained" color="secondary" size="large">
              Find Bars
            </Button>
          </Grid>
          <Grid item>
            <Button component={Link} to="/events" variant="contained" color="success" size="large">
              Upcoming Events
            </Button>
          </Grid>
          <Grid item>
            <Button component={Link} to="/search" variant="contained" color="info" size="large">
              Search Users
            </Button>
          </Grid>
          <Grid item>
            <Button component={Link} to="/signup" variant="contained" color="warning" size="large">
              Sign Up
            </Button>
          </Grid>
          <Grid item>
            <Button component={Link} to="/login" variant="contained" color="warning" size="large">
              Log In
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Home;
