import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home.jsx';
import BeerList from './components/BeerList.jsx';
import BarList from './components/BarList.jsx';
import EventList from './components/EventList.jsx';
import UserSearch from './components/UserSearch.jsx';
import RegistrationForm from './components/registration/RegistrationForm.jsx';
import LoginForm from './components/login/LoginForm.jsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<RegistrationForm />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/beers" element={<BeerList />} />
        <Route path="/bars" element={<BarList />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/search" element={<UserSearch />} />
      </Routes>
    </Router>
  );
}

export default App;
