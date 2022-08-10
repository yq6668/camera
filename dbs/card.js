const mongoose = require("mongoose");

var cardScheme = mongoose.Schema({
    ID:String,
    name:String,
    phone:String,
    sex:String
});

var Card = mongoose.model("cards", cardScheme)

module.exports = Card;