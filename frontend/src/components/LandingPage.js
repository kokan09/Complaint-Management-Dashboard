import React from 'react';

function LandingPage({ onNavigate }) {
  return (
    <div className="landing-page">
      <div className="landing-hero">
        <h1>Unified Customer Complaint Management</h1>
        <p>AI-powered platform to centralize, analyze, and resolve customer complaints efficiently</p>
        <div className="landing-buttons">
          <button className="btn-primary" onClick={() => onNavigate('signin')}>Sign In</button>
          <button className="btn-secondary" onClick={() => onNavigate('signup')}>Sign Up</button>
        </div>
      </div>
      
      <div className="landing-features">
        <div className="feature-card">
          <h3>🤖 AI-Powered Analysis</h3>
          <p>Automatic categorization and sentiment analysis</p>
        </div>
        <div className="feature-card">
          <h3>📊 Real-time Analytics</h3>
          <p>Track trends and performance metrics</p>
        </div>
        <div className="feature-card">
          <h3>⚡ SLA Management</h3>
          <p>Automated escalation and deadline tracking</p>
        </div>
        <div className="feature-card">
          <h3>🔄 Multi-Channel Support</h3>
          <p>Email, chat, social media, and more</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
