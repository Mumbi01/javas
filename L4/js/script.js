// Globala konstanter och variabler
// Städer och bilder
const allWords = ["Borgholm","Gränna","Gävle","Göteborg","Halmstad","Jönköping","Kalmar","Karlskrona","Kiruna","Ljungby","Malmö","Norrköping","Skara","Stockholm","Sundsvall","Umeå","Visby","Västervik","Växjö","Örebro"];	// Array med namn på städer
const allDescriptions = ["Kyrkan","Storgatan","Julbock","Operan","Picassoparken","Sofiakyrkan","Domkyrkan","Rosenbom","Stadshus","Garvaren","Stortorget","Spårvagn","Domkyrka","Rosenbad","Hotell Knaust","Storgatan","Stadsmur","Hamnen","Teater","Svampen"];	// Array med kort beskrivning av bilderna för städerna
// Element i gränssnittet
var startGameBtn;		// Referenser till start-knappen (button)
var checkAnswersBtn;	// Referens till knappen för att kontrollera svar (button)
var wordListElem;		// Referens till listan med de ord som kan dras (ul-elemntet)
var	wordElems;			// Array med referenser till elementen för de åtta orden (li-elemnten)
var imgElems;			// Array med referenser till elementen med de fyra bilderna (img)
var answerElems;		// Array med referenser till elementen för orden intill bilderna (p)
var correctElems;		// Array med referenser till element för rätta svar (p)
var largeImgElem;		// Referens till elementet med den stora bilden (img)
var msgElem; 			// Referens till div-element för utskrift av meddelanden (div)
// Element vid drag and drop
var dragWordElem;		// Det ord som dras (kan vara både li och p)
// ------------------------------
// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd.
// Initiering av globala variabler samt händelsehanterare.
function init() {
	// Referenser till element i gränssnittet
		startGameBtn = document.getElementById("startGameBtn");
		checkAnswersBtn = document.getElementById("checkAnswersBtn");

		wordListElem = document.getElementById("wordList").getElementsByTagName("ul")[0];
		wordElems = document.getElementById("wordList").getElementsByTagName("li");
	
	// Referenser till bilder 
		imgElems = document.getElementById("imgList").getElementsByTagName("img");
		
		msgElem = document.getElementById("message");
		largeImgElem = document.getElementById("largeImg");

	// Referenser till p-element 
		answerElems = document.getElementsByClassName("userAnswer");
		correctElems = document.getElementsByClassName("correctAnswer");
	
	// Lägg på händelsehanterare
		startGameBtn.addEventListener("click",startGame);
		checkAnswersBtn.addEventListener("click",checkAnswers);
		for (let i = 0; i < imgElems.length; i++){
			imgElems[i].addEventListener("mouseenter",showLargeImg);
			imgElems[i].addEventListener("mouseleave",hideLargeImg);
		}
		
	// Aktivera/inaktivera knappar
		startGameBtn.disabled = false;
		checkAnswersBtn.disabled = true;
		
} // End init
window.addEventListener("load",init); // Se till att init aktiveras då sidan är inladdad


// ------------------------------
// Initiera spelet. Välj ord slumpmässigt. Visa ord och bilder.
function startGame() {
	let tempList = allWords.slice(0);
	let words = [];
	for (let i = 0; i < 4; i++) { 
		let r = Math.floor(Math.random()*tempList.length);
		words.push(tempList[r]); 
		let ix = allWords.indexOf(tempList[r]); 
		imgElems[i].src = "img/" + ix + ".jpg";
		imgElems[i].id = ix; 
	}
	
	words.sort();

	for (let i = 0; i < 4; i++) {
		let r = Math.floor(Math.random()*tempList.length);
	}

	
	for (let i = 0; i < wordElems.length; i++) {
		let r = Math.floor(Math.random()*tempList.length);
		words.push(tempList[r]); 
		tempList.splice(r,1);
		wordElems[i].innerHTML = words[i]; 
		wordElems[i].addEventListener("dragstart",dragstartWord); // händelsehanterare 
		wordElems[i].addEventListener("dragend",dragendWord);
		wordElems[i].draggable = true;  
	}

	for (let i = 0; i < answerElems.length; i++) {
		answerElems[i].addEventListener("dragstart",dragstartWord);
		answerElems[i].addEventListener("dragend",dragendWord); 
		answerElems[i].draggable = true;
		answerElems[i].innerHTML = "";
		correctElems[i].innerHTML = ""; 	
	}

	startGameBtn.disabled = true;
    checkAnswersBtn.disabled = false;

} // End startGame 


