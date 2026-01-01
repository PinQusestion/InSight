require("dotenv").config()
const express = require("express")
const connectDB = require("./config/db")
const port = process.env.PORT || 8080;
const authRoutes = require("./routes/auth.routes")
const passport = require("passport")
const session = require("express-session")
const app = express()

require("./config/passport")(passport)
connectDB();

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
app.get("/", (req,res) => {
    res.send("Welcome to InSight")
})

app.get("/dashboard", (req,res) => {
    res.send("Welcome to your Dashboard")
})

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

app.get("/test", (req,res) => {
    res.send("Server is up!")
})


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

module.exports = {app}