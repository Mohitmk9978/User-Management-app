require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // body parser for JSON

// Basic root
app.get('/', (req, res) => res.send('User Management API is running'));

// API routes
app.use('/api/users', userRoutes);

// Connect MongoDB and start server
async function start() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/userDB';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();
