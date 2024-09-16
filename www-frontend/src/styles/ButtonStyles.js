// instalar: yarn add @mui/styles


import { makeStyles } from '@mui/styles';

const useShowMoreButton = makeStyles({
  root: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 20px',
    fontSize: '16px',
    '&:hover': {
      backgroundColor: '#218838',
    },
  },
});

export default useShowMoreButton;