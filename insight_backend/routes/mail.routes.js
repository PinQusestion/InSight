const express = require('express');
const mailRoutes = express.Router();
const mailController = require('../controllers/mail.controller');

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).json({ message: "Not authenticated" });
    }
};

mailRoutes.get('/summary', ensureAuthenticated, mailController.getSummary);
mailRoutes.get('/subscriptions', ensureAuthenticated, mailController.getSubscriptions)

module.exports = mailRoutes;