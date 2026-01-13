require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const port = process.env.PORT || 5000;
const passport = require("passport")
const session = require("express-session")
const app = express()

const authRoutes = require("./routes/auth.routes")
const emailRoutes = require("./routes/email.routes")
require("./config/passport")(passport) // Configuring passport

connectDB(); //Connecting the DB

app.use(express.json())

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL_PROD
    : process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions))

// Middleware for session handling
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}))

// Initialize Passport.js
app.use(passport.initialize())
// Use Passport.js session
app.use(passport.session())

app.use("/auth", authRoutes)
app.use("/email", emailRoutes)

app.get("/", (req,res) => {
    res.send("Welcome to InSight")
});

// Profile endpoint - checks if user is authenticated
app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        googleId: req.user.googleId
      }
    });
  } else {
    return res.status(401).json({ error: "Not authenticated" });
  }
});


app.listen(port, () => {
    console.log(`✅ Server is running at http://localhost:${port}`);
    console.log(`📧 NODE_ENV: ${process.env.NODE_ENV}`);
});

module.exports = {app}