import mongoose, { Schema, model } from 'mongoose';
import Joi from 'joi';

const aboutSchema = new Schema(
  {
    p1: { type: String, default: "" },
    p2: { type: String, default: "" },
    img: { type: String, default: "" },
    url: { type: String, default: "" },
    p3: { type: String, default: "" },
    p4: { type: String, default: "" },
    box1Img: { type: String, default: "" },
    box1T: { type: String, default: "" },
    box1D: { type: String, default: "" },
    box2Img: { type: String, default: "" },
    box2T: { type: String, default: "" },
    box2D: { type: String, default: "" },
    box3Img: { type: String, default: "" },
    box3T: { type: String, default: "" },
    box3D: { type: String, default: "" },
    boxFtr: { type: String, default: "" },
    p5: { type: String, default: "" },
    p6: { type: String, default: "" },
    p7: { type: String, default: "" },
    p8: { type: String, default: "" }
  },
  { timestamps: true }
);

const aboutUsModel = model('aboutus', aboutSchema);

const aboutUsValidation = Joi.object({
  p1: Joi.string().allow('').label('Paragraph 1'),
  p2: Joi.string().allow('').label('Paragraph 2'),
  img: Joi.string().allow('').label('Image URL'),
  url: Joi.string().uri().allow('').label('Video URL'),
  p3: Joi.string().allow('').label('Paragraph 3'),
  p4: Joi.string().allow('').label('Paragraph 4'),
  box1Img: Joi.string().allow('').label('Box 1 Image URL'),
  box1T: Joi.string().allow('').label('Box 1 Title'),
  box1D: Joi.string().allow('').label('Box 1 Description'),
  box2Img: Joi.string().allow('').label('Box 2 Image URL'),
  box2T: Joi.string().allow('').label('Box 2 Title'),
  box2D: Joi.string().allow('').label('Box 2 Description'),
  box3Img: Joi.string().allow('').label('Box 3 Image URL'),
  box3T: Joi.string().allow('').label('Box 3 Title'),
  box3D: Joi.string().allow('').label('Box 3 Description'),
  boxFtr: Joi.string().allow('').label('Box Footer'),
  p5: Joi.string().allow('').label('Paragraph 5'),
  p6: Joi.string().allow('').label('Paragraph 6'),
  p7: Joi.string().allow('').label('Paragraph 7'),
  p8: Joi.string().allow('').label('Paragraph 8'),
});


export default {
  aboutUsModel,
  aboutUsValidation
};