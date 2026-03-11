import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandingPage from './pages/LandingPage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './pages/Dashboard';
import ComplaintList from './components/ComplaintList';
import ComplaintDetail from './components/ComplaintDetail';
import Analytics from './components/Analytics';
import { Routes, Route } from "react-router";
import './App.css';
import NavBar from './components/NavBar';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('landing');
  const [view, setView] = useState('dashboard');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchComplaints();
    fetchAnalytics();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`${API_URL}/complaints`);
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleLogin = (email) => {
    setCurrentUser(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setAuthView('landing');
  };

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setView('detail');
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        {authView === 'landing' && <LandingPage onNavigate={setAuthView} />}
        {authView === 'signin' && <SignIn onNavigate={setAuthView} onLogin={handleLogin} />}
        {authView === 'signup' && <SignUp onNavigate={setAuthView} onLogin={handleLogin} />}
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h1>Complaint Management Dashboard</h1>
        <div className="nav-links">
          <NavBar />

          {/* Now i have Routed this : 
          <button onClick={() => setView('dashboard')} className={view === 'dashboard' ? 'active' : ''}>
            Dashboard
          </button>
          <button onClick={() => setView('complaints')} className={view === 'complaints' ? 'active' : ''}>
            Complaints
          </button>
          <button onClick={() => setView('analytics')} className={view === 'analytics' ? 'active' : ''}>
            Analytics
          </button> */}

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path='/dashboard' element ={
            <Dashboard 
              complaints={complaints} 
              analytics={analytics}
              onComplaintClick={handleComplaintClick}
            />
          }/>

          <Route path='/complaints' element ={
            <ComplaintList 
              complaints={complaints}
              onComplaintClick={handleComplaintClick}
              onRefresh={fetchComplaints}
            />
          }/>

          <Route path='/analytics' element ={
            <Analytics analytics={analytics} />
          }/>

          <Route path='/detail' element ={
            <ComplaintDetail 
              complaint={selectedComplaint}
              onBack={() => setView('complaints')}
              onUpdate={fetchComplaints}
            />
          } />
          
        </Routes>
      </main>
    </div>
  );
}

export default App;
