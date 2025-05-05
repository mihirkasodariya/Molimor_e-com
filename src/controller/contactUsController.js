import model from "../model/contactUsModel.js";
const { contactModel, contactValidation, companyinfoModel, companyinfoValidation } = model;
import response from "../utils/response.js";
import constants from '../utils/constants.js';
const { resStatusCode, resMessage } = constants;

export async function addContactUs(req, res) {
  try {
    const { name, email, message, inquiryType, moq } = req.body;

    const { error } = contactValidation.validate(req.body);
    if (error) {
      return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };

    const contact = new contactModel({
      userId: req.user.id,
      name,
      email,
      message,
      inquiryType,
      moq,
    });
    await contact.save();

    return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CONTACT_US_ADDED, contact);
  } catch (err) {
    return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
  };
};

export async function getAllCustomerQuerysList(req, res) {
  try {
    const contacts = await contactModel.find().sort({ createdAt: -1 });
    return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CUSTOMER_QUERIES_FETCHED, contacts);
  } catch (err) {
    return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
  };
};


export async function addCompanyinfo(req, res) {
  const { content, address, mobile, email } = req.body;
  const { error } = companyinfoValidation.validate(req.body);
  if (error) {
    return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
  };
  try {
    const existing = await companyinfoModel.findOne();

    if (!existing) {
      const newCompany = await companyinfoModel.create(req.body);
      return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.COMPANY_INFO_ADDED, newCompany);
    } else {
      const updatedCompany = await companyinfoModel.findOneAndUpdate({}, req.body, { new: true });

      return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.COMPANY_INFO_UPDATED, updatedCompany);
    };
  } catch (err) {
    return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
  };
};

export async function getCompanyinfo(req, res) {
  try {
    const companyInfo = await companyinfoModel.findOne();

    return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.COMPANY_INFO_RETRIEVED, companyInfo);
  } catch (err) {
    return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
  };
};