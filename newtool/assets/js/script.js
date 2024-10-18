//Importazione funzioni da altri file
import {aggiornamentoFunzioniSchermo} from './screen.js';
import {setupAngoli} from './calcolatore.js';
import {aggiornamentoAngoli} from './calcolatore.js';

//Da eliminare prima del deploy
localStorage.setItem("sex", "female");
localStorage.setItem("weight", "60");
localStorage.setItem("height", "160");

//Dichiarazione variabili globali
var umano = {
    sesso: localStorage.getItem("sex"),
    peso: localStorage.getItem("weight"),
    altezza: localStorage.getItem("height"),
    //Lunghezze articolari
    lunghezzaTibia: localStorage.getItem("height") * 0.26, //Pesi e Lunghezze calcolati secondo il modello Drillis e Contini
    lunghezzaFemore: localStorage.getItem("height") * 0.24,
    lunghezzaTorace: localStorage.getItem("height") * 0.25,
    lunghezzaCollo: localStorage.getItem("height") * 0.05,
    lunghezzaBraccio: localStorage.getItem("height") * 0.17, //Leggermente (da 19%) modificata per fare in modo che braccio e avambraccio siano uguali
    lunghezzaAvambraccio: localStorage.getItem("height") * 0.17, //Leggermente (da 15%) modificata per fare in modo che braccio e avambraccio siano uguali
    lunghezzaPiede: localStorage.getItem("height") * 0.15,
    //Pesi articolari
    pesoTibia: localStorage.getItem("weight") * 0.04,
    pesoFemore: localStorage.getItem("weight") * 0.10,
    pesoTorace: localStorage.getItem("weight") * 0.43,
    pesoTesta: localStorage.getItem("weight") * 0.07,
    pesoBraccio: localStorage.getItem("weight") * 0.03,
    pesoAvambraccio: localStorage.getItem("weight") * 0.02,
    pesoPiede: localStorage.getItem("weight") * 0.015,
    //Posizioni articolari
    posCaviglia: [0, 5], //x, y
    posGinocchio: [Infinity, Infinity], //x, y
    posAnca: [Infinity, Infinity],
    posSpalla: [Infinity, Infinity],
    posTesta: [Infinity, Infinity],
    posGomito: [Infinity, Infinity],
    posImpugnatura: [Infinity, Infinity],
    //Baricentri articolari
    baricentroTibia: [Infinity, Infinity],
    baricentroFemore: [Infinity, Infinity],
    baricentroToraceTesta: [Infinity, Infinity],
    baricentroBraccio: [Infinity, Infinity],
    baricentroAvambraccio: [Infinity, Infinity],
    //Angoli e coppie articolari
    coppiaAnca: Infinity,
    angoloAnca: Infinity,
    coppiaGinocchio: Infinity,
    angoloGinocchioPrecedente: Infinity,
    angoloGinocchio: Infinity,
    coppiaCaviglia: Infinity,
    angoloCaviglia: Infinity,
    //Centro di massa
    centroDiMassa: Infinity
};
var ripetizioniSquat = 20;
var pesoManubrio = 5;
var posizioneManubrio = 20;
var minCaviglia = 66;
var maxCaviglia = 98;
var minAnca = 30;
var maxAnca = 180;
var minGinocchio = 60;
var maxGinocchio = 180;

//Dichiarazione variabili canvas
const humanFigureCanvas = document.getElementById('humanFigureCanvas');
const humanFigureCtx = humanFigureCanvas.getContext('2d');

//Aggiornamento funzioni a schermo
aggiornamentoFunzioniSchermo();

