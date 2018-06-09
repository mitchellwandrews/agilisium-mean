const mongoose = require('mongoose');

var SalesData = mongoose.model('SalesData', {
  productId: {
    type: Number,
    required: true
  },
  saleQty: {
    type: Number,
    required: true
  },
  saleRev: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  }
});

module.exports = { SalesData };
