const Image = require("../models/Image");
const { uploadToCloudinary } = require("../helpers/cloudinary-helper");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

const uploadImageController = async (req, res) => {
  try {
    //check if file is missing in req object
    if (!req.file) {
      return res.status(500).json({
        success: false,
        message: "File is required. Please upload the image",
      });
    }

    //upload to cloudinary
    const { url, public_id } = await uploadToCloudinary(req.file.path);

    //store the image url and public id along with uplaoded user id in the database
    const newlyUploadedImage = await Image.create({
      url,
      publicId: public_id,
      uploadedBy: req.userInfo.userId,
    });

    //delete the file from local storage
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Image uploaded Successfully",
      image: newlyUploadedImage,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try agian",
    });
  }
};

const fetchImagecontroller = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder == "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;
    const pageImages = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (pageImages) {
      res.status(200).json({
        success: true,
        totalImages: totalImages,
        totalPages: totalPages,
        currentPage: page,
        data: pageImages,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try agian",
    });
  }
};

const deleteImageController = async (req, res) => {
  try {
    const getCurrentImagePublicId = req.params.id;
    const userId = req.userInfo.userId;

    const image = await Image.findById(getCurrentImagePublicId);

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "not a valid Image id",
      });
    }

    const userIdWhoUploadedTheImage = image.uploadedBy.toString();
    if (userId !== userIdWhoUploadedTheImage) {
      return res.status(403).json({
        success: false,
        message: "sorry, you are not able to delete others images",
      });
    }

    //delete from cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    //delete from mongodb
    const deletedImageDetails = await Image.findByIdAndDelete(
      getCurrentImagePublicId
    );
    res.status(200).json({
      success: true,
      message: "image deleted successfully",
      data: deletedImageDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try agian",
    });
  }
};

module.exports = {
  uploadImageController,
  fetchImagecontroller,
  deleteImageController,
};
