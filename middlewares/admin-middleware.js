const isAdminUser = (req, res, next) => {
  if (req.userInfo.role !== "admin") {
    res.status(500).json({
      success: false,
      message: "This is only accessible to Admin Users !",
    });
  }

  next();
};

module.exports = isAdminUser;
