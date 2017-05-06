var express = require('express');
var router = express.Router();

router.get('/gamescreen', function(req, res, next){
  res.render('gamescreen')
});

//update database
router.put('/updateDatabase', function(req, res, next) {

  var filter = { '_id' : req.body._id };
  var update = { $set : { 'color' : req.body.color }};

  req.db.collection('userData').findOneAndUpdate(filter, update, function(err) {
    if (err) {
      return next(err);
    }
    return res.send({'color' : req.body.color})
  })
});




module.exports = router;