// ---------------------------- CALCOLO ANGOLI E COPPIE ARTICOLARI ----------------------------

    //Calcolo angoli e coppie articolari - prima passata
    setupAngoli(umano, pesoManubrio, posizioneManubrio, minCaviglia, maxCaviglia, minAnca, maxAnca, maxGinocchio);


    //Calcolo angoli e coppie articolari - da seconda passata in poi (animazione)
    var animazione;

    function startInterval(){
        const intervallo = (60000 / ripetizioniSquat) / (maxGinocchio - minGinocchio);
        animazione = setInterval(function() {
            try {
                aggiornamentoAngoli(umano, pesoManubrio, posizioneManubrio, minCaviglia, maxCaviglia, minAnca, maxAnca, minGinocchio, maxGinocchio);
                disegnaOmino(humanFigureCtx, umano);
                //console.log("Angolo ginocchio: " + umano.angoloGinocchio + " Angolo anca: " + umano.angoloAnca + " Angolo caviglia: " + umano.angoloCaviglia);
                // Mostra i risultati
                document.getElementById('output').innerHTML = `
                    <p>Coppia Anca: ${umano.coppiaAnca.toFixed(2)} Nm</p>
                    <p>Angolo Anca: ${umano.angoloAnca.toFixed(2)} °</p>
                    <p>Coppia Ginocchio: ${umano.coppiaGinocchio.toFixed(2)} Nm</p>
                    <p>Angolo Ginocchio: ${umano.angoloGinocchio.toFixed(2)} °</p>
                    <p>Coppia Caviglia: ${umano.coppiaCaviglia.toFixed(2)} Nm</p>
                    <p>Angolo Caviglia: ${umano.angoloCaviglia.toFixed(2)} °</p>
                    <p>Centro di Massa: ${umano.centroDiMassa.toFixed(2)} cm</p>
                `;
            } catch (error) {
                console.log("Errore: " + error);
                clearInterval(animazione);
            }
        }, intervallo);
    }
    startInterval();

// ---------------------------- END CALCOLO ANGOLI E COPPIE ARTICOLARI ----------------------------

// ---------------------------- AGGIORANAMENTO INFO DA USER INTERFACE ----------------------------

    // Aggiornamento informazioni schermo peso manubrio
    document.getElementById("barbellWeight").textContent = pesoManubrio;
    document.getElementById("barbellPosition").textContent = posizioneManubrio;
    document.getElementById("repsPerMinute").textContent = ripetizioniSquat;

    // Aumento o diminuzione peso manubrio
        document.getElementById("increaseBarbellWeight").addEventListener("click", function() {
            if (pesoManubrio < 20) pesoManubrio++;
            document.getElementById("barbellWeight").textContent = pesoManubrio;
            clearInterval(animazione);
            startInterval();
        });
        document.getElementById("decreaseBarbellWeight").addEventListener("click", function() {
            if (pesoManubrio > 1) pesoManubrio--;
            document.getElementById("barbellWeight").textContent = pesoManubrio;
            clearInterval(animazione);
            startInterval();
        });

    // Aumento o diminuzione posizione manubrio
        document.getElementById("increaseBarbellPosition").addEventListener("click", function() {
            if (posizioneManubrio < 40) posizioneManubrio += 5;
            document.getElementById("barbellPosition").textContent = posizioneManubrio;
            clearInterval(animazione);
            startInterval();
        });
        document.getElementById("decreaseBarbellPosition").addEventListener("click", function() {
            if (posizioneManubrio > -5) posizioneManubrio -= 5;
            document.getElementById("barbellPosition").textContent = posizioneManubrio;
            clearInterval(animazione);
            startInterval();
        });

    // Aumento o diminuzione ripetizioni squat
        document.getElementById("increaseRepsPerMinute").addEventListener("click", function() {
            if (ripetizioniSquat < 120) ripetizioniSquat+=5;
            document.getElementById("repsPerMinute").textContent = ripetizioniSquat;
            clearInterval(animazione);
            startInterval();
        });
        document.getElementById("decreaseRepsPerMinute").addEventListener("click", function() {
            if (ripetizioniSquat > 5) ripetizioniSquat-=5;
            document.getElementById("repsPerMinute").textContent = ripetizioniSquat;
            clearInterval(animazione);
            startInterval();
        });

// ---------------------------- END AGGIORANAMENTO INFO DA USER INTERFACE ----------------------------

