//initialize document variables
var audio = new Audio();
var canvas = document.getElementById("canvas");

var actionLog=document.getElementById("actionLog");
var context = canvas.getContext("2d");
var infoArea=document.getElementById("info");
var currentInfoArea=document.getElementById("currentInfo");

var goButton = document.getElementById("goButton");
goButton.addEventListener('click', travel);
var buyEnergyInput = document.getElementById("howMuchEnergyToBuy");
var buyEnergyButton=document.getElementById("buyEnergyButton");
buyEnergyButton.addEventListener('click', buyEnergy);
var buyRepairInput = document.getElementById("howMuchRepairToBuy");
var buyRepairButton=document.getElementById("buyRepairButton");
buyRepairButton.addEventListener('click', buyRepair);

//will set to a location later in script
var selectedLocation=null;//same here
var mx=0;//mouse x variable
var my=0;//mouse y variable


var all_locations=[];//init empty array for later use


//add listener to track mouse movement across canvas
canvas.addEventListener("mousemove", mousePos);
function mousePos()
{
	mx = event.offsetX;
    my = event.offsetY;   //offsetX, offsetY, may not work in older browsers, especially Firefox

//not necessary but here if I want it later
	//document.getElementById("coordinates").innerHTML="X:  "+ mx+", Y:  "+my;

    
}

// what happens when click on canvas

canvas.addEventListener('click', showInfo);

//Locations object constructor
var Location = function(n, description, link, x, y, color, energyCost, repairCost) {
  this.name = n;
this.x=x;//x coordinate on canvas
this.y=y;//y coordinate on canvas
this.description=description;
this.link=link;//Wikipedia link
this.color=color;//color of circle on canvas
this.energyCost=energyCost;//cost to refuel at location
this.repairCost=repairCost;//cost per point of ship health repaired at this location
drawCircle(this.x, this.y, 5, color);// draw this location's circle on the canvas
  
  all_locations.push(this); //add newly created location object to array
  
};

//initialize all locations
var Sol = new Location("Sol System", "Human home system. Home to human-kind. Breathable atmosphere.", "https://en.wikipedia.org/wiki/Sun", canvas.width/2, canvas.height/2, "blue", 2, 1);
var Alpha = new Location("Alpha Centauri System", "Nearest star system to Earth. Consists of three stars, Alpha, Beta, and Proxima. Hosts Moderately sized trading outpost.", "https://en.wikipedia.org/wiki/Alpha_Centauri", canvas.width/2+30, canvas.height/2+30, "red", 4, 2);
var Wolf=new Location("Wolf 359", "Red dwarf, part of the Leo constellation. A small outpost can be found here for trading.", "https://en.wikipedia.org/wiki/Wolf_359", canvas.width/2-55, canvas.height/2-55, "orange", 5, 3); 
var Tatooine =new Location("Tatooine", "A desert planet at the edge of the outer rim. You'll never find a more wretched hive of scum and villainy anywhere in the galaxy.", "https://en.wikipedia.org/wiki/Tatooine", canvas.width/2-100, canvas.height/2+155, "yellow", 7, 5); 
var Station =new Location("Outpost 1337", "A space station in deep space. Resources are scarce out this far and the unknown is all-consuming. Many brave souls who venture out this far see the edge of the universe and are driven mad by the endless nothingness. ", "https://en.wikipedia.org/wiki/Observable_universe", canvas.width/2, canvas.height/2+240, "white", 12, 8); 

selectedLocation=Sol;// now var is not null
var currentLocation=Sol;//same here
var Ship=function(n, x, y)
{
this.name=n;
//set starting location of ship
this.x=x;
this.y=y;

}


//create ship object
var ship = new Ship("Ship", Sol.x, Sol.y);
//set text to indicate location of ship on map
context.font = "12px Arial";
context.fillStyle="white";
context.fillText("You are here", ship.x+10, ship.y);  



//set initial HTML of the info area
infoArea.innerHTML="<h3>"+Sol.name+"</h3><br>"+Sol.description+"<br> <a href="+Sol.link+"> Go to Wikipedia page </a>";

