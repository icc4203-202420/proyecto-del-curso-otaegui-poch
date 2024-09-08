import { Container, Typography, TextField, List, ListItem } from '@mui/material';

export function BeerCard({beer}) {
    return (
        <ListItem key={beer.id}>
            <Typography variant="h6"> nombre: {beer.name}</Typography>
            <Typography variant="body2">Estilo: {beer.style || "Desconocido"}</Typography>
            <Typography variant="body2">Alcohol: {beer.alcohol || "N/A"}</Typography>
            <Typography variant="body2">IBU: {beer.ibu || "N/A"}</Typography>
            <Typography variant="body2">Malta: {beer.malts || "N/A"}</Typography>
            <Typography variant="body2">Lúpulo: {beer.hop || "N/A"}</Typography>
          </ListItem>
    )
}