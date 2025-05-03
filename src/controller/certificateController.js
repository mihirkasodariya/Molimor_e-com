import { certificateModel, certificateValidation, bannerIdValidation, bannerActiveValidation } from '../model/certificateModel.js';
import response from '../utils/response.js';

export async function addCertificate(req, res) {
    const { description } = req.body;
    const { error } = certificateValidation.validate({ image: req?.file?.filename, description: description });
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const addCertificate = await certificateModel.create({
            image: req?.file.filename,
            description: description
        });
        return response.success(res, 200, 'Certificate added successfully', addCertificate);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

export async function getAllCertificate(req, res) {
    try {
        const certificateList = await certificateModel.find({ isActive: true, isDelete: false }).sort({ createdAt: -1 });
        if (!certificateList) {
            return response.error(res, 403, 'Certificate List is empty', []);
        };
        const updatedCertificates = certificateList.map(certificate => ({
            ...certificate._doc,
            image: `/certificate/${certificate.image}`
        }));
        return response.success(res, 200, 'Certificate List fetched successfully', updatedCertificates);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

export async function adminGetAllCertificate(req, res) {
    try {
        const certificateList = await certificateModel.find({ isDelete: false }).sort({ createdAt: -1 });
        if (!certificateList) {
            return response.error(res, 403, 'Certificate List is empty', []);
        };
        return response.success(res, 200, 'Certificate List fetched successfully', certificateList);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

export async function deleteCertificateById(req, res) {
    const certificateId = req.params.id;
    const { error } = bannerIdValidation.validate(req.params);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const deleteCertificate = await certificateModel.findByIdAndUpdate(certificateId, { isDelete: true, isActive: false }, { new: true });

        return response.success(res, 200, 'Certificate deleted successfully', deleteCertificate);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

export async function inActiveCertificateById(req, res) {
    const certificateId = req.params.id;
    const isActive = req.body.isActive;
    req.body.id = certificateId;
    let { error } = bannerActiveValidation.validate(req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const inActiveCertificate = await certificateModel.findByIdAndUpdate(certificateId, { isActive }, { new: true });
        return response.success(res, 200, 'Certificate inactivated successfully', inActiveCertificate);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}
