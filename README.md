# Unified Customer Complaint Communication Dashboard

An AI-powered complaint management platform that centralizes, analyzes, and resolves customer complaints from multiple channels using NLP and Generative AI.

## Features

- **Multi-Channel Complaint Aggregation**: Collect complaints from email, chat, social media, web forms, and phone
- **AI-Based Categorization**: Automatic classification using NLP (billing, technical, service delay, product defect, account issues)git checkout -b kaivalya
- **Sentiment Analysis**: Detect emotional tone (positive, neutral, negative, highly negative)
- **Duplicate Detection**: Identify related complaints using semantic similarity
- **Gen-AI Response Generation**: Auto-draft responses for support agents
- **SLA Tracking**: Monitor response and resolution times with automatic escalation
- **360° Complaint View**: Complete context with customer details, history, and AI insights
- **Analytics Dashboard**: Trend analysis, root cause identification, and performance metrics

## Technology Stack

- **Frontend**: React.js with CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI/NLP**: Python, Flask, Transformers, Sentence-Transformers
- **Models**: DistilBERT for sentiment analysis, MiniLM for embeddings

## Project Structure

```
KJC HACK/
├── backend/
│   ├── server.js          # Express API server
│   ├── models.js          # MongoDB schemas
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── ComplaintList.js
│   │   │   ├── ComplaintDetail.js
│   │   │   └── Analytics.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── public/
│   └── package.json
└── ai-engine/
    ├── app.py             # Flask AI service
    └── requirements.txt
```

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd backend
npm install
# Update .env with your MongoDB URI
npm start
```

Server runs on http://localhost:3001

### 2. AI Engine Setup

```bash
cd ai-engine
pip install -r requirements.txt
python app.py
```

AI service runs on http://localhost:5000

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:3000

## API Endpoints

### Complaints
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints` - Get all complaints (with filters)
- `GET /api/complaints/:id` - Get complaint details
- `PUT /api/complaints/:id` - Update complaint
- `POST /api/complaints/:id/assign` - Assign agent
- `POST /api/complaints/:id/communicate` - Add message

### Analytics
- `GET /api/analytics` - Get dashboard statistics

### Agents
- `POST /api/agents` - Create agent
- `GET /api/agents` - Get all agents

### AI Service
- `POST /analyze` - Analyze complaint text
- `POST /find-duplicates` - Detect duplicate complaints

## Database Schema

### Complaint
```javascript
{
  customer_id: String,
  customer_name: String,
  customer_email: String,
  complaint_text: String,
  channel: String,
  category: String,
  product: String,
  severity: String,
  sentiment: String,
  status: String,
  assigned_agent: ObjectId,
  sla_deadline: Date,
  resolution: String,
  ai_suggested_response: String
}
```

## AI Capabilities

1. **Automatic Categorization**: Classifies complaints into predefined categories
2. **Sentiment Analysis**: Uses DistilBERT to detect emotional tone
3. **Severity Detection**: Determines urgency based on sentiment and keywords
4. **Product Identification**: Extracts mentioned products/services
5. **Response Generation**: Creates contextual reply templates
6. **Duplicate Detection**: Uses sentence embeddings and cosine similarity

## Usage

1. **Create Complaint**: Click "New Complaint" and fill in customer details
2. **View Dashboard**: See overview statistics and recent complaints
3. **Manage Complaints**: Click any complaint to view details, assign agents, update status
4. **AI Assistance**: View AI-suggested responses and use them as templates
5. **Analytics**: Monitor trends, categories, sentiment distribution, and SLA compliance

## SLA Management

- **Critical**: 4 hours
- **High**: 12 hours
- **Medium/Low**: 24 hours

Automatic escalation when SLA deadline is breached.

## Future Enhancements

- Voice complaint analysis
- AI chatbot for complaint intake
- Predictive complaint forecasting
- Fraud detection integration
- Multilingual support
- Advanced visualization with charts

## Security

- JWT authentication (to be implemented)
- Role-based access control
- Secure API endpoints
- Data encryption
- Audit logs

## License

MIT License

## Contributors

Built for KJC Hackathon
