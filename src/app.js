// src/app.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const apiRoutes = require('./routes');
const healthController = require('./controllers/health.controller');
const notFoundMiddleware = require('./middlewares/notFound.middleware');
const errorMiddleware = require('./middlewares/error.middleware');
// Inside src/app.js
const logger = require('./config/logger');
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

// Auth View Routes
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

// Pages View Routes
app.get('/recipes', (req, res) => {
    res.render('recipes');
});

app.get('/recipe-detail', (req, res) => {
    res.render('recipe-detail');
});

app.get('/membership', (req, res) => {
    res.render('membership');
});

app.get('/contests', (req, res) => {
    res.render('contests');
});

app.get('/profile', (req, res) => {
    res.render('profile');
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

// API Routes
app.get('/health', healthController.getHealth);
app.use('/api', apiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;