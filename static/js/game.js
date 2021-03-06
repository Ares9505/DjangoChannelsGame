const game_id = document.getElementById("game_id").innerHTML; 
const gameReady= window.location.search;//get the parameter from the url, this will be ?twoplayers if you join and "" if you create the game
let player="";
let tabla = document.getElementsByClassName('running-game');

//Estas son vista forzadas para probar un juego ya creado
// document.getElementById('create-info').style.display="none";
// document.getElementById('sequence-selection').style.display="inline-block";

// tabla[0].style.display="inline-block";
// tabla[1].style.display="inline-block";


// Creation of websocket from client
const gameSocket= new WebSocket(
	'ws://'
	+ window.location.host
	+ '/ws/game/'
	+ game_id
	+'/'
	);

gameSocket.onopen = function open() {
    console.log('WebSockets connection created.');

	if (gameReady){
		gameSocket.send(JSON.stringify({
        "event": "START",
        "message": gameReady
        }));
   	};
};

gameSocket.onmessage=function (e){
	let data = JSON.parse(e.data);
	payload = data["payload"];
	

	if (payload["event"]== "START"){
		if ( payload["message"] == "?twoplayers")
		{
			document.getElementById('create-info').style.display="none";
			document.getElementById('sequence-selection').style.display="inline-block";
		};
	};
	
	// This code is related to the javascript code of select_secuence.html
	// When 2 player send the secuence change the view to running game cause payload["message"] will by true
	if(payload["event"] == "ColorSelection"){
		if(payload["message"] == "True"){
			reset();
			tabla[0].style.display="inline-block";
			tabla[1].style.display="inline-block";
			document.querySelector('#send-colors-button').style.display="block";
			document.querySelector('#clear-colors-button').style.display="block";
			document.querySelector('#color-selection').style.display="block";
			document.getElementById('h1-tittle').innerHTML="Color Guessing"
			document.querySelector('#send-color-validation').innerHTML="";
		}
	}


	//This code is related to the javascript code of running_game.html
	if(payload["event"]=="ColorGuees"){

		secuence 		= payload["message"]["secuence"].split(",");
		cows     		= payload["message"]["cows"];
		bulls    		= payload["message"]["bulls"];
		playerNumber	= payload["message"]["player"];
		winner			= payload["message"]["winner"];
		moves_db 			= payload["message"]["moves"];
		if ( playerNumber == player ){
			tbodyOption=tbodyOption=document.getElementById("my-tbody");				
		}
		else{
			tbodyOption=document.getElementById("opponent-tbody");
			
		}
		addColum(secuence,cows,bulls,tbodyOption);
		checkPlayerEnd(bulls,playerNumber,moves_db);
		checkWinner(winner);	
	}
				
};

//Sequece selection////////////////////

// globals variables
let selectedSecuenceIndex = [];
let colorTags = document.getElementsByClassName('pick-box');
const colorSelectTags=document.querySelectorAll('.color-select');
let moves=0;


// For each color tag I add and event listener that will hear a click event. When this event take place the arrow function event=> is activated. 
//This function collect the index of de tag clicked by accesing to the data-index atribute of the tag clicked which was saved in event.path[0] by the event listener
//Then we access to the style.background property to add the color selected to the selected secuence which will be sent previosly
for (var i = 0; i < colorTags.length; i++){

	colorTags[i].addEventListener("click",event=>{
		const index= event.path[0].getAttribute('data-index');
		const colorSelected=event.path[0].style.backgroundColor;

		//Avoid to repeat color in selection
		if (selectedSecuenceIndex.indexOf(colorSelected)!=-1 ){
			document.querySelector('#send-color-validation').style.color="red";
			document.querySelector('#send-color-validation').innerHTML="Avoid to repeat colors";
		}
		//If the color isn't repeated add color to selectedsecuence			
		else if(selectedSecuenceIndex.length <4){							
			colorSelectTags[selectedSecuenceIndex.length].style.backgroundColor=colorSelected;

			selectedSecuenceIndex.push(colorSelected);
							
		}
		}
	);
} 

// When we click on send-color-button we change the elements displayed at the screen. 
document.querySelector("#send-colors-button").onclick=function(e){

	if (tabla[0].style.display=="none"){
		SendMySecuence("ColorSelection","You secuence was sent correctly. Wait for the other player");
	}
	else{
		SendMySecuence("ColorGuees","");		
	}
	
};

