import React from 'react';

function Analytics({ analytics }) {
  if (!analytics) return <div>Loading analytics...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.875rem', fontWeight: '700' }}>Analytics & Insights</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Complaints</h3>
          <div className="value">{analytics.totalComplaints}</div>
        </div>
        <div className="stat-card">
          <h3>Open</h3>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="chart-container">
          <h3 style={{ marginBottom: '1rem' }}>Complaints by Category</h3>
          {analytics.categoryStats.map(stat => (
            <div key={stat._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
              <span>{stat._id}</span>
              <span style={{ fontWeight: '600' }}>{stat.count}</span>
            </div>
          ))}
        </div>

        <div className="chart-container">
          <h3 style={{ marginBottom: '1rem' }}>Sentiment Distribution</h3>
          {analytics.sentimentStats.map(stat => (
            <div key={stat._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
              <span>{stat._id}</span>
              <span style={{ fontWeight: '600' }}>{stat.count}</span>
            </div>
          ))}
        </div>

        <div className="chart-container">
          <h3 style={{ marginBottom: '1rem' }}>Severity Levels</h3>
          {analytics.severityStats.map(stat => (
            <div key={stat._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
              <span className={`badge ${stat._id}`}>{stat._id}</span>
              <span style={{ fontWeight: '600' }}>{stat.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-container" style={{ marginTop: '1.5rem' }}>
        <h3>Key Insights</h3>
        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            Resolution Rate: {analytics.totalComplaints > 0 
              ? ((analytics.resolvedComplaints / analytics.totalComplaints) * 100).toFixed(1) 
              : 0}%
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Most Common Category: {analytics.categoryStats[0]?._id || 'N/A'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            SLA Compliance: {analytics.totalComplaints > 0 
              ? (((analytics.totalComplaints - analytics.slaViolations) / analytics.totalComplaints) * 100).toFixed(1) 
              : 100}%
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Analytics;
