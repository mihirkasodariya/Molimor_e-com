import model from "../model/contactUsModel.js";
const { contactModel, contactValidation, companyinfoModel, companyinfoValidation } = model;
import response from "../utils/response.js";

export async function addContactUs(req, res) {
  try {
    const { name, email, message, inquiryType, moq } = req.body;

    const { error } = contactValidation.validate(req.body);
    if (error) {
      return response.error(res, 400, error.details[0].message);
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

    return response.success(res, 200, 'Contact form submitted successfully', contact);
  } catch (err) {
    return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
  }
}

export async function getAllCustomerQuerysList(req, res) {
  try {
    const contacts = await contactModel.find().sort({ createdAt: -1 });
    return response.success(res, 200, 'Customer queries fetched successfully.', contacts);

  } catch (err) {
    return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
  };
}


export async function addCompanyinfo(req, res) {
  const { content, address, mobile, email } = req.body;
  const { error } = companyinfoValidation.validate(req.body);
  if (error) {
    return response.error(res, 400, error.details[0].message);
  }

  try {

    const existing = await companyinfoModel.findOne();


    if (!existing) {
      const newCompany = await companyinfoModel.create(req.body);
      return response.success(res, 200, "Company info created successfully", newCompany);
    } else {
      const updatedCompany = await companyinfoModel.findOneAndUpdate({}, req.body, { new: true });

      return response.success(res, 200, "Company info updated successfully", updatedCompany);
    }
  } catch (err) {
    return response.error(res, 500, "Oops! Something went wrong. Our team is looking into it.");
  }
}

export async function getCompanyinfo(req, res) {
  try {
    const companyInfo = await companyinfoModel.findOne();

    if (!companyInfo) {
      return response.success(res, 200, "No company info found");
    }

    return response.success(res, 200, "Company info retrieved successfully", companyInfo);
  } catch (err) {
    return response.error(res, 500, "Oops! Something went wrong. Our team is looking into it.");
  }
}
