from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import numpy as np

app = Flask(__name__)
CORS(app)

# Complaint categories with keywords
CATEGORIES = {
    'billing_issue': ['payment', 'charge', 'bill', 'invoice', 'refund', 'deducted', 'transaction', 'money', 'amount'],
    'technical_issue': ['error', 'bug', 'crash', 'not working', 'broken', 'failed', 'issue', 'problem', 'glitch'],
    'service_delay': ['delay', 'late', 'slow', 'waiting', 'pending', 'not received', 'still waiting'],
    'product_defect': ['defect', 'damaged', 'broken', 'quality', 'faulty', 'defective'],
    'account_issue': ['account', 'login', 'password', 'access', 'locked', 'username']
}

PRODUCTS = ['payment gateway', 'mobile app', 'website', 'customer service', 'delivery', 'product']

NEGATIVE_WORDS = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'angry', 'frustrated', 'disappointed', 'unacceptable']
POSITIVE_WORDS = ['good', 'great', 'excellent', 'happy', 'satisfied', 'thank', 'appreciate']
URGENT_WORDS = ['urgent', 'immediately', 'asap', 'critical', 'emergency', 'now']

def categorize_complaint(text):
    text_lower = text.lower()
    scores = {}
    for category, keywords in CATEGORIES.items():
        score = sum(1 for keyword in keywords if keyword in text_lower)
        scores[category] = score
    
    best_category = max(scores, key=scores.get) if max(scores.values()) > 0 else 'other'
    return best_category

def detect_product(text):
    text_lower = text.lower()
    for product in PRODUCTS:
        if product in text_lower:
            return product
    return 'general'

def analyze_sentiment(text):
    text_lower = text.lower()
    
    negative_count = sum(1 for word in NEGATIVE_WORDS if word in text_lower)
    positive_count = sum(1 for word in POSITIVE_WORDS if word in text_lower)
    
    if negative_count >= 3:
        return 'highly_negative'
    elif negative_count > positive_count:
        return 'negative'
    elif positive_count > negative_count:
        return 'positive'
    else:
        return 'neutral'

def determine_severity(sentiment, text):
    text_lower = text.lower()
    
    if sentiment == 'highly_negative' or any(word in text_lower for word in URGENT_WORDS):
        return 'critical'
    elif sentiment == 'negative':
        return 'high'
    else:
        return 'medium'

def generate_response(category, text):
    templates = {
        'billing_issue': "We apologize for the inconvenience with your billing. Our team is reviewing your account and will resolve this within 3-5 business days. You will receive a confirmation once processed.",
        'technical_issue': "Thank you for reporting this technical issue. Our engineering team has been notified and is working on a fix. We'll update you on the progress shortly.",
        'service_delay': "We sincerely apologize for the delay. We understand your frustration and are prioritizing your request. Our team will expedite the process and keep you informed.",
        'product_defect': "We're sorry to hear about the product issue. We take quality seriously. Please share your order details, and we'll arrange a replacement or refund immediately.",
        'account_issue': "We understand account access is critical. Our support team will assist you in recovering access. Please verify your identity, and we'll resolve this promptly."
    }
    return templates.get(category, "Thank you for contacting us. Our team is reviewing your complaint and will respond within 24 hours.")

@app.route('/analyze', methods=['POST'])
def analyze_complaint():
    try:
        data = request.json
        text = data.get('text', '')
        
        category = categorize_complaint(text)
        sentiment = analyze_sentiment(text)
        severity = determine_severity(sentiment, text)
        product = detect_product(text)
        suggested_response = generate_response(category, text)
        
        return jsonify({
            'category': category,
            'sentiment': sentiment,
            'severity': severity,
            'product': product,
            'suggested_response': suggested_response
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/find-duplicates', methods=['POST'])
def find_duplicates():
    try:
        data = request.json
        target_text = data.get('text', '')
        complaint_texts = data.get('complaints', [])
        
        if not complaint_texts:
            return jsonify({'duplicates': []})
        
        all_texts = [target_text] + complaint_texts
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        
        similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])[0]
        duplicates = [
            {'index': i, 'similarity': float(sim)}
            for i, sim in enumerate(similarities) if sim > 0.75
        ]
        
        return jsonify({'duplicates': duplicates})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
