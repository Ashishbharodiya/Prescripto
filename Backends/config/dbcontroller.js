const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL_ATLAS)
  .then(() => console.log('Connected!'))
  .catch((err) => console.log('Error', err));