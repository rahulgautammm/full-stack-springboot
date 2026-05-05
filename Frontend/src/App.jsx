import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import CitizenDashboard from './pages/CitizenDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AuthorityDashboard from './pages/AuthorityDashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('cdrn_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('cdrn_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cdrn_user');
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Toaster position="top-right" />
        {user && (
          <header className="navbar glass">
            <h2>CDRN</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span>{user.name} ({user.role})</span>
              <button className="btn btn-danger" onClick={handleLogout} style={{ padding: '0.4rem 1rem' }}>Logout</button>
            </div>
          </header>
        )}
        <Routes>
          <Route path="/" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={`/${user.role.toLowerCase()}`} />} />
          <Route path="/citizen" element={user && user.role === 'CITIZEN' ? <CitizenDashboard user={user} /> : <Navigate to="/" />} />
          <Route path="/volunteer" element={user && user.role === 'VOLUNTEER' ? <VolunteerDashboard user={user} /> : <Navigate to="/" />} />
          <Route path="/authority" element={user && user.role === 'AUTHORITY' ? <AuthorityDashboard user={user} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
