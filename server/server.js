const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config()
const app = express();
const port = process.env.PORT || 5000;
const connectdb = require('./db/connectdb');
const user = require('./routes/user.routes');

connectdb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/user', user);

app.listen(port, () => console.log(`app is running in Port:${port}`))
