const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://mandrews:K3I5pxfyvCx0mOPl@cluster0-shard-00-00-npikj.mongodb.net:27017,cluster0-shard-00-01-npikj.mongodb.net:27017,cluster0-shard-00-02-npikj.mongodb.net:27017/ProductMasterSalesData?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin")
  .then(connection => {

  })
  .catch(err => {
    console.log(err.message);
  });

module.exports = { mongoose };
