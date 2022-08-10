const mongoose = require("mongoose");

var userScheme = mongoose.Schema({
    username: String,
    password: String,
    current: String,
    department: String,
    sessionId: String,
});

var User = mongoose.model("users", userScheme)

module.exports = User;