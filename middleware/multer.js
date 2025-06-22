import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 4
    },
    fileFilter: (req, file, cb) => {
        // Allow image1, image2, image3, image4 fields
        if (['image1', 'image2', 'image3', 'image4'].includes(file.fieldname)) {
            cb(null, true);
        } else {
            cb(new Error('Unexpected field'), false);
        }
    }
});

export default upload;
