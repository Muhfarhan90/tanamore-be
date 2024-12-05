const multer = require('multer');

// Konfigurasi multer
const storage = multer.memoryStorage(); // Menyimpan file di memori untuk analisis cepat
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Maksimum 1MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
});

module.exports = upload;
