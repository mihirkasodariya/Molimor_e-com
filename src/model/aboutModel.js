import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const aboutSchema = new Schema({
  content:  {type: String},
}, { timestamps: true });

const aboutUsModel = model('aboutus', aboutSchema);

export default {
  aboutUsModel
};
