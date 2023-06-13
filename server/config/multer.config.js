const multer = require('multer');

const DIR = './uploads'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, DIR)
    }
})

const filter = (req, file, cb ) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === 'image/png' || file.mimetype === "image/jpg"){
        cb(null, true)
    } else {
        cb({message: "Unsupported file format"}, false)
    }
}

const upload = multer({
    storage:storage, 
    limits:{fileSize: 1024 * 1024}, 
    fileFilter: filter
})

module.exports = upload