const mongoose = require('mongoose');
const { Complaint, Agent } = require('./models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/complaint_dashboard';

const sampleAgents = [
  { name: 'John Smith', email: 'john@company.com', password: 'password123', role: 'agent' },
  { name: 'Sarah Johnson', email: 'sarah@company.com', password: 'password123', role: 'team_lead' },
  { name: 'Mike Wilson', email: 'mike@company.com', password: 'password123', role: 'manager' }
];

const sampleComplaints = [
  {
    customer_id: 'CUST001',
    customer_name: 'Alice Brown',
    customer_email: 'alice@email.com',
    complaint_text: 'My payment was deducted but the transaction failed. I need an immediate refund.',
    channel: 'email',
    category: 'billing_issue',
    product: 'payment gateway',
    severity: 'high',
    sentiment: 'negative',
    status: 'open',
    sla_deadline: new Date(Date.now() + 12 * 60 * 60 * 1000)
  },
  {
    customer_id: 'CUST002',
    customer_name: 'Bob Davis',
    customer_email: 'bob@email.com',
    complaint_text: 'The mobile app keeps crashing whenever I try to login. This is very frustrating.',
    channel: 'chat',
    category: 'technical_issue',
    product: 'mobile app',
    severity: 'medium',
    sentiment: 'negative',
    status: 'open',
    sla_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    customer_id: 'CUST003',
    customer_name: 'Carol White',
    customer_email: 'carol@email.com',
    complaint_text: 'I ordered a product 2 weeks ago and still have not received it. Where is my order?',
    channel: 'social_media',
    category: 'service_delay',
    product: 'delivery',
    severity: 'medium',
    sentiment: 'negative',
    status: 'in_progress',
    sla_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    customer_id: 'CUST004',
    customer_name: 'David Lee',
    customer_email: 'david@email.com',
    complaint_text: 'The product I received is damaged and not working properly. Need replacement.',
    channel: 'web_form',
    category: 'product_defect',
    product: 'product',
    severity: 'high',
    sentiment: 'highly_negative',
    status: 'open',
    sla_deadline: new Date(Date.now() + 12 * 60 * 60 * 1000)
  },
  {
    customer_id: 'CUST005',
    customer_name: 'Emma Garcia',
    customer_email: 'emma@email.com',
    complaint_text: 'Cannot access my account. Password reset is not working.',
    channel: 'phone',
    category: 'account_issue',
    product: 'website',
    severity: 'medium',
    sentiment: 'neutral',
    status: 'resolved',
    sla_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
    resolution: 'Account access restored. Password reset link sent.'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Agent.deleteMany({});
    await Complaint.deleteMany({});
    console.log('Cleared existing data');

    // Insert agents
    const agents = await Agent.insertMany(sampleAgents);
    console.log(`Inserted ${agents.length} agents`);

    // Insert complaints
    const complaints = await Complaint.insertMany(sampleComplaints);
    console.log(`Inserted ${complaints.length} complaints`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
