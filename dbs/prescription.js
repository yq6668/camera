const mongoose = require("mongoose");

var prescriptionScheme = mongoose.Schema({
    id: String,
    time: String,
    notes: String,
    medicines: Array,
    price: Number,
    state:Boolean,
});

var Prescription = mongoose.model("prescriptions", prescriptionScheme)

module.exports = Prescription;