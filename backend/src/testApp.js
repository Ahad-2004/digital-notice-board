// Small wrapper to start the express app for tests
const express = require('express');
const noticesRouter = require('./routes/notices');

const app = express();
app.use(express.json());
app.use('/api/notices', noticesRouter);
module.exports = app;
