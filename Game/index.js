var continueButton=document.getElementById("continueButton");
var newGameButton=document.getElementById("newGameButton");


continueButton.addEventListener('click', continueAction);

function continueAction()
{
	if (localStorage.shipName == null)
	{
		alert("You do not have a game in progress. Please start a new game.");
		
	}//end of check if shipName is null
	else{
		window.location.href = 'game.html';
		
		
	}//end of else
	
}//end of continue button function