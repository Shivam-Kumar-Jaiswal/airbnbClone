const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET
})  
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wonderlustDev', 
      allowedformat:['png','jpg','jpeg'] // supports promises as well hloo hloo hloo hloo
      },
  });

  module.exports={
    cloudinary,storage
  }