import model from '../model/aboutModel.js';
const { aboutUsModel } = model;
import response from "../utils/response.js";
import constants from '../utils/constants.js';
const { resStatusCode, resMessage } = constants;

export async function addAbout(req, res) {
  const { p1, p2, url, p3, p4, box1T, box1D, box2T, box2D, box3T, box3D, boxFtr, p5, p6, p7, p8
  } = req.body;
  const { img, box1Img, box2Img, box3Img } = req.files;
  console.log('box1Img', req.files)
  try {
    let existing = await aboutUsModel.findOne();
    let aboutus;

    if (!existing) {
      aboutus = await aboutUsModel.create({
        p1, p2, img: img?.[0]?.filename,
        url, p3, p4, box1Img: box1Img?.[0]?.filename,
        box1T, box1D, box2Img: box2Img?.[0]?.filename,
        box2T, box2D, box3Img: box3Img?.[0]?.filename,
        box3T, box3D, boxFtr, p5, p6, p7, p8
      });
      return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.ABOUT_US_CREATED, aboutus);
    } else {
      aboutus = await aboutUsModel.findOneAndUpdate({}, {
        p1, p2, img: img?.[0]?.filename,
        url, p3, p4, box1Img: box1Img?.[0]?.filename,
        box1T, box1D, box2Img: box2Img?.[0]?.filename,
        box2T, box2D, box3Img: box3Img?.[0]?.filename,
        box3T, box3D, boxFtr, p5, p6, p7, p8
      }, { new: true });
      return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.ABOUT_US_UPDATED, aboutus);
    };
  } catch (error) {
    return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, error);
  };
};


export async function getAbout(req, res) {
  try {
    const aboutData = await aboutUsModel.findOne();

    if (!aboutData) {
      return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.ABOUT_US_RETRIEVED, {});
    }
    const modifiedData = {
      ...aboutData._doc,
      img: aboutData.img ? `/aboutusImage/${aboutData?.img}` : "",
      box1Img: aboutData?.box1Img ? `/aboutusImage/${aboutData?.box1Img}` : "",
      box2Img: aboutData?.box2Img ? `/aboutusImage/${aboutData?.box2Img}` : "",
      box3Img: aboutData?.box3Img ? `/aboutusImage/${aboutData?.box3Img}` : "",
    };

    return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.ABOUT_US_RETRIEVED, modifiedData);
  } catch (error) {
    return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
  }
}