// ---------------------------- DISEGNO OMINO ----------------------------
function disegnaOmino(ctx, umano) {
    ctx.clearRect(0, 0, humanFigureCanvas.width, humanFigureCanvas.height);

    const scaleMultiplier = 3;

    const puntoPartenza = [humanFigureCanvas.width / 2, humanFigureCanvas.height - 10];
    const posCaviglia = [puntoPartenza[0] + (umano.posCaviglia[0] * scaleMultiplier), puntoPartenza[1] - (umano.posCaviglia[1] * scaleMultiplier)];
    const posGinocchio = [puntoPartenza[0] + (umano.posGinocchio[0] * scaleMultiplier), puntoPartenza[1] - (umano.posGinocchio[1] * scaleMultiplier)];
    const posAnca = [puntoPartenza[0] + (umano.posAnca[0] * scaleMultiplier), puntoPartenza[1] - (umano.posAnca[1] * scaleMultiplier)];
    const posSpalla = [puntoPartenza[0] + (umano.posSpalla[0] * scaleMultiplier), puntoPartenza[1] - (umano.posSpalla[1] * scaleMultiplier)];
    const posTesta = [puntoPartenza[0] + ((umano.posTesta[0] + 8 * Math.cos((Math.PI / 180) * (umano.angoloCaviglia - umano.angoloGinocchio + umano.angoloAnca))) * scaleMultiplier), puntoPartenza[1] - ((umano.posTesta[1] + 8 * Math.sin((Math.PI / 180) * (umano.angoloCaviglia - umano.angoloGinocchio + umano.angoloAnca))) * scaleMultiplier)];
    const posGomito = [puntoPartenza[0] + (umano.posGomito[0] * scaleMultiplier), puntoPartenza[1] - (umano.posGomito[1] * scaleMultiplier)];
    const posImpugnatura = [puntoPartenza[0] + (umano.posImpugnatura[0] * scaleMultiplier), puntoPartenza[1] - (umano.posImpugnatura[1] * scaleMultiplier)];
    const baricentroTibia = [puntoPartenza[0] + (umano.baricentroTibia[0] * scaleMultiplier), puntoPartenza[1] - (umano.baricentroTibia[1] * scaleMultiplier)];
    const baricentroFemore = [puntoPartenza[0] + (umano.baricentroFemore[0] * scaleMultiplier), puntoPartenza[1] - (umano.baricentroFemore[1] * scaleMultiplier)];
    const baricentroToraceTesta = [puntoPartenza[0] + (umano.baricentroToraceTesta[0] * scaleMultiplier), puntoPartenza[1] - (umano.baricentroToraceTesta[1] * scaleMultiplier)];
    const baricentroBraccio = [puntoPartenza[0] + (umano.baricentroBraccio[0] * scaleMultiplier), puntoPartenza[1] - (umano.baricentroBraccio[1] * scaleMultiplier)];
    const baricentroAvambraccio = [puntoPartenza[0] + (umano.baricentroAvambraccio[0] * scaleMultiplier), puntoPartenza[1] - (umano.baricentroAvambraccio[1] * scaleMultiplier)];
    const centroDiMassa = [puntoPartenza[0] + (umano.centroDiMassa * scaleMultiplier), puntoPartenza[1]];

    const lineWidth = 8;

    //Disegno piedi
    ctx.beginPath();
    ctx.moveTo(puntoPartenza[0], puntoPartenza[1]);
    ctx.lineTo(puntoPartenza[0] + umano.lunghezzaPiede*scaleMultiplier, puntoPartenza[1]);
    ctx.strokeStyle = "black";
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    //Disegno punto centro di massa
    ctx.beginPath();
    ctx.arc(centroDiMassa[0], centroDiMassa[1], 8, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    //Disegno Caviglia
    ctx.beginPath();
    ctx.moveTo(puntoPartenza[0], puntoPartenza[1]);
    ctx.lineTo(posCaviglia[0], posCaviglia[1]);
    ctx.strokeStyle = "black";
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    //Disegno tibia
    ctx.beginPath();
    ctx.moveTo(posCaviglia[0], posCaviglia[1]);
    ctx.lineTo(posGinocchio[0], posGinocchio[1]);
    ctx.strokeStyle = "black";
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    //Disegno punto barciocentro tibia
    ctx.beginPath();
    ctx.arc(baricentroTibia[0], baricentroTibia[1], 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    //Disegno femore
    ctx.beginPath();
    ctx.moveTo(posGinocchio[0], posGinocchio[1]);
    ctx.lineTo(posAnca[0], posAnca[1]);
    ctx.strokeStyle = "black";
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    //Disegno punto barciocentro femore
    ctx.beginPath();
    ctx.arc(baricentroFemore[0], baricentroFemore[1], 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    //Disegno torace
    ctx.beginPath();
    ctx.moveTo(posAnca[0], posAnca[1]);
    ctx.lineTo(posSpalla[0], posSpalla[1]);
    ctx.strokeStyle = "black";
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    //Disegno punto barciocentro torace
    ctx.beginPath();
    ctx.arc(baricentroToraceTesta[0], baricentroToraceTesta[1], 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    //Disegno braccio
    ctx.beginPath();
    ctx.moveTo(posSpalla[0], posSpalla[1]);
    ctx.lineTo(posGomito[0], posGomito[1]);
    ctx.strokeStyle = "black";
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    //Disegno punto barciocentro braccio
    ctx.beginPath();
    ctx.arc(baricentroBraccio[0], baricentroBraccio[1], 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    //Disegno avambraccio
    ctx.beginPath();
    ctx.moveTo(posGomito[0], posGomito[1]);
    ctx.lineTo(posImpugnatura[0], posImpugnatura[1]);
    ctx.strokeStyle = "black";
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    //Disegno punto barciocentro avambraccio
    ctx.beginPath();
    ctx.arc(baricentroAvambraccio[0], baricentroAvambraccio[1], 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    //Disegno testa
    ctx.beginPath();
    ctx.arc(posTesta[0], posTesta[1], lineWidth*4, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();

    //Disegno manubrio
    ctx.beginPath();
    ctx.moveTo(posImpugnatura[0], posImpugnatura[1]);
    ctx.arc(posImpugnatura[0], posImpugnatura[1], lineWidth+(pesoManubrio * 1.2), 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();

    //Disegno giuntura gomito
    ctx.beginPath();
    ctx.moveTo(posGomito[0], posGomito[1]);
    ctx.arc(posGomito[0], posGomito[1], 20, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(posGomito[0], posGomito[1]);
    ctx.arc(posGomito[0], posGomito[1], 5, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

    //Disegno giuntura spalla
    ctx.beginPath();
    ctx.moveTo(posSpalla[0], posSpalla[1]);
    ctx.arc(posSpalla[0], posSpalla[1], 20, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(posSpalla[0], posSpalla[1]);
    ctx.arc(posSpalla[0], posSpalla[1], 5, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

    //Disegno giuntura anca
    ctx.beginPath();
    ctx.moveTo(posAnca[0], posAnca[1]);
    ctx.arc(posAnca[0], posAnca[1], 20, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.fillStyle = 'white';
    window.innerWidth  < 800 ? ctx.font = "25px sans-serif" : ctx.font = "15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${umano.angoloAnca.toFixed(0)}°`, posAnca[0], posAnca[1] + 5);

    //Disegno giuntura ginocchio
    ctx.beginPath();
    ctx.moveTo(posGinocchio[0], posGinocchio[1]);
    ctx.arc(posGinocchio[0], posGinocchio[1], 20, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.fillStyle = 'white';
    window.innerWidth  < 800 ? ctx.font = "25px sans-serif" : ctx.font = "15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${umano.angoloGinocchio.toFixed(0)}°`, posGinocchio[0], posGinocchio[1] + 5);

    //Disegno giuntura caviglia
    ctx.beginPath();
    ctx.moveTo(posCaviglia[0], posCaviglia[1]);
    ctx.arc(posCaviglia[0], posCaviglia[1], 20, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.fillStyle = 'white';
    window.innerWidth  < 800 ? ctx.font = "25px sans-serif" : ctx.font = "15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${umano.angoloCaviglia.toFixed(0)}°`, posCaviglia[0], posCaviglia[1] + 5);
}
// ---------------------------- END DISEGNO OMINO ----------------------------