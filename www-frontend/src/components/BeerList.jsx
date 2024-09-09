import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, List, ListItem, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { BeerCard } from './BeerCard';
import { useNavigate } from 'react-router-dom';

const BeerList = () => {
  const [beers, setBeers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedBeer, setSelectedBeer] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/beers');
        setBeers(response.data.beers);
      } catch (error) {
        console.error("Error fetching beers:", error);
      }
    };
    fetchBeers();
  }, []);

  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewClick = (beer) => {
    setSelectedBeer(beer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBeer(null);
  };

  const handleReviewClick = () => {
    navigate(`/review/${selectedBeer.id}`);
    handleCloseDialog();
  };

  return (
    <Container>
      <Typography variant="h2" gutterBottom>Listado de Cervezas</Typography>
      <TextField
        label="Buscar cervezas"
        variant="outlined"
        fullWidth
        onChange={(e) => setSearch(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      
      <List>
        {filteredBeers.map(beer => (
          <ListItem key={beer.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{beer.name}</Typography>
            <Button variant="contained" color="primary" onClick={() => handleViewClick(beer)}>
              View
            </Button>
          </ListItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Detalles de la Cerveza</DialogTitle>
        <DialogContent>
          {selectedBeer && <BeerCard beer={selectedBeer} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReviewClick} color="primary">Review</Button>
          <Button onClick={handleCloseDialog} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BeerList;
