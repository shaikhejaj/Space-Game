var express = require('express');
var router = express.Router();






router.get('/gamescreen', function(req, res, next){
  res.render('gamescreen')
});



module.exports = router;