// ------------------- 6C 


// ------------------------------
// Visa förstorad bild
function showLargeImg() {
	largeImgElem.src = this.src; 
} // End showLargeImg
// ------------------------------
// Dölj förstorad bild
function hideLargeImg() {
	largeImgElem.src = "img/empty.png"; 
} // End hideLargeImg
// ------------------------------
// Ett ord börjar dras. Spara data om elementet som dras. Händelsehanterare för drop zones
function dragstartWord(e) { // e är Event-objektet
	for (let i = 0; i < imgElems.length; i++) {
		imgElems[i].addEventListener("dragover",wordOverImg);
		imgElems[i].addEventListener("drop",wordOverImg); 
	} 
	wordListElem.addEventListener("dragover", wordOverList); 
	wordListElem.addEventListener("drop", wordOverList); 
	dragWordElem = this; 
	e.dataTransfer.setData("text",this.innerHTML); 

} // End dragstartWord
// ------------------------------
// Drag-händelsen avslutas. Ta bort händelsehanterare på drop zones
function dragendWord() {
	for (let i = 0; i < imgElems.length; i++) {
		imgElems[i].removeEventListener("dragover",wordOverImg); 
		imgElems[i].removeEventListener("drop",wordOverImg); 
	} 
	wordListElem.removeEventListener("dragover", wordOverList); 
	wordListElem.removeEventListener("drop", wordOverList); 
} // End dragendWord
// ------------------------------
// Hantera händelserna dragover och drop, då ett ord släpps över en bild
function wordOverImg(e) { // e är Event-objektet
	e.preventDefault(); 
	if (e.type == "drop") {
		dragWordElem.innerHTML = ""; 
		let dropWorldElem = this.nextElementSibling; 
		if (dropWorldElem.innerHTML !="")
			moveBackToList(dropWorldElem.innerHTML); 
		dropWorldElem.innerHTML = e.dataTransfer.getData("text"); 
	}
} // End wordOverImg
//-------------------------------- 6e 
// ------------------------------
// Hantera händelserna dragover och drop, då ett ord släpps över listan med ord
function wordOverList(e) { // e är Event-objektet
	e.preventDefault();
	if (e.type == "drop"){
		dragWordElem.innerHTML = "";
		moveBackToList(e.dataTransfer.getData("text"));
	}
} // End wordOverList
// ------------------------------
// Flytta tillbaks ordet till listan
function moveBackToList(word) { // word är det ord som ska flyttas tillbaks
	for (let i = 0; i < wordElems.length; i++){
		if (i === "") {break;}
	}
} // End moveBackToList
// ------------------------------
// Kontrollera användarens svar och visa de korrekta svaren
function checkAnswers() {
	for (let i = 0; i < answerElems.length; i++){
		if (answerElems == "") {
			alert("Dra först ord till alla bilder") 
			return; 
		}
	}
	for (let i = 0; i < wordElems.length; i++){
		wordElems[i].draggable = false;
		wordElems[i].removeEventListener("dragstart",dragstartWord); 
		wordElems[i].removeEventListener("dragend",dragendWord);
		var points = 0; 
	}


	for (let i = 0; i < answerElems.length; i++) {
		if (answerElems[i].innerHTML == allWords[ix])
		points++;
	}  

	var points = 0; 
	for (let i = 0; i < answerElems.length; i++) {
        var ix = imgElems[i].id;

        if (answerElems[i].innerHTML == allWords[ix]){
            points++;

        }
        correctElems[i].innerHTML = allWords[ix] + ' ' + allDescriptions[ix];

    }
    msgElem.innerHTML = 'Poäng: ' + points;
	startGameBtn.disabled = true;
    checkAnswersBtn.disabled = false;

	//------------------ 7b 

} // End checkAnswers
// ------------------------------