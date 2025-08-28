const cloudinary =require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { param } = require('./routes/listings');
const { format } = require('path');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRATE

});


const storage =new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'BIG_PROJECT_dev',
        allowedFormats:["png","jpg","jpeg"]

    },
});

module.exports  ={
    cloudinary,
    storage
}