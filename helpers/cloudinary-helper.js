
const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async(filePath) => {
    try{
        const result = await cloudinary.uploader.upload(filePath);
        return {
            url : result.secure_url,
            public_id : result.public_id,
        }
    }
    catch(e){
        console.error('Error while uploadin to cloudinary', error);
        throw new Error('Error while uploadin to cloudinary');
    }
};

module.exports = {uploadToCloudinary}