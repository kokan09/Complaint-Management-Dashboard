import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import ComplaintList from './components/ComplaintList';
import ComplaintDetail from './components/ComplaintDetail';
import Analytics from './components/Analytics';
import './App.css';

const API_URL = 'http://localhost:3001/api';

function App() {
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

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setView('detail');
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1>Complaint Management Dashboard</h1>
        <div className="nav-links">
          <button onClick={() => setView('dashboard')} className={view === 'dashboard' ? 'active' : ''}>
            Dashboard
          </button>
          <button onClick={() => setView('complaints')} className={view === 'complaints' ? 'active' : ''}>
            Complaints
          </button>
          <button onClick={() => setView('analytics')} className={view === 'analytics' ? 'active' : ''}>
            Analytics
          </button>
        </div>
      </nav>

      <main className="main-content">
        {view === 'dashboard' && (
          <Dashboard 
            complaints={complaints} 
            analytics={analytics}
            onComplaintClick={handleComplaintClick}
          />
        )}
        {view === 'complaints' && (
          <ComplaintList 
            complaints={complaints}
            onComplaintClick={handleComplaintClick}
            onRefresh={fetchComplaints}
          />
        )}
        {view === 'analytics' && (
          <Analytics analytics={analytics} />
        )}
        {view === 'detail' && selectedComplaint && (
          <ComplaintDetail 
            complaint={selectedComplaint}
            onBack={() => setView('complaints')}
            onUpdate={fetchComplaints}
          />
        )}
      </main>
    </div>
  );
}

export default App;
