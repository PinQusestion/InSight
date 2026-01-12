const express = require('express');
const emailRoutes = express.Router();
const emailController = require('../controllers/email.controller');
const authMiddleware = require('../middlewares/authMiddleware');

emailRoutes.get('/summary', authMiddleware, emailController.getSummary);
emailRoutes.get('/subscriptions', authMiddleware, emailController.getSubscriptions);

module.exports = emailRoutes;