const multer = require('multer');
var fs = require("fs");
const path = require('path');

const saveUserProfile = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/userProfile");
    },
    filename: function (req, file, cb) {
        console.log('file.originalname', file.originalname);
        cb(null, Date.now() + '-userProfile-' + file.originalname);
    },
});
module.exports.saveUserProfile = multer({ storage: saveUserProfile });


const productImagesStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './public/productImages';
        fs.mkdir(dir, { recursive: true }, (error) => cb(error, dir));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-productImage-" + file.originalname);
    },
});

module.exports.productImage = multer({ storage: productImagesStorage });

const excelFileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './public/uploadFile';
        fs.mkdir(dir, { recursive: true }, (err) => cb(err, dir));
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `${timestamp}-excel${ext}`);
    },
});

module.exports.uploadExcelFile = multer({ storage: excelFileStorage });

module.exports.getAvailableFileName = (dir, baseName, extension) => {
    let counter = 1;
    let fileName = `${baseName}.${extension}`;
    let filePath = path.join(dir, fileName);

    while (fs.existsSync(filePath)) {
        counter++;
        fileName = `${baseName}(${counter}).${extension}`;
        filePath = path.join(dir, fileName);
    };
    return filePath;
};

const bannerImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './public/banner';
        fs.mkdir(dir, { recursive: true }, (error) => cb(error, dir));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-banner-" + file.originalname);
    },
});
module.exports.bannerImage = multer({ storage: bannerImageStorage });


const certificateImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './public/certificate';
        fs.mkdir(dir, { recursive: true }, (error) => cb(error, dir));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-certificate-" + file.originalname);
    },
});
module.exports.certificateImage = multer({ storage: certificateImageStorage });


const mediaStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './public/media';
        fs.mkdir(dir, { recursive: true }, (error) => cb(error, dir));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-media-" + file.originalname);
    },
});

module.exports.mediaFile = multer({ storage: mediaStorage });