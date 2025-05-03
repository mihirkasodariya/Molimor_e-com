import mongoose, { Schema as _Schema, model } from "mongoose";

const aboutSchema = new _Schema({
  content: String,
}, { timestamps: true });

const aboutUsModel = model('aboutus', aboutSchema);

export default {
  aboutUsModel
};
