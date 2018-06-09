const mongoose = require('mongoose');

var MasterData = mongoose.model('MasterData', {
  productId: {
    type: Number,
    required: true,
    unique: true
  },
  upc: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  artistName: {
    type: String,
    required: true
  },
  relDate: {
    type: Date,
    required: true
  }
});

module.exports = { MasterData };
