require("dotenv").config()
const express = require("express")
const connectDB = require("./config/db")
const port = process.env.PORT || 8080;
const passport = require("passport")
const session = require("express-session")
const app = express()

const authRoutes = require("./routes/auth.routes")
const emailRoutes = require("./routes/email.routes")
require("./config/passport")(passport) // Configuring passport


connectDB(); //Connecting the DB

app.use(express.json())

// Middleware for session handling
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
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

app.get("/dashboard", (req,res) => {
    res.send("Welcome to your Dashboard")
});

app.get("/profile", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            message: "You are logged in!",
            user: req.user 
        });
    } else {
        res.status(401).json({ message: "Not logged in" });
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

module.exports = {app}