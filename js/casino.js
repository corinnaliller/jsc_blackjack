// JavaScript Document
// Corinna Liller, BBM2H17M

var geld = 100;
var user, spielLaueft;
var punkteBank, punkteSpieler;
//Bilder vorladen
var farben = ['Karo', 'Herz', 'Pik', 'Kreuz'];
var zahlen = ['As', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Bube', 'Dame', 'Koenig'];
var deckBilder = [];
var counter = 0;
var einsatz;
var deck = [],
	spielerKarten = [],
	dealerKarten = [];
var spielerKartenZahl, dealerKartenZahl, sk, dk;
var spiele = 0;
var isum;


for (var i = 0; i < farben.length; i++) {
	for (var j = 0; j < zahlen.length; j++) {
		//alert(farben[i]+zahlen[j]);
		deckBilder[counter] = new Image();
		deckBilder[counter].src = '../images/cards/' + farben[i] + zahlen[j] + '.png';
		counter++;
	}
	//alert(counter);
}


function blackjack(spielstand) {

	if (spielstand === "neu") {
		isum = 0;
		document.getElementById('tablebuttons').style.display = "none";
		document.getElementById('versicherungsdiv').style.display = "none";
		spielLaueft = true;
		document.images[0].src = "../images/cards/empty.png";
		document.images[1].src = "../images/cards/empty.png";
		document.images[2].src = "../images/cards/empty.png";
		document.images[3].src = "../images/cards/empty.png";
		document.images[4].src = "../images/cards/empty.png";
		document.images[5].src = "../images/cards/empty.png";
		document.images[6].src = "../images/cards/empty.png";
		document.images[7].src = "../images/cards/empty.png";
		document.images[9].src = "../images/cards/empty.png";
		document.images[10].src = "../images/cards/empty.png";
		document.images[11].src = "../images/cards/empty.png";
		document.images[12].src = "../images/cards/empty.png";
		document.images[13].src = "../images/cards/empty.png";
		document.images[14].src = "../images/cards/empty.png";
		document.images[15].src = "../images/cards/empty.png";
		document.images[16].src = "../images/cards/empty.png";
		if (spiele === 0) {
			newDeck();
			user = leseCookies('User');
			//geld = parseInt(leseCookies('Money'));
			document.getElementById('header').innerHTML = "BlackJack-Tisch von " + user;
		}
		document.getElementById('money').innerHTML = "Guthaben: "+ geld + " Euro";
		document.getElementById('ergebnis').innerHTML = "";
		document.getElementById('einsatz').innerHTML = "";
		document.getElementById('insureMe').innerHTML = "";
		spiele++;
		var asDaSpieler = false;
		var asDaBank = false;
		sk = 0;
		dk = 0;
		var blackJackBank = false;
		var blackJackSpieler = false;
		var tripleSevenSpieler = false;
		var countSevens = 0;
		spielerKarten = [0, 0, 0, 0, 0, 0, 0, 0];
		dealerKarten = [0, 0, 0, 0, 0, 0, 0, 0];
		spielerKartenZahl = 9;
		dealerKartenZahl = 0;
		punkteBank = 0;
		punkteSpieler = 0;
		if (geld <= 0) {
			alert("Sie haben kein Geld mehr!");
			location.href="index.html";
		} else {
			var einsatzString = prompt("Sie haben noch " + geld + " Euro zur Verfügung. Wie viel wollen Sie setzen?\n(Maximaler Einsatz: 1000 Euro)");
			einsatz = parseInt(einsatzString);
			//alert(geld);
			if (einsatz === 0 || isNaN(einsatz)) {
				einsatz = 1;
			} else if (einsatz > geld) {
				einsatz = geld;
			} else if (einsatz > 1000 && einsatz < geld) {
				einsatz = 1000;
			}
			geld = geld - einsatz;
			document.getElementById('einsatz').innerHTML = "Einsatz: " + einsatz + " Euro";
			document.getElementById('money').innerHTML = "Guthaben: " + geld + " Euro";
			//alert(deck[0]);

			drawCardPlayer(spielerKartenZahl);
			spielerKartenZahl++;
			drawCardDealer(dealerKartenZahl);
			dealerKartenZahl++;
			drawCardPlayer(spielerKartenZahl);
			spielerKartenZahl++;
			punkteAnzeigen();
			if (punkteSpieler === 21) {
				blackJackSpieler = true;
			}
			document.getElementById('tablebuttons').style.display = "block";
			document.getElementById('dd').style.display = "block";
			if (asDaBank) {
				document.getElementById('versicherungsdiv').style.display = "block";
			}
			/*
			if (confirm("Wollen Sie noch eine Karte?")) {
				karte();
				}
			else {
			bankZiehtWeiter();
			}
			*/
		}
	} else if (spielstand === "karte") {
		document.getElementById('versicherungsdiv').style.display = "none";
		if (document.getElementById('dd').style.display !== "none") {
			document.getElementById('dd').style.display = "none";
		}
		if (spielLaueft) {
			karte();
		}

	} else if (spielstand === "steht") {
		document.getElementById('versicherungsdiv').style.display = "none";
		if (document.getElementById('dd').style.display !== "none") {
			document.getElementById('dd').style.display = "none";
		}
		if (spielLaueft) {
			bankZiehtWeiter();
		}

	} else if (spielstand === "versicherung") {
		if (spielLaueft) {
			var vers = parseInt(document.getElementById("versicherungssumme").value);
			if (isNaN(vers)) {
				isum = 0;
			}
			else {
				isum =parseInt(vers);
				if (isum > geld) {
					isum = geld;
				}
			}
			geld -= isum;
			document.getElementById('versicherungsdiv').style.display = "none";
			document.getElementById('money').innerHTML = "Guthaben: " + geld + " Euro";
			document.getElementById('insureMe').innerHTML = "Versicherung: " + isum + " Euro";
		}
	}
	else if (spielstand === 'doubleDown') {
		document.getElementById('dd').style.display = "none";
		document.getElementById('tablebuttons').style.display = "none";
		geld -= einsatz;
		einsatz *= 2;
		document.getElementById('money').innerHTML = "Guthaben: " + geld + " Euro";
		document.getElementById('einsatz').innerHTML = "Einsatz: " + einsatz + " Euro";
		karte();
		bankZiehtWeiter();
	}

	function drawCardPlayer(x) {
		if (spielLaueft) {
			var nichtDa = true;
			var zufallsKarte;
			while (nichtDa) {
				zufallsKarte = Math.floor(Math.random() * 52);
				if (deck[zufallsKarte][3] !== 0) {
					deck[zufallsKarte][3]--;
					punkteSpieler += deck[zufallsKarte][2];
					if (deck[zufallsKarte][2] === 7) {
						countSevens++;
					}
					if (deck[zufallsKarte][1] === "As") {
						asDaSpieler = true;
					}
					spielerKarten[sk] = deck[zufallsKarte][2];
					sk++;
					punkteAnzeigen();
					if (sk === 3 && countSevens === 3) {
						spielEnde();
					}
					if (sk === 2 && asDaSpieler && punkteSpieler === 21) {
						blackJackSpieler = true;
					}
					if (punkteSpieler > 21) {
						spielEnde();
					}
					nichtDa = false;
				}
			}
			//alert(zufallsKarte);
			//alert(deck[zufallsKarte][2]);
			document.images[x].src = deckBilder[zufallsKarte].src;
		}

	}

	function drawCardDealer(x) {
		if (spielLaueft) {
			var nichtDa = true;
			var zufallsKarte;
			while (nichtDa) {
				zufallsKarte = Math.floor(Math.random() * 52);
				if (deck[zufallsKarte][3] !== 0) {
					deck[zufallsKarte][3]--;
					punkteBank += deck[zufallsKarte][2];
					if (deck[zufallsKarte][1] === "As") {
						asDaBank = true;
					}
					dealerKarten[dk] = deck[zufallsKarte][2];
					dk++;
					if (asDaBank && dk === 2 && punkteBank === 21) {
						blackJackBank = true;
						spielEnde();
					}
					/*
					if (punkteBank >= 17) {
						spielEnde();
					}
					*/
					nichtDa = false;
				}
			}
			//alert(zufallsKarte);
			//alert(deck[zufallsKarte][2]);
			document.images[x].src = deckBilder[zufallsKarte].src;
		}

	}

	function karte() {
		if (spielLaueft) {
			drawCardPlayer(spielerKartenZahl);
			spielerKartenZahl++;
			punkteAnzeigen();
		}
	}

	function bankZiehtWeiter() {
		var weiter = true;
		while (weiter && spielLaueft) {
			drawCardDealer(dealerKartenZahl);
			dealerKartenZahl++;
			punkteAnzeigen();
			if (punkteBank >= 17) {
				weiter = false;
			}
		}
		if (spielLaueft) {
			spielEnde();	
		}

	}

	function spielEnde() {
		document.getElementById('versicherungsdiv').style.display = "none";
		document.getElementById('tablebuttons').style.display = "none";
		spielLaueft = false;
		//alert(einsatz);
		if (punkteSpieler > 21) {
			document.getElementById('ergebnis').innerHTML = "Sie haben verloren!";
		} else if (tripleSevenSpieler) {
			document.getElementById('ergebnis').innerHTML = "TRIPLE SEVEN!";
			geld += einsatz * 2.5;
		} else if (blackJackBank) {
			geld += isum * 2;
			if (blackJackSpieler) {
				document.getElementById('ergebnis').innerHTML = "unentschieden";
				geld += einsatz;
			} else {
				document.getElementById('ergebnis').innerHTML = "Bank hat BlackJack! Sie haben verloren!";
			}
		} else {
			if (blackJackSpieler) {
				document.getElementById('ergebnis').innerHTML = "BLACK JACK!";
				geld += einsatz * 2.5;
			} else if (punkteBank > 21) {
				document.getElementById('ergebnis').innerHTML = "Sie haben gewonnen!";
				geld += einsatz * 2;
			} else if (punkteBank === punkteSpieler) {
				document.getElementById('ergebnis').innerHTML = "unentschieden";
				geld += einsatz;
			} else if (punkteBank > punkteSpieler) {
				document.getElementById('ergebnis').innerHTML = "Sie haben verloren!";
			} else if (punkteBank < punkteSpieler) {
				document.getElementById('ergebnis').innerHTML = "Sie haben gewonnen!";
				geld += einsatz * 2;
			}
		}
		//alert(geld);
		document.getElementById('money').innerHTML = "Guthaben: " + geld + " Euro";
	}

	function punkteAnzeigen() {

		if (punkteSpieler > 21 && asDaSpieler) {
			punkteSpieler -= 10;
		} else if (punkteSpieler > 21) {
			spielLaueft = false;
			spielEnde();
		}
		if (punkteBank > 21 && asDaBank) {
			punkteBank -= 10;
		}
		
		//alert("Spieler: "+punkteSpieler);
		//alert("Cropier: "+punkteBank);
		document.getElementById('spielerPunkte').innerHTML = user + ": " + punkteSpieler;
		document.getElementById('bankPunkte').innerHTML = "Bank: " + punkteBank;
		if (punkteBank >= 17) {
			spielEnde();
		}
	}

	function newDeck() {
		deck[0] = new Array("Karo", "As", 11, 6);
		deck[1] = new Array("Karo", "2", 2, 6);
		deck[2] = new Array("Karo", "3", 3, 6);
		deck[3] = new Array("Karo", "4", 4, 6);
		deck[4] = new Array("Karo", "5", 5, 6);
		deck[5] = new Array("Karo", "6", 6, 6);
		deck[6] = new Array("Karo", "7", 7, 6);
		deck[7] = new Array("Karo", "8", 8, 6);
		deck[8] = new Array("Karo", "9", 9, 6);
		deck[9] = new Array("Karo", "10", 10, 6);
		deck[10] = new Array("Karo", "Bube", 10, 6);
		deck[11] = new Array("Karo", "Dame", 10, 6);
		deck[12] = new Array("Karo", "Koenig", 10, 6);
		deck[13] = new Array("Herz", "As", 11, 6);
		deck[14] = new Array("Herz", "2", 2, 6);
		deck[15] = new Array("Herz", "3", 3, 6);
		deck[16] = new Array("Herz", "4", 4, 6);
		deck[17] = new Array("Herz", "5", 5, 6);
		deck[18] = new Array("Herz", "6", 6, 6);
		deck[19] = new Array("Herz", "7", 7, 6);
		deck[20] = new Array("Herz", "8", 8, 6);
		deck[21] = new Array("Herz", "9", 9, 6);
		deck[22] = new Array("Herz", "10", 10, 6);
		deck[23] = new Array("Herz", "Bube", 10, 6);
		deck[24] = new Array("Herz", "Dame", 10, 6);
		deck[25] = new Array("Herz", "Koenig", 10, 6);
		deck[26] = new Array("Pik", "As", 11, 6);
		deck[27] = new Array("Pik", "2", 2, 6);
		deck[28] = new Array("Pik", "3", 3, 6);
		deck[29] = new Array("Pik", "4", 4, 6);
		deck[30] = new Array("Pik", "5", 5, 6);
		deck[31] = new Array("Pik", "6", 6, 6);
		deck[32] = new Array("Pik", "7", 7, 6);
		deck[33] = new Array("Pik", "8", 8, 6);
		deck[34] = new Array("Pik", "9", 9, 6);
		deck[35] = new Array("Pik", "10", 10, 6);
		deck[36] = new Array("Pik", "Bube", 10, 6);
		deck[37] = new Array("Pik", "Dame", 10, 6);
		deck[38] = new Array("Pik", "Koenig", 10, 6);
		deck[39] = new Array("Kreuz", "As", 11, 6);
		deck[40] = new Array("Kreuz", "2", 2, 6);
		deck[41] = new Array("Kreuz", "3", 3, 6);
		deck[42] = new Array("Kreuz", "4", 4, 6);
		deck[43] = new Array("Kreuz", "5", 5, 6);
		deck[44] = new Array("Kreuz", "6", 6, 6);
		deck[45] = new Array("Kreuz", "7", 7, 6);
		deck[46] = new Array("Kreuz", "8", 8, 6);
		deck[47] = new Array("Kreuz", "9", 9, 6);
		deck[48] = new Array("Kreuz", "10", 10, 6);
		deck[49] = new Array("Kreuz", "Bube", 10, 6);
		deck[50] = new Array("Kreuz", "Dame", 10, 6);
		deck[51] = new Array("Kreuz", "Koenig", 10, 6);
	}

	function leseCookies(name) {
		var cs;
		cs = document.cookie.split("; ");
		for (var i = 0; i < cs.length; i++) {
			if (name === cs[i].split("=")[0]) {
				return cs[i].split("=")[1];
			}
		}
		return 0;
	}

}