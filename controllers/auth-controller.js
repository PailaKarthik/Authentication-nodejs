const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register controller
const registerUser = async (req, res) => {
  try {
    //extract user info from req body
    const { username, email, password, role } = req.body;

    //check if the email is already exists in our database

    const checkExistingUserWithEmail = await User.findOne({ email: email });
    if (checkExistingUserWithEmail) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please Login !",
      });
    }

    //check if the user is already exists in our database
    const checkExistingUserWithName = await User.findOne({
      username: username,
    });
    if (checkExistingUserWithName) {
      return res.status(400).json({
        success: false,
        message: "User name is already exists change it",
      });
    }

    //hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new user and save in your database
    const newlyCreatedUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "User registered Successfully.",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "User registered failed !!",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error occured !",
    });
  }
};

//login controller
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not Registered with this email!",
      });
    }

    //if the password is correct or not
    const ExistedHashPwd = user.password;
    const checkExistingUserWithPassword = await bcrypt.compare(
      password,
      ExistedHashPwd
    );

    if (!checkExistingUserWithPassword) {
      return res.status(401).json({
        success: false,
        message: "password is incorrect",
      });
    }

    //create user token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );

    res.status(200).json({
      success: true,
      message: "User logged in Successfully.",
      accessToken,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error occured !",
    });
  }
};

//changing password
const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    //extract old and new pwd
    const { oldPassword, newPassword } = req.body;

    //find the current logged in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const checkOldPasswordMatch = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!checkOldPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "old Password is not correct!",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "old password and new password is same. try different !",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = newHashedPassword;
    await user.save();

    res.status(201).json({
      success: true,
      message: "new password updated successfully",
      data: user,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error occured !  Please try again",
    });
  }
};

module.exports = { loginUser, registerUser, changePassword };
