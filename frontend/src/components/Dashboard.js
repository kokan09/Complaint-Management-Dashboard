import React from 'react';

function Dashboard({ complaints, analytics, onComplaintClick }) {
  const recentComplaints = complaints.slice(0, 5);

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.875rem', fontWeight: '700' }}>Dashboard Overview</h2>
      
      {analytics && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Complaints</h3>
            <div className="value">{analytics.totalComplaints}</div>
          </div>
          <div className="stat-card">
            <h3>Open Complaints</h3>
            <div className="value" style={{ color: '#f59e0b' }}>{analytics.openComplaints}</div>
          </div>
          <div className="stat-card">
            <h3>Resolved</h3>
            <div className="value" style={{ color: '#10b981' }}>{analytics.resolvedComplaints}</div>
          </div>
          <div className="stat-card">
            <h3>SLA Violations</h3>
            <div className="value" style={{ color: '#ef4444' }}>{analytics.slaViolations}</div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>Recent Complaints</h3>
        <div className="complaint-list">
          {recentComplaints.map(complaint => (
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
              <div className="complaint-text">{complaint.complaint_text.substring(0, 100)}...</div>
              <div className="complaint-meta">
                <span>Category: {complaint.category}</span>
                <span>Sentiment: {complaint.sentiment}</span>
                <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
