import model from '../model/aboutModel.js';
const { aboutUsModel } = model;
import response from "../utils/response.js";
import constants from '../utils/constants.js';
const { resStatusCode, resMessage } = constants;

export async function addAbout(req, res) {
  try {
    const { content } = req.body;

    let existing = await aboutUsModel.findOne();
    let aboutus;

    if (!existing) {
      aboutus = await aboutUsModel.create({ content });
      return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.ABOUT_US_CREATED, aboutus);
    } else {
      aboutus = await aboutUsModel.findOneAndUpdate({}, { content }, { new: true });
      return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.ABOUT_US_UPDATED, aboutus);
    };
  } catch (error) {
    return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
  };
};


export async function getAbout(req, res) {
  try {
    const aboutData = await aboutUsModel.findOne();
    return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.ABOUT_US_RETRIEVED, aboutData);
  } catch (error) {
    return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
  };
};
