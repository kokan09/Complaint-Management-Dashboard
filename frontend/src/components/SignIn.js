import React, { useState } from 'react';

function SignIn({ onNavigate, onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    // Simple validation - in production, authenticate with backend
    onLogin(formData.email);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn-primary btn-full">Sign In</button>
        </form>
        <p className="auth-footer">
          Don't have an account? <span onClick={() => onNavigate('signup')}>Sign Up</span>
        </p>
        <p className="auth-footer">
          <span onClick={() => onNavigate('landing')}>Back to Home</span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
