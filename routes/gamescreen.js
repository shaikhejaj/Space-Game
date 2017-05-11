var express = require('express');
var router = express.Router();

var User = require('../models/user');


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
  console.log('The players stats are \n ShipHealth: ' + req.body.shipHealth+'\n credits: '+req.body.credits+'\n Energy: '+req.body.energy)+"\n shipMaxHealth: "+req.body.shipMaxHealth;

    
  var user = req.user;
  user.shipHealth = req.body.shipHealth;
  user.shipMaxHealth = req.body.shipMaxHealth;
  user.enginesScore = req.body.enginesScore;
  user.weaponsScore = req.body.weaponsScore;
  user.shieldsScore = req.body.shieldsScore;
  user.sensorsScore = req.body.sensorsScore;
  user.energy = req.body.energy;
  user.credits = req.body.credits;   
  user.save();


  



user.save(function(err, newuser){
if (!err){
	console.log("updated userData \n"+newuser);
}else{
	console.log("Error updating userData");
}
});//end of update database callback
  // If no errors, and you don't need to send any data back, you can just send a 200 (OK) message.
  res.sendStatus(200);  // End the request.
})



module.exports = router;
