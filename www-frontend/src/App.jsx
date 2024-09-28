import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home.jsx';
import BeerList from './components/beers/BeerList.jsx';
import BarList from './components/bars/BarList.jsx';
import EventList from './components/events/EventList.jsx';
import UserSearch from './components/UserSearch.jsx';
import RegistrationForm from './components/registration/RegistrationForm.jsx';
import LoginForm from './components/login/LoginForm.jsx';
import BarDetail from './components/bars/BarDetail.jsx';
import BottomNavbar from './components/navbar/BottomNavbar';  // Asegúrate de la ruta correcta
import MapComponent from './components/map/MapComponent';



function AppContent() {
  // Hook para obtener la ruta actual
  const location = useLocation();

  // Ocultar BottomNavbar en las rutas de login y signup
  const hideNavbar = location.pathname === '/' || location.pathname === '/signup';
  return (
    <div style={{ paddingBottom: '56px' }}> {/* Asegura espacio para la navbar */}
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
      {!hideNavbar && <BottomNavbar />}
    </div>
  );
};


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
