const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    accessToken: {
        type: String
    },
    refreshToken: {
        type: String
    },
    lastSummaryDate: {
        type: Date,
        default: Date.now()
    }
}, {timestamps: true})

module.exports = mongoose.model("User", userSchema)