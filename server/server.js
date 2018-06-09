require('./config/config.js');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { MasterData } = require('./models/masterdata');
const { SalesData } = require('./models/salesdata');

var app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('hello world!');
});

app.post('/masterdata', (req, res) => {
  var masterdata = new MasterData({
    productId: req.body.productId,
    upc: req.body.upc,
    title: req.body.title,
    artistName: req.body.artistName,
    relDate: req.body.relDate
  });

  masterdata.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/masterdata', (req, res) => {
  MasterData.find({})
  .then((masterdata) => {
    res.send({ masterdata });
  }, (e) => {
    res.status(400).send(e);
  });
});

app.delete('/masterdata/:productId', (req, res) => {
  var id = req.params.productId;

  MasterData.findOneAndRemove({
    productId: id
  }).then((masterdata) => {
    if (!masterdata) {
      return res.status(404).send();
    }

    res.send({ masterdata });
  }, (e) => {
    res.status(400).send();
  });
});

app.post('/salesdata', (req, res) => {
  var salesdata = new SalesData({
    productId: req.body.productId,
    saleQty: req.body.saleQty,
    saleRev: req.body.saleRev,
    unitPrice: req.body.unitPrice
  });

  salesdata.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status.send(400).send(e);
  });
});

app.get('/salesdata/:productId', (req, res) => {
  var id = req.params.productId;

  SalesData.find({
    productId: id
  }).then((salesdata) => {
    if (!salesdata) {
      return res.status(404).send();
    }

    res.send({ salesdata });
  }, (e) => {
    res.status(400).send();
  });
});

app.delete('/salesdata/:productId', (req, res) => {
  var id = req.params.productId;

  SalesData.remove({
    productId: id
  }).then((salesdata) => {
    if (!salesdata) {
      return res.status(404).send();
    }

    res.sendStatus(200);
  }, (e) => {
    res.status(400).send();
  });
});

app.listen(3000, () => {
  console.log('Server on port 3000');
});