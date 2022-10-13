const path = require('path')
const multer = require('multer')

let imageStorage = multer.diskStorage({
    destination: function(req, file, cb){
    
        cb(null, 'public/assets/images/upload-images')
    },
    filename: function(req, file, cb){
        console.log(file.fieldname)
        let ext = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + Date.now() + ext)

        console.log('image upload local disc successful')
    } 
}) 
var upload = multer({
    storage: imageStorage,
    fileFilter: (req, file, callback) => {
      let ext = path.extname(file.originalname);
      if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
        return callback(null, false);
      }
      callback(null, true);
    },
  });

module.exports = upload