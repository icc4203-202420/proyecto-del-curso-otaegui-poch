import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home.jsx';
import BeerList from './components/beers/BeerList.jsx';
import BarList from './components/bars/BarList.jsx';
import EventList from './components/EventList.jsx';
import UserSearch from './components/UserSearch.jsx';
import RegistrationForm from './components/registration/RegistrationForm.jsx';
import LoginForm from './components/login/LoginForm.jsx';
import BarDetail from './components/bars/BarDetail.jsx';
import MapComponent from './components/map/MapComponent';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<RegistrationForm />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/beers" element={<BeerList />} />
        <Route path="/bars" element={<BarList />} />
        <Route path="/bars/:id" element={<BarDetail/>}/>
        <Route path="/events" element={<EventList />} />
        <Route path="/search" element={<UserSearch />} />
        <Route path="/map" element={<MapComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
