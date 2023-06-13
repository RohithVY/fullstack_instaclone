const express = require('express');
const router = express.Router();
const {register, login, uploadData, getData} = require('../controllers/user.controller');
const multer = require('../config/multer.config');
const verifyToken = require("../middleware/user.authenticate");

route.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
})

router.post('/register', register);

router.post('/login', login);

router.post('/post', multer.single('image'), verifyToken, uploadData)

router.get('/get',verifyToken, getData)

router.get('/',(req, res) => {
    res.send('app is accessing get route')
})


module.exports = router