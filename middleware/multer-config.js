const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    "image/webp": "webp"

};
const filterImage = (req, file, callback) => {
    if (MIME_TYPES[file.mimetype] !== undefined) {
        return callback(null, true);
    }
    callback(null, false);
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const nameEncode = Buffer.from(file.originalname, "latin1").toString("utf8")
        const name = nameEncode.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage: storage, fileFilter: filterImage }).single('image');