const express = require ('express');
const router = express.Router();
const VerifyData = require('../models/verifydata');
const Perpanjangan = require('../models/perpanjangan');
const ObjectId = require('mongoose').Types.ObjectId;

// connection test
router.get('/test', function(req, res, next){
  res.send({status: "OK"});
});

////////////////////

// get a list of verifydatas from the db
router.get('/verify', function(req, res, next){
  VerifyData.find({
    nik: req.query.nik,
    nrkb: req.query.nrkb
  }).then(function(verifydata){
    res.send(verifydata);
  })
});

// add a new verifydata to the db
router.post('/verify', function(req, res, next){
  VerifyData.create(req.body).then(function(verifydata){
    console.log(verifydata);
    res.send(verifydata);
  }).catch(next);
});

// update a verifydata in the db
router.put('/verify/:id', function(req, res, next){
  VerifyData.findByIdAndUpdate({_id: req.params.id}, req.body).then(function() {
    VerifyData.findOne({_id: req.params.id}).then(function(verifydata){
      res.send(verifydata)
    });
  });
});

// delete a verifydata from the db
router.delete('/verify/:id', function(req, res, next){
  VerifyData.findByIdAndDelete({_id: req.params.id}).then(function(verifydata) {
    res.send(verifydata)
  });
});

////////////////////

// get a list of verifydatas from the db
router.get('/perpanjangan', function(req, res, next){
  Perpanjangan.find({
    nrkb: req.query.nrkb
  }).then(function(perpanjangan){
    res.send(perpanjangan);
  })
});

// add a new verifydata to the db
router.post('/perpanjangan', function(req, res, next){
  Perpanjangan.create(req.body).then(function(perpanjangan){
    console.log(perpanjangan);
    res.send(perpanjangan);
  }).catch(next);
});

// update a verifydata in the db
router.put('/perpanjangan/:id', function(req, res, next){
  Perpanjangan.findByIdAndUpdate({_id: req.params.id}, req.body).then(function() {
    Perpanjangan.findOne({_id: req.params.id}).then(function(perpanjangan){
      res.send(perpanjangan)
    });
  });
});

// delete a verifydata from the db
router.delete('/perpanjangan/:id', function(req, res, next){
  Perpanjangan.findByIdAndDelete({_id: req.params.id}).then(function(perpanjangan) {
    res.send(perpanjangan)
  });
});

/////

router.get('/map/', function(req, res, next){
  let isReqNotEmpty = true;
  console.log();
  isReqNotEmpty = isReqNotEmpty && (typeof req.query.nrkb != "undefined");
  isReqNotEmpty = isReqNotEmpty && (typeof req.query.height != "undefined");
  isReqNotEmpty = isReqNotEmpty && (typeof req.query.width != "undefined");
  if (isReqNotEmpty) {
    res.send({
      nrkb: req.query.nrkb,
      height: req.query.height,
      width: req.query.width,
    });
  } else {
    res.status(422).send({error: "Parameter(s) missing"});
  }

});

module.exports = router;