function SendMySecuence(eventType,smsValidation) {
	if (selectedSecuenceIndex.length ==4){
		player=(gameReady)? 2 : 1;
		selectedSecuenceIndex=selectedSecuenceIndex.join(",");
		if (eventType=="ColorGuees"){
			moves+=1;			
		}

		data={
			"event": eventType,
			"message": {
				"gameid": game_id,// game_id were created in create.html javascript and it is a global variable
				"player": player,
				"secuence":selectedSecuenceIndex,
				"moves": moves
			}
		}
		gameSocket.send(JSON.stringify(data));

		//validation positive 
		document.querySelector('#send-color-validation').style="color:green; background-color: white;";
		document.querySelector('#send-color-validation').innerHTML=smsValidation;

		if (eventType=="ColorGuees"){
			reset();			
		}
		else{
			document.querySelector('#send-colors-button').style.display="none";
			document.querySelector('#clear-colors-button').style.display="none";
			document.querySelector('#color-selection').style.display="none";
		}
		
	}
	else{
		//validation negative
		document.querySelector('#send-color-validation').innerHTML="You most select 4 colors";
		document.querySelector('#send-color-validation').style.color="red";
	}
}

function reset(){
	selectedSecuenceIndex=[];
	for (i of colorSelectTags){
		i.style.backgroundColor="white";
	}
}

//function to add colum in selected tbody with sequence color, bulls and cows information  
function addColum(sequence,cows,bulls,tbodyOption){
	let trTag = document.createElement("tr");
	let thTag=[];
	//creating colums nodes
	for (let i=0; i<6;i++){
		thTag[i] = document.createElement("th");
		//assing secuence color to each 
		if (i<4){
			thTag[i].style.backgroundColor=sequence[i];
			trTag.appendChild(thTag[i]);
		}
	}
	thTag[4].innerHTML=cows;
	thTag[5].innerHTML=bulls;

	for (th of thTag){
		trTag.appendChild(th);
	}		
	tbodyOption.appendChild(trTag);
}

function checkPlayerEnd(bulls,playerNumber,moves_db){
	if (bulls==4 && playerNumber == player){
		document.getElementById('send-color-validation').style.color="green";
		document.getElementById('send-color-validation').innerHTML=`Congrats!! You find the secuence in ${moves_db} moves. Wait for the other player.`;
		document.getElementById('send-colors-button').style.display ="none";
		document.querySelector('#clear-colors-button').style.display="none";

	}
}

function checkWinner(winner){
	if (winner != "None"){

		document.getElementById("color-selection").style.display = "none";
		document.getElementById("color-sequence").style.display = "none";
		sms="Redirect in 3 seconds."
		if (winner == "Draw"){
			
			document.getElementById("send-color-validation").innerHTML = "Sorry, the game was draw. You use the same amount of moves. " +sms;
		}
		else{
			document.getElementById("send-color-validation").innerHTML = winner + " wins!!! " + sms;
		}
		setTimeout( changePage, 5000);			
	}
}

function changePage(){
	window.location.href="/game/";
}
	
		


	
	//Cambiar procesamiento de la secuencia seleccionada cuando este la vista de runninggame.html X
	
	//usar join y split para evitar codigo redundante a la hora de guardar y comparar X

	//Modificar validacion de secuencia de colores  a enviar para que los colores no se repitan X

	//Decidir a partir del jugador a que tabla pertenece el intento de adivinar realizador y mostrarlo en la que le corresponde X

	//Enviar evento de SecuenceGuees con su contrapartid en consumers X

	//Recibir secuencia y mostrarla en la tabla correspondiente X

	//Dar un tiempo despu??s de que se confirme que hay un ganador para volver a base.html X

	//quitar el test X

	//Dar estilos a cada vista X

	//Hacer validacion del id X

	//cambiar next por send X

	//Agregar explicacion del juego X
 
	//Que gane el que menos movientos uso X

	//cambiar texto en running game para mostrar que lo que se debe es adivinar X

	//mover el css y el js a archivos static X

	//cuando uno gana sale primero el sms de alerta y no es lo que se quiere por tanto se debe cambiar la forma de
	//mostrar el mensaje que termina el juego

	//cuando ganas primero tiene que salir la secuencia correcta en el historial

	//usar overflow para las tablas

	//Agreagr funcion para mantener la vista en la pagina cuando se reacrage (onload)