function showInfo()
{
var clickBox=10;//detection zone for clicking
var l=null;//init l variable (location)
	//loop through all locations
for (var i=0; i<all_locations.length; i++)
{
	//if click on location
if (mx > all_locations[i].x-clickBox && mx < all_locations[i].x+clickBox)
if (my > all_locations[i].y-clickBox && my < all_locations[i].y+clickBox)

{
//play sound if click on valid location on canvas
audio.src="sounds/beep.wav";
audio.play();
l=all_locations[i];//set 'l' to this iteration's index in array
selectedLocation=l;//set to l so selection box shows here
//change the text in HTML to show this location's info
infoArea.innerHTML="<h3>"+l.name+"</h3><br>"+l.description+"<br>Distance from current position: "+parseInt(getDistance(ship.x, ship.y, l.x, l.y))+" parsecs"+
"<br> Cost to refuel: "+parseInt(l.energyCost)+" credits per unit"+"<br> Cost per points of repair: "+parseInt(l.repairCost)+"<br> <a href="+l.link+"> Go to Wikipedia page </a>";


}


}
redrawCanvas();	// things have changed so need to update canvas
}
//initialize ship variables
var credits=100;
var creditsDisplayArea=document.getElementById("creditsTotal");
var shipHealth=100;
var shipMaxHealth=100;
var energy=1000;
var enginesScore=100;
var sensorsScore=100;
var weaponsScore=100;
var shieldsScore =100;
var weaponsModifiedElement=document.getElementById("weaponsModifiedRating");
var enginesModifiedElement=document.getElementById("enginesModifiedRating");
var shieldsModifiedElement=document.getElementById("shieldsModifiedRating");
var sensorsModifiedElement=document.getElementById("sensorsModifiedRating");
var energyTotalDisplayArea=document.getElementById("displayTotalEnergyValue");
var energyAvailableDisplayArea = document.getElementById("displayAvailableEnergyValue");
var displayShipHealthElement = document.getElementById("displayHealth");
var displayEnginesValue=document.getElementById("displayEnginesValue");
var enginesPercent = 50;
var weaponsPercent=50;
var shieldsPercent=50;
var sensorsPercent=50;

enginesModifiedElement.innerHTML=enginesScore*(enginesPercent/100);
weaponsModifiedElement.innerHTML=weaponsScore*(weaponsPercent/100);
shieldsModifiedElement.innerHTML=shieldsScore*(shieldsPercent/100);
sensorsModifiedElement.innerHTML=sensorsScore*(sensorsPercent/100);
//first update to set everything up
updateValues();

//called on slider value change
function showEnginesValue(newValue)
{
	document.getElementById("enginesDisplayValue").innerHTML=newValue;
	enginesPercent=newValue;
	
	updateValues();
}

//called on slider value change

function showWeaponsValue(newValue)
{
	document.getElementById("weaponsDisplayValue").innerHTML=newValue;
	weaponsPercent=newValue;
	updateValues();

}
//called on slider value change

function showShieldsValue(newValue)
{
	document.getElementById("shieldsDisplayValue").innerHTML=newValue;
	shieldsPercent=newValue;
		updateValues();
}

//called on slider value change

function showSensorsValue(newValue)
{
	document.getElementById("sensorsDisplayValue").innerHTML=newValue;
	sensorsPercent=newValue;
		updateValues();
}

//this method updates all the html to reflect any changes to ship values  
function updateValues()
{
displayShipHealthElement.innerHTML= "Ship Health:  "+shipHealth+" / "+shipMaxHealth;
localStorage.shipHealth=shipHealth;
localStorage.shipMaxHealth=shipMaxHealth;
creditsDisplayArea.innerHTML="Total Credits:  "+parseInt(
credits);
localStorage.credits=credits;
//if scores change, update their new values in the document
document.getElementById("enginesRating").innerHTML=enginesScore;
document.getElementById("weaponsRating").innerHTML=weaponsScore;
document.getElementById("shieldsRating").innerHTML=shieldsScore;
document.getElementById("sensorsRating").innerHTML=sensorsScore;
localStorage.weaponsScore=weaponsScore;
localStorage.EnginesScore=enginesScore;
localStorage.shieldsScore=shieldsScore;
localStorage.sensorsScore=sensorsScore;

//update the modified system values
enginesModifiedElement.innerHTML=enginesScore*(enginesPercent/100);
weaponsModifiedElement.innerHTML=weaponsScore*(weaponsPercent/100);
shieldsModifiedElement.innerHTML=shieldsScore*(shieldsPercent/100);
sensorsModifiedElement.innerHTML=sensorsScore*(sensorsPercent/100);


currentInfoArea.innerHTML="<h3>"+currentLocation.name+"</h3><br>"+currentLocation.description+"<br>Distance from current position: "+parseInt(getDistance(ship.x, ship.y, currentLocation.x, currentLocation.y))+" parsecs"+
"<br> Cost to refuel: "+parseInt(currentLocation.energyCost)+" credits per unit"+"<br> Cost per points of repair: "+parseInt(currentLocation.repairCost)+"<br> <a href="+currentLocation.link+"> Go to Wikipedia page </a>";

localStorage.energy=energy;
localStorage.maxEnergy=maxEnergy;
energyTotalDisplayArea.innerHTML= "Total Energy to be consumed:  "+getTotalEnergyUse();
energyAvailableDisplayArea.innerHTML="Available Energy: "+energy;
}

