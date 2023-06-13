const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/user.model");
const postsModel = require("../models/posts.model");
const uid = require("../middleware/uid");
const saltRounds = 10;
const cloudinary = require("../config/cloudinary.config");
const fs = require("fs");

const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const newId = uid();
  const emailCheck = await userModel.findOne({ email: email });
  //   console.log(emailCheck);
  if (emailCheck) {
    res.status(403);
    return res.json({
      success: false,
      message: "User already exists",
    });
  }

  await bcrypt
    .hash(password, saltRounds)
    .then(async (hash) => {
      const user = new userModel({
        id: newId,
        email: email,
        password: hash,
      });
      await user.save();
    })
    .then((response) => {
      res.json({
        status: 201,
        success: true,
        response: response,
        message: "User created successfully",
      });
    })
    .catch((err) =>
      res.json({
        status: 412,
        success: false,
        message: "Unable to insert new user",
        response: err,
      })
    );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // let currentUser;
  await userModel.findOne({ email }).then(async (user) => {
    if (!user || user.id) {
      res.status(404);
      res.json({
        status: 404,
        success: false,
        message: "User Doesn't exist please register",
      });
    }
    const data = user.id;
    return await bcrypt
      .compare(req.body.password, user.password)
      .then(async () => {
        const token = jwt.sign({ email, data }, process.env.JWT_SECRET, {
          expiresIn: "3h",
        });
        return token;
      })
      .then((token) => {
        res.status(201);
        res.json({
          status: 201,
          success: true,
          message: "User logged in successfully",
          token: token,
          data: user,
        });
      })
      .catch((err) => {
        res.status(404);
        res.json({
          status: 404,
          success: false,
          message: "User not logged in Successfully",
          error: err.message,
        });
      });
  });
});

const uploadData = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { title, description } = req.body;

  const userExists = await userModel.exists({ id: userId });
  if (!userExists) {
    res.status(403).json({
      success: false,
      message: `User doesn't have permission to post data`,
    });
    return;
  }

  const file = req.file;
  if (!file) {
    res.status(400).json({
      success: false,
      message: "Image file is missing",
    });
    return;
  }

  const uploader = async (path) => await cloudinary.uploads(path, "Image");
  let uploadedImageUrl;
  try {
    uploadedImageUrl = await uploader(file.path);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error uploading image`,
      error: err.message,
    });
    return;
  }

  try {
    const newPost = new postsModel({
      id: userId,
      title: title,
      image: uploadedImageUrl.url,
      description: description,
    });

    const savedPost = await newPost.save();
    try {
      // Delete the uploaded file locally
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error("Error deleting the file:", err);
        }
      });

      res.status(201).json({
        success: true,
        message: `Post is uploaded`,
        data: savedPost,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: `Error in posting data`,
        error: err.message,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error in posting data`,
      error: err.message,
    });
  }
});

const getData = asyncHandler(async (req, res) => {
  const userId = req.userId;
  try {
    await userModel
      .find({ id: userId })
      .then(async (user) => {
        if (user.length === 0) {
          return res.status(404).json({
            success: false,
            message: `user doesn't exist`,
          });
        }
        const retrievedPosts = await postsModel.find({ id: userId });
        res.status(201).json({
          success: true,
          message: `posts were retrieved`,
          data: retrievedPosts,
        });
      })
      .catch((error) => {
        res.status(404).json({
          success: false,
          message: `Error in retrieving the data. Error : ${error.message}`,
        });
      });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: `Error in retrieving the data. Error : ${error.message}`,
    });
  }
});

module.exports = {
  register,
  login,
  uploadData,
  getData,
};
