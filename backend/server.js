const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const { Complaint, Agent, Communication } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/complaint_dashboard')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// AI Service URL
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';

// Calculate SLA deadline (24 hours for standard complaints)
const calculateSLA = (severity) => {
  const hours = severity === 'critical' ? 4 : severity === 'high' ? 12 : 24;
  return new Date(Date.now() + hours * 60 * 60 * 1000);
};

// Create Complaint
app.post('/api/complaints', async (req, res) => {
  try {
    const complaintData = {
      ...req.body,
      sla_deadline: calculateSLA(req.body.severity || 'medium')
    };

    const complaint = new Complaint(complaintData);
    await complaint.save();

    // Call AI service for analysis
    try {
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/analyze`, {
        text: complaint.complaint_text,
        complaint_id: complaint._id
      });

      complaint.category = aiResponse.data.category || complaint.category;
      complaint.sentiment = aiResponse.data.sentiment || complaint.sentiment;
      complaint.severity = aiResponse.data.severity || complaint.severity;
      complaint.product = aiResponse.data.product || complaint.product;
      complaint.ai_suggested_response = aiResponse.data.suggested_response || '';
      await complaint.save();
    } catch (aiError) {
      console.error('AI service error:', aiError.message);
    }

    // Create initial communication record
    await Communication.create({
      complaint_id: complaint._id,
      message: complaint.complaint_text,
      sender: complaint.customer_name,
      sender_type: 'customer'
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Complaints with filters
app.get('/api/complaints', async (req, res) => {
  try {
    const { status, category, severity, sentiment } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (severity) filter.severity = severity;
    if (sentiment) filter.sentiment = sentiment;

    const complaints = await Complaint.find(filter)
      .populate('assigned_agent', 'name email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Complaint
app.get('/api/complaints/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('assigned_agent', 'name email role');
    const communications = await Communication.find({ complaint_id: req.params.id })
      .sort({ createdAt: 1 });
    res.json({ complaint, communications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Complaint
app.put('/api/complaints/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Assign Agent
app.post('/api/complaints/:id/assign', async (req, res) => {
  try {
    const { agent_id } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assigned_agent: agent_id, status: 'in_progress' },
      { new: true }
    );
    await Agent.findByIdAndUpdate(agent_id, {
      $addToSet: { assigned_complaints: req.params.id }
    });
    res.json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add Communication
app.post('/api/complaints/:id/communicate', async (req, res) => {
  try {
    const communication = await Communication.create({
      complaint_id: req.params.id,
      message: req.body.message,
      sender: req.body.sender,
      sender_type: req.body.sender_type
    });
    res.status(201).json(communication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const openComplaints = await Complaint.countDocuments({ status: 'open' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const sentimentStats = await Complaint.aggregate([
      { $group: { _id: '$sentiment', count: { $sum: 1 } } }
    ]);

    const severityStats = await Complaint.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    const slaViolations = await Complaint.countDocuments({
      sla_deadline: { $lt: new Date() },
      status: { $nin: ['resolved', 'closed'] }
    });

    res.json({
      totalComplaints,
      openComplaints,
      resolvedComplaints,
      categoryStats,
      sentimentStats,
      severityStats,
      slaViolations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agent Routes
app.post('/api/agents', async (req, res) => {
  try {
    const agent = new Agent(req.body);
    await agent.save();
    res.status(201).json(agent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/agents', async (req, res) => {
  try {
    const agents = await Agent.find().select('-password');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check SLA and Escalate
app.post('/api/complaints/check-sla', async (req, res) => {
  try {
    const overdueComplaints = await Complaint.find({
      sla_deadline: { $lt: new Date() },
      status: { $nin: ['resolved', 'closed'] }
    });

    for (const complaint of overdueComplaints) {
      complaint.escalation_level += 1;
      complaint.status = 'escalated';
      await complaint.save();
    }

    res.json({ escalated: overdueComplaints.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