//calculates all slider values and system scores for total energy value
//returns integer of total energy usage
function getTotalEnergyUse()
{
var total=0;
total+=parseInt(enginesModifiedElement.innerHTML);
total+=parseInt(weaponsModifiedElement.innerHTML);
total+=parseInt(shieldsModifiedElement.innerHTML);
total+=parseInt(sensorsModifiedElement.innerHTML);



return total;
}




// used to draw circles, mainly for locations
function drawCircle(x,y, radius,color)
{
context.beginPath();
context.arc(x, y,radius,0,2*Math.PI);
context.fillStyle=color;
context.fill();

	
}

//Use Pythagorian theorem to calculate distances between given points
//returns integer of distance between two points
function getDistance(x1,y1,x2,y2)
{
	var a = x1 - x2;
var b = y1 - y2;

var c = Math.sqrt( a*a + b*b );
c/=3// scale down   by 1/3
return c;
}
//called on set course button click
function travel()
{

var distance = getDistance(ship.x,ship.y,selectedLocation.x,selectedLocation.y);
var energyConsumption = Math.round(distance*3);
	
	//check if already at this destination
	if (distance>0)
	{
		var answer=confirm("Are you sure you want to set a course for "+selectedLocation.name+"? \n This trip will take "+energyConsumption+" units of your energy reserves plus an additional "+parseInt(getTotalEnergyUse())+" for a total of "+parseInt(getTotalEnergyUse()+energyConsumption)+" units of energy.");
		//check have enough energy to make trip
		if (energy >= (getTotalEnergyUse()+energyConsumption))
		{
			if (answer==true)
			{
				audio.src="sounds/warp.wav";//set audio source
		audio.play();//play the audio
				//set new coordinates of ship
				ship.x=selectedLocation.x;
				ship.y=selectedLocation.y;
				currentLocation=selectedLocation;//update currentLocation
				energy-=energyConsumption;//deduct energy used
				updateValues();//to reflect change in energy
				randomEvent();// what happens during transit
	
			}
		
		}
		else {
			audio.src="sounds/negative.wav";//set audio source
		audio.play();//play the audio
		alert("You do not have enough energy to make this trip.");//inform player of lack of energy
		}
		//alert player they are already at the selected destination
	}else {alert("You are already at that destination");}
	
//update canvas to reflect changes
redrawCanvas();
}


//updates canvas to reflect changes
function redrawCanvas()
{
	context.clearRect(0,0, canvas.width, canvas.height);//clear the canvas for redrawing
	context.strokeStyle="yellow";
context.strokeRect(selectedLocation.x-10, selectedLocation.y-10, 20, 20);//update selection box position
context.font = "12px Arial";
context.fillStyle="white";
context.fillText("You are here",ship.x+10, ship.y);//update location text position

//redraw all locations
var i=0;
for (i=0; i<all_locations.length; i+=1)
{
	drawCircle(all_locations[i].x, all_locations[i].y, 5, all_locations[i].color);

}

}
//called when click buy energy button
function buyEnergy()
{
	var units = buyEnergyInput.value;//get number in input area
	var total= units*currentLocation.energyCost;//calculate total cost of input units
	
	//if player has enough to make purchase
	if (credits >= total)
	{
		audio.src="sounds/buy.wav";//set audio source
		audio.play();//play the audio
		
		//display event in event log area in html
		addLogEntry("Purchased "+parseInt(units)+" units of energy. "+parseInt(total)+" credits were deducted from your account.");
		credits-=total;//deduct purchase cost from available credits
		energy+=Number(units);//add the bought energy to energy reserves
		updateValues();//update the values that have changed in the html
		
	}
	else
	{
		audio.src="sounds/negative.wav";//set the audio source
		audio.play();//play the audio
		//update log entry area html to inform player they don't have enough credits
		addLogEntry("You do not have enough credits to purchase this amount of energy.");
	}
}

