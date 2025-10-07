const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    role: {
        type: String,
        enum: ["Admin", "Client"],
        default: "Client"
    }
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;