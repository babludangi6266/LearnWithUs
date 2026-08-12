const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));  

// Routes
app.use('/api/student', require('./routes/authRoutes')); // Student auth (/api/student/login, /api/student/register)
app.use('/api/auth', require('./routes/authRoutes'));    // Legacy auth (/api/auth/login, /api/auth/register)
app.use('/api/admin', require('./routes/phaseRoutes'));
app.use('/api/admin', require('./routes/adminRoutes')); // Admin routes (phases, questions)
app.use('/api/admin', require('./routes/noteRoutes')); // Notes & Languages routes
app.use('/api/student', require('./routes/studentRoutes')); // Student progress and feedback
app.use('/api/community', require('./routes/communityRoutes')); // Developer Community Hub

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
