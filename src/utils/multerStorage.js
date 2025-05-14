import multer, { diskStorage } from 'multer';
import { mkdir, existsSync } from "fs";
import { extname, join } from 'path';
import path from 'path';
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

// const bannerImageStorage = diskStorage({
//     destination: function (req, file, cb) {
//         const dir = './public/banner';
//         mkdir(dir, { recursive: true }, (error) => cb(error, dir));
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + "-banner-" + file.originalname);
//     },
// });
// export const bannerImage = multer({ storage: bannerImageStorage });

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Only images are allowed (jpeg, png, jpg, webp).'), false);
    }

    cb(null, true);
};

const bannerImageStorage = diskStorage({
    destination: function (req, file, cb) {
        const dir = './public/banner';
        mkdir(dir, { recursive: true }, (error) => cb(error, dir));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-banner-" + file.originalname);
    },
});

export const bannerImage = multer({
    storage: bannerImageStorage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
    fileFilter,
}).single('image');

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
        const dir = './public/marketPlace';
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


const aboutusImagesStorage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/aboutusImage");
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
            const first4Chars = file.originalname.slice(0, 4);
        cb(null, Date.now() + '-aboutusImage' + first4Chars + ext);
    },
});

const aboutusImage = multer({ storage: aboutusImagesStorage });
export const uploadAboutUsImages = aboutusImage.fields([
    { name: 'img', maxCount: 1 },
    { name: 'box1Img', maxCount: 1 },
    { name: 'box2Img', maxCount: 1 },
    { name: 'box3Img', maxCount: 1 },
]);


const emailImagesStorage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/aboutusImage");
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
            const first4Chars = file.originalname.slice(0, 4);
        cb(null, Date.now() + '-aboutusImage' + first4Chars + ext);
    },
});

const emailImage = multer({ storage: emailImagesStorage });
export const uploadEmailImages = emailImage.fields([
    { name: 'image', maxCount: 2 },
    ]);