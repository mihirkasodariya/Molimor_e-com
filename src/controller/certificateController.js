import { certificateModel, certificateValidation, bannerIdValidation, bannerActiveValidation } from '../model/certificateModel.js';
import response from '../utils/response.js';
import constants from '../utils/constants.js';
const { resStatusCode, resMessage } = constants;

export async function addCertificate(req, res) {
    const { description } = req.body;
    const { error } = certificateValidation.validate({ image: req?.file?.filename, description: description });
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const addCertificate = await certificateModel.create({
            image: req?.file.filename,
            description: description
        });
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CERTIFICATE_ADDED, addCertificate);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getAllCertificate(req, res) {
    try {
        const certificateList = await certificateModel.find({ isActive: true, isDelete: false }).sort({ createdAt: -1 });
        if (!certificateList) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.CERTIFICATE_LIST_EMPTY, []);
        };
        const updatedCertificates = certificateList.map(certificate => ({
            ...certificate._doc,
            image: `/certificate/${certificate.image}`
        }));
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CERTIFICATE_LIST_FETCHED, updatedCertificates);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function adminGetAllCertificate(req, res) {
    try {
        const certificateList = await certificateModel.find({ isDelete: false }).sort({ createdAt: -1 });
        if (!certificateList) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.CERTIFICATE_LIST_EMPTY, []);
        };
        const updatedCertificates = certificateList.map(certificate => ({
            ...certificate._doc,
            image: `/certificate/${certificate.image}`
        }));
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CERTIFICATE_LIST_FETCHED, updatedCertificates);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function deleteCertificateById(req, res) {
    const certificateId = req.params.id;
    const { error } = bannerIdValidation.validate(req.params);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const deleteCertificate = await certificateModel.findByIdAndUpdate(certificateId, { isDelete: true, isActive: false }, { new: true });

        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CERTIFICATE_DELETED, deleteCertificate);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function inActiveCertificateById(req, res) {
    const certificateId = req.params.id;
    const isActive = req.body.isActive;
    req.body.id = certificateId;
    let { error } = bannerActiveValidation.validate(req.body);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const inActiveCertificate = await certificateModel.findByIdAndUpdate(certificateId, { isActive }, { new: true });
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CERTIFICATE_INACTIVATED, inActiveCertificate);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};
