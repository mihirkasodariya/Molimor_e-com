const multer = require('multer');
var fs = require("fs");

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
