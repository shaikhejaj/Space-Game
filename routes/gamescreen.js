var express = require('express');
var router = express.Router();


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// These routes should require the user to log in?
// This file is mounted at /gamescreen so the router.get is relative to /gamescreen
router.get('/', isLoggedIn, function(req, res, next){
  res.render('gamescreen')
});

// To your client, this route is at gamescreen/updatePlayerState
router.put('/updatePlayerState', isLoggedIn, function(req, res, next){
  // Expect to have JSON with player data in
  // As user is logged in, can find their user ID from req.user
  console.log('The current username is ' + req.user.local.username);
  // This is the JSON from the AJAX request
  console.log('The JSON received is ' + JSON.stringify(req.body));

  // For example, shipHealth,
  console.log('The players stats are \n ShipHealth: ' + req.body.shipHealth+'\n credits: '+req.body.credits+'\n Energy: '+req.body.energy);

    var filter = { 'name' : req.user.local.username };
  var update = { $set : { 
  'shipHealth' : req.body.shipHealth,
  'energy' : req.body.energy,
  'credits' : req.body.credits
  }};

  
req.db.collection('users').findOneAndUpdate(filter, update, function(err) {
if (!err){
	console.log("updated userData");
}else{
	console.log("Error updating userData");
}
});//end of update database callback
  // If no errors, and you don't need to send any data back, you can just send a 200 (OK) message.
  res.sendStatus(200);  // End the request.
})


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
