const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'EventHub Backend is working!' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Test routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Auth routes are connected!' });
});

app.get('/api/events/test', (req, res) => {
  res.json({ message: 'Events routes are connected!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventhub')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
// Add after other routes
app.use('/api/registrations', require('./routes/registrations'));

// Test route
app.get('/api/registrations/test', (req, res) => {
  res.json({ message: 'Registrations routes are connected!' });
});
// const cors = require('cors');

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // Your React app URL
  credentials: true
}));