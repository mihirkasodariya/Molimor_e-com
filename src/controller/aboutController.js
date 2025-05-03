import model from '../model/aboutModel.js';
const { aboutUsModel } = model;

import response from "../utils/response.js";

export async function addAbout(req, res) {
  try {
    const { content } = req.body;

    let existing = await aboutUsModel.findOne();
    let aboutus;

    if (!existing) {
      aboutus = await aboutUsModel.create({ content });
      return response.success(res, 200, "About Us created successfully", aboutus);
    } else {
      aboutus = await aboutUsModel.findOneAndUpdate({}, { content }, { new: true });
      return response.success(res, 200, "About Us updated successfully", aboutus);
    };
  } catch (error) {
    return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
  };
}


export async function getAbout(req, res) {
  try {
    const aboutData = await aboutUsModel.find();
    return response.success(res, 200, "About Us updated successfully", aboutData);
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
}
