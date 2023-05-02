require("dotenv").config();
const mongoose = require("mongoose");

const PORT = process.env.PORT;
const URL = process.env.mongoURL;
const secretKey = process.env.myPrecious;

const connection = mongoose.connect(URL);

module.exports = { connection, PORT, secretKey };
