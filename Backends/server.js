require("dotenv").config();
require("./config/dbcontroller");

const cors = require('cors')
const bodyParser = require("body-parser");
const express = require('express');
// const path = require('path');
const app = express();

const router = require('./routes/index');
app.use(express.json());
app.use(cors())
//  app.use(express.urlencoded({ extended: true }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/uploads", express.static("uploads"));

app.use('/api',router);

app.listen(process.env.PORT, () => {
    console.log("server start ", process.env.PORT);
});