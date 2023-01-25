const multer = require('multer'); // On importe multer

// on définit quel type d'images sont acceptées
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};
// on définit ou sera stocké l'image
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');// on modifie le nom de l'image, on suppr les espaces et les remplaces par un tiret
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);// on ajoute un timestamp pr que l'image soit unique
    }
});

module.exports = multer({ storage: storage }).single('image');