//same as above, except repair costs
function buyRepair()
{
	var units = buyRepairInput.value;//get number from input field
	var total= units*currentLocation.repairCost;//calculate total cost of repairs
	//check if have enough credits to cover repairs
	if (credits >= total)
	{
		audio.src="sounds/buy.wav";//set audio source
		audio.play();//play the audio
		
		//update log entry area
		addLogEntry("Purchased "+parseInt(units)+" points of repair from engineers at "+currentLocation.name+"."+parseInt(total)+" credits were deducted from your account to cover the repairs to your ship.");
		credits-=total;//deduct credits from account
		shipHealth+=Number(units);//add repair units to ship health score
		//don't want player to go over max ship health
		if (shipHealth > maxShipHealth)
		{
			shipHealth=maxShipHealth;
		}
		updateValues();//update the changes in html
		
	}
	else
	{
		audio.src="sounds/negative.wav";//set the audio source
		audio.play();//play the audio
		
		//update the log entry area with this message
		addLogEntry("You do not have enough credits to purchase this amount of repairs.");
	}
}




//a function to generate a custom random integer
function randomInt(num)
{
	//return random integer between 1 and num
	return Math.floor(Math.random() * num)+1;
}
//generates dynamic random events upon travel
function randomEvent()
{
//generate random integer between 1 and 100
var rand = randomInt(100);
var enginesFactor = enginesScore*(enginesPercent/100)
var sensorsFactor = sensorsScore*(sensorsPercent/100)
var shieldsFactor = shieldsScore*(shieldsPercent/100)
var weaponsFactor = weaponsScore*(weaponsPercent/100)


	//if got there fast enough
	if (enginesFactor > rand)
	{
		
		//if sensors value is high enough
		if (sensorsFactor > rand)
		{
			addLogEntry("You spotted a potential threat on your sensors but managed to avoid it.");
			//probability of spotting energy source, chances increase further away from center of map
			if (sensorsFactor > Math.round(randomInt(100)-getDistance(canvas.width/2, canvas.height/2, ship.x, ship.y)/4))
			{
				audio.src="sounds/buy.wav";
				audio.play();
				// potential gain increases further from center of map, at least get 10 credits
				var foundResources= randomInt(getDistance(canvas.width/2, canvas.height/2, ship.x, ship.y))+10;
				addLogEntry("Your sensors registered a potential mining source. Upon investigation, you find "+parseInt(foundResources)+" credits worth of harvestable ore.");
				credits+=foundResources;
				updateValues();
			}
		}
		else
		{
		addLogEntry("Your journey was uneventful.");
			
		}
	}
	else
	{
		//call the enemyEncounter function because found an enemy
		enemyEncounter(); 
	}
}
//method to generate random enemy encounter on travel
function enemyEncounter()
{

//set variables for ship statistics
var enginesFactor = enginesScore*(enginesPercent/100)
var sensorsFactor = sensorsScore*(sensorsPercent/100)
var shieldsFactor = shieldsScore*(shieldsPercent/100)
var weaponsFactor = weaponsScore*(weaponsPercent/100)
//generate how much damage the enemy will do
	var enemyDamage = randomInt(100);
	var enemyHealth=randomInt(100);
	var totalDamage= enemyDamage - shieldsFactor;//ship shields negate some damage
	var playerDamage= Math.floor(weaponsFactor+randomInt(weaponsFactor/4));// set ship's damage output, randomness for fun
	
	//if damage is below 0, don't want to heal the player
	if (totalDamage<0)
	{
		totalDamage=0;
	}
	
	shipHealth-=totalDamage;//deal the calculated damage to ship
	audio.src="sounds/alarm.wav";
	audio.play();
	//set the message string
	var str = "You encounter a hostile ship! You are forced to defend yourself. Your ship takes "+totalDamage+" damage. You deal "+playerDamage+" damage to the enemy ship.";
	var extraString="";
	
	//if the ship is below 0 health
	if (shipHealth < 0)
	{
		extraString = "Your ship is destroyed.";
		
	}
	else
	{
		extraString="You survived this encounter.";
	}
	//update the log entry area with the strings
	addLogEntry(str+extraString);
	updateValues();//update the changes from this function
}
//called to update the element in html
function addLogEntry(s)
{
	//update log entry area with whatever s is
	actionLog.innerHTML=s;
}


