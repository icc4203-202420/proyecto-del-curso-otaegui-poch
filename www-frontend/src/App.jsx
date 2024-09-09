import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home.jsx';
import BeerList from './components/BeerList.jsx';
import BarList from './components/BarList.jsx';
import EventList from './components/EventList.jsx';
import UserSearch from './components/UserSearch.jsx';
import SignUp from './components/sign-in/SignUp.jsx';
import LogIn from './components/sign-in/LogIn.jsx';
import ReviewBeer from './components/ReviewBeer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/beers" element={<BeerList />} />
        <Route path="/bars" element={<BarList />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/search" element={<UserSearch />} />
        <Route path="/signup" element={<SignUp />} /> 
        <Route path="/login" element={<LogIn />} /> 
        <Route path="/review/:beerId" element={<ReviewBeer />} />
      </Routes>
    </Router>
  );
}

export default App;
