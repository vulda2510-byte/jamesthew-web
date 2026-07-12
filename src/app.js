// src/app.js
require('dotenv').config();
const express = require('express');
const apiRoutes = require('./routes');
const healthController = require('./controllers/health.controller');
const notFoundMiddleware = require('./middlewares/notFound.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', healthController.getHealth);

app.use('/api', apiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;