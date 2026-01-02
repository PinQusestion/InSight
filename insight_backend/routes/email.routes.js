const express = require('express');
const emailRoutes = express.Router();
const mailController = require('../controllers/email.controller');

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).json({ message: "Not authenticated" });
    }
};

emailRoutes.get('/summary', ensureAuthenticated, mailController.getSummary);
emailRoutes.get('/subscriptions', ensureAuthenticated, mailController.getSubscriptions)

module.exports = emailRoutes;