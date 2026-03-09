import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function ComplaintList({ complaints, onComplaintClick, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_id: '',
    complaint_text: '',
    channel: 'email'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/complaints`, formData);
      setShowForm(false);
      setFormData({ customer_name: '', customer_email: '', customer_id: '', complaint_text: '', channel: 'email' });
      onRefresh();
    } catch (error) {
      console.error('Error creating complaint:', error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: '700' }}>All Complaints</h2>
        <button className="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Complaint'}
        </button>
      </div>

      {showForm && (
        <div className="detail-container" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Create New Complaint</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Customer Name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                required
                style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
              />
              <input
                type="email"
                placeholder="Customer Email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                required
                style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
              />
              <input
                type="text"
                placeholder="Customer ID"
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                required
                style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
              />
              <select
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
              >
                <option value="email">Email</option>
                <option value="chat">Chat</option>
                <option value="social_media">Social Media</option>
                <option value="web_form">Web Form</option>
                <option value="phone">Phone</option>
              </select>
              <textarea
                placeholder="Complaint Description"
                value={formData.complaint_text}
                onChange={(e) => setFormData({ ...formData, complaint_text: e.target.value })}
                required
                rows="4"
                style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
              />
              <button type="submit" className="primary">Submit Complaint</button>
            </div>
          </form>
        </div>
      )}

      <div className="complaint-list">
        {complaints.map(complaint => (
          <div key={complaint._id} className="complaint-item" onClick={() => onComplaintClick(complaint)}>
            <div className="complaint-header">
              <span className="complaint-id">{complaint.customer_name}</span>
              <div>
                <span className={`badge ${complaint.status}`}>{complaint.status}</span>
                <span className={`badge ${complaint.severity}`} style={{ marginLeft: '0.5rem' }}>
                  {complaint.severity}
                </span>
              </div>
            </div>
            <div className="complaint-text">{complaint.complaint_text}</div>
            <div className="complaint-meta">
              <span>Category: {complaint.category}</span>
              <span>Channel: {complaint.channel}</span>
              <span>Sentiment: {complaint.sentiment}</span>
              <span>{new Date(complaint.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComplaintList;
