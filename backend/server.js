const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/content', require('./routes/content'));
app.use('/api/discussions', require('./routes/discussions'));

// Add sample content route
app.use('/api/sample', require('./routes/sample'));

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/constitution-platform',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.db.databaseName}`);
    await createDefaultAdmin();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('🔧 Please check your MongoDB connection string in .env file');
    console.log('🔗 Current MONGODB_URI:', process.env.MONGODB_URI);
    process.exit(1);
  }
};

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    let adminExists = await User.findOne({ email: 'admin@constitution.gov' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin', 12);
      const admin = new User({
        name: 'System Admin',
        email: 'admin@constitution.gov',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Default admin user created');
      console.log('📧 Email: admin@constitution.gov');
      console.log('🔑 Password: admin');
    } else {
      console.log('✅ Admin user already exists');
      
      // Update admin password to ensure it's correct
      const hashedPassword = await bcrypt.hash('admin', 12);
      await User.updateOne(
        { email: 'admin@constitution.gov' },
        { password: hashedPassword }
      );
      console.log('🔑 Admin password reset to: admin');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

// Connect to database
connectDB();

const PORT = process.env.PORT || 5312;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at: http://localhost:${PORT}/api`);
});