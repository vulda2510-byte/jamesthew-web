// src/app.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const apiRoutes = require('./routes');
const healthController = require('./controllers/health.controller');
const notFoundMiddleware = require('./middlewares/notFound.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Configure View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configure Static Files
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View Routes
app.get('/', (req, res) => {
    res.render('home');
});

// API Routes
app.get('/health', healthController.getHealth);
app.use('/api', apiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;