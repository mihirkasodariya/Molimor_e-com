const mongoose = require("mongoose");
const { Schema } = mongoose;

const aboutSchema = new mongoose.Schema({
  content: String,
}, {timestamps : true});

const aboutUsModel = mongoose.model('aboutus', aboutSchema);

module.exports = {
  aboutUsModel
};
