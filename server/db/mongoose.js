const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI)
  .then(connection => {

  })
  .catch(err => {
    console.log(err.message);
  });

module.exports = { mongoose };
