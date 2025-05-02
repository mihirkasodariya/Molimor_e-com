const { aboutUsModel } = require('../model/aboutModel');

const response = require("../utils/response");

module.exports.addAbout = async (req, res) => {
  try {
    const { content } = req.body;

    let existing = await aboutUsModel.findOne();
    let aboutus;

    if (!existing) {
      aboutus = await aboutUsModel.create({ content });
      return response.success( res, 200, "About Us created successfully", aboutus);
    } else {
      aboutus = await aboutUsModel.findOneAndUpdate({}, { content }, { new: true });
      return response.success( res, 200, "About Us updated successfully", aboutus );
    };
  } catch (error) {
    return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
  };
};


module.exports.getAbout = async (req, res) => {
  try {
    const aboutData = await aboutUsModel.find();
    return response.success( res, 200, "About Us updated successfully", aboutData );
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
};
