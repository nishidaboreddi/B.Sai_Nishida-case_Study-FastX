import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import SearchResults from './pages/SearchResults';
import BookingDetails from './pages/BookingDetails';
import MyTrips from './pages/MyTrips';
import CancelTicket from './pages/CancelTicket';
import VehicleTracking from './pages/VehicleTracking';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import OperatorDashboard from './pages/OperatorDashboard';
import AboutUs from './pages/AboutUs';
import Help from './pages/Help';
import ContactUs from './pages/ContactUs';
import TermsAndConditions from './pages/TermsAndConditions';
import './App.css';

function Layout() {
  const location = useLocation();
  const isDashboard = location.pathname === '/admin' || location.pathname === '/operator';

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/operator" element={<OperatorDashboard />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/booking" element={<BookingDetails />} />
          <Route path="/trips" element={<MyTrips />} />
          <Route path="/cancel-ticket" element={<CancelTicket />} />
          <Route path="/vehicle-tracking" element={<VehicleTracking />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}

export default App;
