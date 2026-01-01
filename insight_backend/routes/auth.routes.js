const express = require('express');
const authRoutes = express.Router();
const passport = require('passport');


// Google Auth (/auth/google)
authRoutes.get("/google", passport.authenticate("google", {
    scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/gmail.readonly"
    ],
    accessType: "offline",
    prompt: "consent"
}))

// Google Auth Callback (/auth/google/callback)
authRoutes.get("/google/callback", 
    passport.authenticate("google", { failureRedirect: "/auth/google/failure" }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect("http://localhost:5001/profile");
    }
);

// Google Auth Failure (/auth/google/failure)
authRoutes.get("/google/failure", (req, res) => {
    res.send("Failed to authenticate..");
});

authRoutes.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('http://localhost:3000');
  });
});

module.exports = authRoutes;