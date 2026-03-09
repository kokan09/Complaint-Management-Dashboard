const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  customer_id: { type: String, required: true },
  customer_name: { type: String, required: true },
  customer_email: { type: String, required: true },
  complaint_text: { type: String, required: true },
  channel: { type: String, enum: ['email', 'chat', 'social_media', 'web_form', 'phone'], required: true },
  category: { type: String, default: 'uncategorized' },
  product: { type: String, default: '' },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  sentiment: { type: String, enum: ['positive', 'neutral', 'negative', 'highly_negative'], default: 'neutral' },
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed', 'escalated'], default: 'open' },
  assigned_agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', default: null },
  sla_deadline: { type: Date },
  resolution: { type: String, default: '' },
  ai_suggested_response: { type: String, default: '' },
  duplicate_of: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', default: null },
  escalation_level: { type: Number, default: 0 }
}, { timestamps: true });

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['agent', 'team_lead', 'manager'], default: 'agent' },
  assigned_complaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }]
}, { timestamps: true });

const communicationSchema = new mongoose.Schema({
  complaint_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  message: { type: String, required: true },
  sender: { type: String, required: true },
  sender_type: { type: String, enum: ['customer', 'agent', 'system'], required: true }
}, { timestamps: true });

module.exports = {
  Complaint: mongoose.model('Complaint', complaintSchema),
  Agent: mongoose.model('Agent', agentSchema),
  Communication: mongoose.model('Communication', communicationSchema)
};
