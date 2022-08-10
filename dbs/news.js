const mongoose = require("mongoose");

var newsScheme = mongoose.Schema({
    title:String,
    name:String,
    time:String,
    content:String
});

var News = mongoose.model("news", newsScheme)

module.exports = News;