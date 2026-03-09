import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function ComplaintDetail({ complaint, onBack, onUpdate }) {
  const [detailData, setDetailData] = useState(null);
  const [message, setMessage] = useState('');
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetchComplaintDetail();
    fetchAgents();
  }, [complaint._id]);

  const fetchComplaintDetail = async () => {
    try {
      const response = await axios.get(`${API_URL}/complaints/${complaint._id}`);
      setDetailData(response.data);
    } catch (error) {
      console.error('Error fetching complaint detail:', error);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await axios.get(`${API_URL}/agents`);
      setAgents(response.data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await axios.put(`${API_URL}/complaints/${complaint._id}`, { status: newStatus });
      fetchComplaintDetail();
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAssignAgent = async (agentId) => {
    try {
      await axios.post(`${API_URL}/complaints/${complaint._id}/assign`, { agent_id: agentId });
      fetchComplaintDetail();
      onUpdate();
    } catch (error) {
      console.error('Error assigning agent:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      await axios.post(`${API_URL}/complaints/${complaint._id}/communicate`, {
        message,
        sender: 'Support Agent',
        sender_type: 'agent'
      });
      setMessage('');
      fetchComplaintDetail();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!detailData) return <div>Loading...</div>;

  const { complaint: comp, communications } = detailData;

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h2>Complaint Details</h2>
        <button className="secondary" onClick={onBack}>← Back</button>
      </div>

      <div className="detail-section">
        <h3>Customer Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">Name</div>
            <div className="info-value">{comp.customer_name}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Email</div>
            <div className="info-value">{comp.customer_email}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Customer ID</div>
            <div className="info-value">{comp.customer_id}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Channel</div>
            <div className="info-value">{comp.channel}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Complaint Details</h3>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">Status</div>
            <div className="info-value">
              <span className={`badge ${comp.status}`}>{comp.status}</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">Severity</div>
            <div className="info-value">
              <span className={`badge ${comp.severity}`}>{comp.severity}</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">Category</div>
            <div className="info-value">{comp.category}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Sentiment</div>
            <div className="info-value">{comp.sentiment}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Product</div>
            <div className="info-value">{comp.product || 'N/A'}</div>
          </div>
          <div className="info-item">
            <div className="info-label">SLA Deadline</div>
            <div className="info-value">{new Date(comp.sla_deadline).toLocaleString()}</div>
          </div>
        </div>
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '4px' }}>
          <div className="info-label">Complaint Text</div>
          <div style={{ marginTop: '0.5rem' }}>{comp.complaint_text}</div>
        </div>
      </div>

      {comp.ai_suggested_response && (
        <div className="detail-section">
          <h3>AI Suggested Response</h3>
          <div className="ai-response">
            {comp.ai_suggested_response}
          </div>
        </div>
      )}

      <div className="detail-section">
        <h3>Actions</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="primary" onClick={() => handleStatusUpdate('in_progress')}>
            Mark In Progress
          </button>
          <button className="primary" onClick={() => handleStatusUpdate('resolved')}>
            Mark Resolved
          </button>
          <button className="secondary" onClick={() => handleStatusUpdate('escalated')}>
            Escalate
          </button>
          <select
            onChange={(e) => handleAssignAgent(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
          >
            <option value="">Assign Agent</option>
            {agents.map(agent => (
              <option key={agent._id} value={agent._id}>{agent.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="detail-section">
        <h3>Communication History</h3>
        <div className="communication-list">
          {communications.map(comm => (
            <div key={comm._id} className={`message ${comm.sender_type}`}>
              <div className="message-sender">{comm.sender}</div>
              <div className="message-time">{new Date(comm.createdAt).toLocaleString()}</div>
              <div>{comm.message}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your response..."
            rows="3"
            style={{ flex: 1, padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
          />
          <button className="primary" onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetail;
