# Quick Start Guide

## Option 1: Run with Docker (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Access the application
Frontend: http://localhost:3000
Backend API: http://localhost:3001
AI Engine: http://localhost:5000
```

## Option 2: Run Locally

### Step 1: Start MongoDB
Make sure MongoDB is running on localhost:27017

### Step 2: Start Backend
```bash
cd backend
npm install
npm start
```

### Step 3: Start AI Engine
```bash
cd ai-engine
pip install -r requirements.txt
python app.py
```

### Step 4: Start Frontend
```bash
cd frontend
npm install
npm start
```

### Step 5: Seed Sample Data (Optional)
```bash
cd backend
node seed.js
```

## Testing the Application

1. Open http://localhost:3000
2. Navigate to "Complaints" tab
3. Click "New Complaint" to create a test complaint
4. Watch AI automatically categorize and analyze it
5. Click on any complaint to view details
6. Assign agents, update status, and add responses
7. Check "Analytics" tab for insights

## Sample Test Complaint

```
Customer Name: Test User
Email: test@example.com
Customer ID: TEST001
Channel: Email
Complaint: My payment was deducted twice but I only received one confirmation. Please refund the duplicate charge immediately.
```

Expected AI Analysis:
- Category: billing_issue
- Sentiment: negative
- Severity: high
- Product: payment gateway

## API Testing with cURL

### Create Complaint
```bash
curl -X POST http://localhost:3001/api/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "TEST001",
    "customer_name": "Test User",
    "customer_email": "test@example.com",
    "complaint_text": "Payment issue - need refund",
    "channel": "email"
  }'
```

### Get All Complaints
```bash
curl http://localhost:3001/api/complaints
```

### Get Analytics
```bash
curl http://localhost:3001/api/analytics
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in backend/.env

### AI Service Not Responding
- First run may take time to download models
- Check Python dependencies are installed
- Verify port 5000 is not in use

### Frontend Not Loading
- Clear browser cache
- Check backend is running on port 3001
- Verify CORS is enabled

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/complaint_dashboard
PORT=3001
AI_SERVICE_URL=http://localhost:5000
JWT_SECRET=your_secret_key
```

## Default Ports
- Frontend: 3000
- Backend: 3001
- AI Engine: 5000
- MongoDB: 27017
