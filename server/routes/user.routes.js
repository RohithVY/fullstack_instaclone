const express = require('express');
const router = express.Router();
const {register, login, uploadData, getData} = require('../controllers/user.controller');
const multer = require('../config/multer.config');
const verifyToken = require("../middleware/user.authenticate");

router.post('/register', register);

router.post('/login', login);

router.post('/post', multer.single('image'), verifyToken, uploadData)

router.get('/get',verifyToken, getData)

module.exports = router