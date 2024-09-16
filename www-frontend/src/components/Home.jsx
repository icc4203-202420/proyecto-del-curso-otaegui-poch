import { Link } from 'react-router-dom';
import { Container, Typography, Button, Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';

// Estilo del contenedor principal
const HeroSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'center',
  backgroundColor: theme.palette.primary.dark, // Cambia esto al color de fondo deseado
  color: theme.palette.common.white,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

// Estilo del botón
const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1, 4),
  borderRadius: '50px',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '16px',
  letterSpacing: '0.5px',
  boxShadow: theme.shadows[6],
  transition: 'background-color 0.3s, box-shadow 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    boxShadow: theme.shadows[8],
  },
}));

// Estilo para el título
const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
}));

// Estilo para la descripción
const Description = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

function Home() {
  return (
    <Container maxWidth="md">
      <HeroSection elevation={6}>
        <Title variant="h2" gutterBottom>
          Welcome to the Beer App
        </Title>
        <Description variant="h6" paragraph>
          Discover the best beers, bars, and events. Navigate through the app to explore.
        </Description>
        <Grid container spacing={3} justifyContent="center">
          <Grid item>
            <StyledButton component={Link} to="/beers" variant="contained" color="primary">
              Explore Beers
            </StyledButton>
          </Grid>
          <Grid item>
            <StyledButton component={Link} to="/bars" variant="contained" color="secondary">
              Find Bars
            </StyledButton>
          </Grid>
          <Grid item>
            <StyledButton component={Link} to="/events" variant="contained" color="success">
              Upcoming Events
            </StyledButton>
          </Grid>
          <Grid item>
            <StyledButton component={Link} to="/search" variant="contained" color="info">
              Search Users
            </StyledButton>
          </Grid>
          <Grid item>
            <StyledButton component={Link} to="/map" variant="contained" color="warning">
              Map
            </StyledButton>
          </Grid>
        </Grid>
      </HeroSection>
    </Container>
  );
}

export default Home;
