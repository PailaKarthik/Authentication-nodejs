const express = require("express");
const adminMiddleware = require("../middlewares/admin-middleware");
const authMiddleware = require("../middlewares/authmiddleware");
const uploadMiddleware = require("../middlewares/upload-middleware");
const {
  uploadImageController,
  fetchImagecontroller,
  deleteImageController
} = require("../controllers/image-controller");

const router = express.Router();

//upload the image
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  uploadImageController
);

//to get all the images - route
router.get("/get", authMiddleware, fetchImagecontroller);

// delete image - route
router.delete('/delete/:id',authMiddleware, adminMiddleware,deleteImageController)

module.exports = router;
