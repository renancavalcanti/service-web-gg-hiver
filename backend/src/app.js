const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const capsuleRoutes = require('./routes/capsuleRoutes');
const testRoutes = require('./routes/testRoutes');

const app = express();

connectDB();

app.use(cors());

app.use(express.json());

app.use('/test', testRoutes);
app.use('/auth', authRoutes);
app.use('/capsules', capsuleRoutes);

module.exports = app;
