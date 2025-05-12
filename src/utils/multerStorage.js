import multer, { diskStorage } from 'multer';
import { mkdir, existsSync } from "fs";
import { extname, join } from 'path';

const saveUserProfile = diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/userProfile");
    },
    filename: function (req, file, cb) {
        console.log('file.originalname', file.originalname);
        cb(null, Date.now() + '-userProfile-' + file.originalname);
    },
});
const _saveUserProfile = multer({ storage: saveUserProfile });
export { _saveUserProfile as saveUserProfile };


const productImagesStorage = diskStorage({
    destination: function (req, file, cb) {
        const dir = './public/productImages';
        mkdir(dir, { recursive: true }, (error) => cb(error, dir));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-productImage-" + file.originalname);
    },
});

export const productImage = multer({ storage: productImagesStorage });

const excelFileStorage = diskStorage({
    destination: (req, file, cb) => {
        const dir = './public/uploadFile';
        mkdir(dir, { recursive: true }, (err) => cb(err, dir));
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = extname(file.originalname);
        cb(null, `${timestamp}-excel${ext}`);
    },
});

export const uploadExcelFile = multer({ storage: excelFileStorage });

export function getAvailableFileName(dir, baseName, extension) {
    let counter = 1;
    let fileName = `${baseName}.${extension}`;
    let filePath = join(dir, fileName);

    while (existsSync(filePath)) {
        counter++;
        fileName = `${baseName}(${counter}).${extension}`;
        filePath = join(dir, fileName);
    };
    return filePath;
}

const bannerImageStorage = diskStorage({
    destination: function (req, file, cb) {
        const dir = './public/banner';
        mkdir(dir, { recursive: true }, (error) => cb(error, dir));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-banner-" + file.originalname);
    },
});
export const bannerImage = multer({ storage: bannerImageStorage });


const certificateImageStorage = diskStorage({
    destination: function (req, file, cb) {
        const dir = './public/certificate';
        mkdir(dir, { recursive: true }, (error) => cb(error, dir));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-certificate-" + file.originalname);
    },
});
export const certificateImage = multer({ storage: certificateImageStorage });


const mediaStorage = diskStorage({
    destination: function (req, file, cb) {
        const dir = './public/media';
        mkdir(dir, { recursive: true }, (error) => cb(error, dir));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-media-" + file.originalname);
    },
});

export const mediaFile = multer({ storage: mediaStorage });

const marketPlaceStorage = diskStorage({
    destination: function (req, file, cb) {
        const dir = './public/otherStore';
        mkdir(dir, { recursive: true }, (error) => cb(error, dir));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-marketPlace-" + file.originalname);
    },
});

export const marketPlacePhotos = multer({ storage: marketPlaceStorage });

const categoryStorage = diskStorage({
    destination: function (req, file, cb) {
        const dir = './public/category';
        mkdir(dir, { recursive: true }, (error) => cb(error, dir));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-categoryImage-" + file.originalname);
    },
});

export const categoryImage = multer({ storage: categoryStorage });


const instaShopStorage = diskStorage({
    destination: function (req, file, cb) {
        const dir = './public/instaShop';
        mkdir(dir, { recursive: true }, (error) => cb(error, dir));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-instashop-" + file.originalname);
    },
});

export const instaShopImage = multer({ storage: instaShopStorage });

