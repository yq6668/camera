const mongoose = require("mongoose");

var medicineScheme = mongoose.Schema({
    id: Number,
    name: String,
    specification: String,
    unit: String,
    place: String,
    price: String,
    num:Number
});

var Medicine = mongoose.model("medicines", medicineScheme)

module.exports = Medicine;
//mongoimport -h localhost:27017 -d medicalCommunity -c medicines D://list.txt