const mongoose = require("mongoose");

var departmentScheme = mongoose.Schema({
    name:String,
});

var Departments = mongoose.model("departments", departmentScheme)

module.exports = Departments;