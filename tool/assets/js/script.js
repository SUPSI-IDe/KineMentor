//Importazione funzioni da altri file
import {aggiornamentoFunzioniSchermo} from './screen.js';
import {setupAngoli} from './calcolatore.js';
import {aggiornamentoAngoli} from './calcolatore.js';

// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Check if the app is installed
const isInstalled = getUrlParameter('installed') === 'true';

// Apply styles based on the installed parameter
if (isInstalled) {
    document.getElementById("canvas").classList.add('installed');
    document.getElementsByClassName("settings").classList.add('installed');
    document.getElementsByClassName("result").classList.add('installed');
}

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

const svgPaths = {
    piede: "assets/men/piede.svg",
    tibia: "assets/men/tibia.svg",
    anca: "assets/men/anca.svg",
    tronco: "assets/men/tronco.svg",
    testa: "assets/men/testa.svg",
    braccio: "assets/men/braccio.svg",
    avambraccio: "assets/men/avambraccio.svg",
    manubrio: "assets/men/manubrio.svg",
};

//Dichiarazione variabili canvas
    const humanFigureCanvas = document.getElementById('canvas');
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
        let lastGraphUpdateTime = 0;
        animazione = setInterval(function() {
            try {
                aggiornamentoAngoli(umano, pesoManubrio, posizioneManubrio, minCaviglia, maxCaviglia, minAnca, maxAnca, minGinocchio, maxGinocchio);
                disegnaOmino(humanFigureCtx, umano, svgPaths);
                
                const now = Date.now();
                if (now - lastGraphUpdateTime > 100) {
                    updateGraph(umano.angoloAnca, umano.angoloGinocchio, umano.angoloCaviglia, umano.coppiaAnca, umano.coppiaGinocchio, umano.coppiaCaviglia);
                    updateGraphMobile(umano.angoloAnca, umano.angoloGinocchio, umano.angoloCaviglia, umano.coppiaAnca, umano.coppiaGinocchio, umano.coppiaCaviglia);
                    lastGraphUpdateTime = now;
                }
                //console.log("Angolo ginocchio: " + umano.angoloGinocchio + " Angolo anca: " + umano.angoloAnca + " Angolo caviglia: " + umano.angoloCaviglia);
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
    document.getElementById("weightNumber").textContent = pesoManubrio;
    document.getElementById("weightNumberMobile").textContent = pesoManubrio;
    document.getElementById("posNumber").textContent = posizioneManubrio;
    document.getElementById("posNumberMobile").textContent = posizioneManubrio;
    document.getElementById("repNumber").textContent = ripetizioniSquat;
    document.getElementById("repNumberMobile").textContent = ripetizioniSquat;

    // Recupero ID slider per la regolazione dei vincoli articolari da desktop
    var hipRangeSlider = document.getElementById('hipSlider');
    var kneeRangeSlider = document.getElementById('kneeSlider');
    var ankleRangeSlider = document.getElementById('ankleSlider');

    // Recupero ID slider per la regolazione dei vincoli articolari da mobile
    var hipRangeSliderMobile = document.getElementById('hipSliderMobile');
    var kneeRangeSliderMobile = document.getElementById('kneeSliderMobile');
    var ankleRangeSliderMobile = document.getElementById('ankleSliderMobile');

    // Aumento o diminuzione peso manubrio
        document.getElementById("weightPlus").addEventListener("click", function() {
            if (pesoManubrio < 20) pesoManubrio++;
            document.getElementById("weightNumber").textContent = pesoManubrio;
            document.getElementById("weightNumberMobile").textContent = pesoManubrio;
        });
        document.getElementById("weightMinus").addEventListener("click", function() {
            if (pesoManubrio > 1) pesoManubrio--;
            document.getElementById("weightNumber").textContent = pesoManubrio;
            document.getElementById("weightNumberMobile").textContent = pesoManubrio;
        });

    // Aumento o diminuzione posizione manubrio
        document.getElementById("posPlus").addEventListener("click", function() {
            if (posizioneManubrio < 40) posizioneManubrio += 5;
            document.getElementById("posNumber").textContent = posizioneManubrio;
            document.getElementById("posNumberMobile").textContent = posizioneManubrio;
        });
        document.getElementById("posMinus").addEventListener("click", function() {
            if (posizioneManubrio > -5) posizioneManubrio -= 5;
            document.getElementById("posNumber").textContent = posizioneManubrio;
            document.getElementById("posNumberMobile").textContent = posizioneManubrio;
        });

    // Aumento o diminuzione ripetizioni squat
        document.getElementById("repPlus").addEventListener("click", function() {
            if (ripetizioniSquat < 120) ripetizioniSquat+=5;
            document.getElementById("repNumber").textContent = ripetizioniSquat;
            document.getElementById("repNumberMobile").textContent = ripetizioniSquat;
        });
        document.getElementById("repMinus").addEventListener("click", function() {
            if (ripetizioniSquat > 5) ripetizioniSquat-=5;
            document.getElementById("repNumber").textContent = ripetizioniSquat;
            document.getElementById("repNumberMobile").textContent = ripetizioniSquat;
        });

    // NavBar interazione bottoni
        document.getElementById("repBtn").addEventListener("click", function() {
            document.getElementById("repBtn").classList.add("active");
            document.getElementById("dumbellBtn").classList.remove("active");
            document.getElementById("jointBtn").classList.remove("active");
            document.getElementById("graphBtn").classList.remove("active");

            document.getElementById("repetitionsMobile").classList.remove("settingInactive");
            document.getElementById("repetitionsMobile").classList.add("settingActive");
            document.getElementById("dumbellMobile").classList.add("settingInactive");
            document.getElementById("dumbellMobile").classList.remove("settingActive");
            document.getElementById("jointConstraintsMobile").classList.add("settingInactive");
            document.getElementById("jointConstraintsMobile").classList.remove("settingActive");
            document.getElementById("graphMobile").classList.add("settingInactive");
            document.getElementById("graphMobile").classList.remove("settingActive");
        });
        document.getElementById("dumbellBtn").addEventListener("click", function() {
            document.getElementById("repBtn").classList.remove("active");
            document.getElementById("dumbellBtn").classList.add("active");
            document.getElementById("jointBtn").classList.remove("active");
            document.getElementById("graphBtn").classList.remove("active");

            document.getElementById("repetitionsMobile").classList.add("settingInactive");
            document.getElementById("repetitionsMobile").classList.remove("settingActive");
            document.getElementById("dumbellMobile").classList.remove("settingInactive");
            document.getElementById("dumbellMobile").classList.add("settingActive");
            document.getElementById("jointConstraintsMobile").classList.add("settingInactive");
            document.getElementById("jointConstraintsMobile").classList.remove("settingActive");
            document.getElementById("graphMobile").classList.add("settingInactive");
            document.getElementById("graphMobile").classList.remove("settingActive");
        });
        document.getElementById("jointBtn").addEventListener("click", function() {
            document.getElementById("repBtn").classList.remove("active");
            document.getElementById("dumbellBtn").classList.remove("active");
            document.getElementById("jointBtn").classList.add("active");
            document.getElementById("graphBtn").classList.remove("active");

            document.getElementById("repetitionsMobile").classList.add("settingInactive");
            document.getElementById("repetitionsMobile").classList.remove("settingActive");
            document.getElementById("dumbellMobile").classList.add("settingInactive");
            document.getElementById("dumbellMobile").classList.remove("settingActive");
            document.getElementById("jointConstraintsMobile").classList.remove("settingInactive");
            document.getElementById("jointConstraintsMobile").classList.add("settingActive");
            document.getElementById("graphMobile").classList.add("settingInactive");
            document.getElementById("graphMobile").classList.remove("settingActive");
        });
        document.getElementById("graphBtn").addEventListener("click", function() {
            document.getElementById("repBtn").classList.remove("active");
            document.getElementById("dumbellBtn").classList.remove("active");
            document.getElementById("jointBtn").classList.remove("active");
            document.getElementById("graphBtn").classList.add("active");

            document.getElementById("repetitionsMobile").classList.add("settingInactive");
            document.getElementById("repetitionsMobile").classList.remove("settingActive");
            document.getElementById("dumbellMobile").classList.add("settingInactive");
            document.getElementById("dumbellMobile").classList.remove("settingActive");
            document.getElementById("jointConstraintsMobile").classList.add("settingInactive");
            document.getElementById("jointConstraintsMobile").classList.remove("settingActive");
            document.getElementById("graphMobile").classList.remove("settingInactive");
            document.getElementById("graphMobile").classList.add("settingActive");
        });

    // Aumento o diminuzione peso manubrio MOBILE
        document.getElementById("weightPlusMobile").addEventListener("click", function() {
            if (pesoManubrio < 20) pesoManubrio++;
            document.getElementById("weightNumber").textContent = pesoManubrio;
            document.getElementById("weightNumberMobile").textContent = pesoManubrio;
        });
        document.getElementById("weightMinusMobile").addEventListener("click", function() {
            if (pesoManubrio > 1) pesoManubrio--;
            document.getElementById("weightNumber").textContent = pesoManubrio;
            document.getElementById("weightNumberMobile").textContent = pesoManubrio;
        });

    // Aumento o diminuzione posizione manubrio MOBILE
        document.getElementById("posPlusMobile").addEventListener("click", function() {
            if (posizioneManubrio < 40) posizioneManubrio += 5;
            document.getElementById("posNumber").textContent = posizioneManubrio;
            document.getElementById("posNumberMobile").textContent = posizioneManubrio;
        });
        document.getElementById("posMinusMobile").addEventListener("click", function() {
            if (posizioneManubrio > -5) posizioneManubrio -= 5;
            document.getElementById("posNumber").textContent = posizioneManubrio;
            document.getElementById("posNumberMobile").textContent = posizioneManubrio;
        });

    // Aumento o diminuzione ripetizioni squat MOBILE
        document.getElementById("repPlusMobile").addEventListener("click", function() {
            if (ripetizioniSquat < 120) ripetizioniSquat+=5;
            document.getElementById("repNumber").textContent = ripetizioniSquat;
            document.getElementById("repNumberMobile").textContent = ripetizioniSquat;
        });
        document.getElementById("repMinusMobile").addEventListener("click", function() {
            if (ripetizioniSquat > 5) ripetizioniSquat-=5;
            document.getElementById("repNumber").textContent = ripetizioniSquat;
            document.getElementById("repNumberMobile").textContent = ripetizioniSquat;
        });

    // Slider per la regolazione dei vincoli dell'anca
        noUiSlider.create(hipRangeSlider, {
            start: [minAnca, maxAnca],
            connect: true,
            range: {
                'min': minAnca,
                'max': maxAnca
            },
            step: 1,
            tooltips: [true, true],
            format: {
                to: function (value) {
                    return Math.round(value);
                },
                from: function (value) {
                    return Number(value);
                }
            },
            pips: {
                mode: 'values',
                values: [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180]
            }
        });

    // Slider per la regolazione dei vincoli del ginocchio
        noUiSlider.create(kneeRangeSlider, {
            start: [minGinocchio, maxGinocchio],
            connect: true,
            range: {
                'min': minGinocchio,
                'max': maxGinocchio
            },
            step: 1,
            tooltips: [true, true],
            format: {
                to: function (value) {
                    return Math.round(value);
                },
                from: function (value) {
                    return Number(value);
                }
            },
            pips: {
                mode: 'values',
                values: [60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180]
            }
        });

    // Slider per la regolazione dei vincoli della caviglia
        noUiSlider.create(ankleRangeSlider, {
            start: [minCaviglia, maxCaviglia],
            connect: true,
            range: {
                'min': minCaviglia,
                'max': maxCaviglia
            },
            step: 1,
            tooltips: [true, true],
            format: {
                to: function (value) {
                    return Math.round(value);
                },
                from: function (value) {
                    return Number(value);
                }
            },
            pips: {
                mode: 'values',
                values: [66, 70, 80, 90]
            }
        });

        // Slider per la regolazione dei vincoli dell'anca
        noUiSlider.create(hipRangeSliderMobile, {
            start: [minAnca, maxAnca],
            connect: true,
            range: {
                'min': minAnca,
                'max': maxAnca
            },
            step: 1,
            tooltips: [true, true],
            format: {
                to: function (value) {
                    return Math.round(value);
                },
                from: function (value) {
                    return Number(value);
                }
            },
            pips: {
                mode: 'values',
                values: [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180]
            }
        });

    // Slider per la regolazione dei vincoli del ginocchio
        noUiSlider.create(kneeRangeSliderMobile, {
            start: [minGinocchio, maxGinocchio],
            connect: true,
            range: {
                'min': minGinocchio,
                'max': maxGinocchio
            },
            step: 1,
            tooltips: [true, true],
            format: {
                to: function (value) {
                    return Math.round(value);
                },
                from: function (value) {
                    return Number(value);
                }
            },
            pips: {
                mode: 'values',
                values: [60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180]
            }
        });

    // Slider per la regolazione dei vincoli della caviglia
        noUiSlider.create(ankleRangeSliderMobile, {
            start: [minCaviglia, maxCaviglia],
            connect: true,
            range: {
                'min': minCaviglia,
                'max': maxCaviglia
            },
            step: 1,
            tooltips: [true, true],
            format: {
                to: function (value) {
                    return Math.round(value);
                },
                from: function (value) {
                    return Number(value);
                }
            },
            pips: {
                mode: 'values',
                values: [66, 70, 80, 90]
            }
        });

        let updating = false;

        ankleRangeSlider.noUiSlider.on('update', function(values) {
            if (!updating) { 
                updating = true; // Set flag to prevent recursion
                minCaviglia = values[0];
                maxCaviglia = values[1];
                ankleRangeSliderMobile.noUiSlider.set(values); // Update mobile slider
                updating = false; // Reset flag
            }
        });
        ankleRangeSliderMobile.noUiSlider.on('update', function(values) {
            if (!updating) {
                updating = true;
                minCaviglia = values[0];
                maxCaviglia = values[1];
                ankleRangeSlider.noUiSlider.set(values); // Update desktop slider
                updating = false;
            }
        });
    
        hipRangeSlider.noUiSlider.on('update', function(values) {
            if (!updating) {
                updating = true;
                minAnca = values[0];
                maxAnca = values[1];
                hipRangeSliderMobile.noUiSlider.set(values);
                updating = false;
            }
        });
        hipRangeSliderMobile.noUiSlider.on('update', function(values) {
            if (!updating) {
                updating = true;
                minAnca = values[0];
                maxAnca = values[1];
                hipRangeSlider.noUiSlider.set(values);
                updating = false;
            }
        });
    
        kneeRangeSlider.noUiSlider.on('update', function(values) {
            if (!updating) {
                updating = true;
                minGinocchio = values[0];
                maxGinocchio = values[1];
                kneeRangeSliderMobile.noUiSlider.set(values);
                updating = false;
            }
        });
        kneeRangeSliderMobile.noUiSlider.on('update', function(values) {
            if (!updating) {
                updating = true;
                minGinocchio = values[0];
                maxGinocchio = values[1];
                kneeRangeSlider.noUiSlider.set(values);
                updating = false;
            }
        });

// ---------------------------- END AGGIORANAMENTO INFO DA USER INTERFACE ----------------------------

// ---------------------------- BOTTONE PLAY/PAUSA ----------------------------

        let bottonePausa = document.getElementById("pauseBtn");
        let bottonePlay = document.getElementById("playBtn");

        bottonePausa.addEventListener("click", function() {
            clearInterval(animazione);
            bottonePausa.style.display = "none";
            bottonePlay.style.display = "block";
        });

        bottonePlay.addEventListener("click", function() {
            startInterval();
            bottonePausa.style.display = "block";
            bottonePlay.style.display = "none";
        });

// ---------------------------- END BOTTONE PLAY/PAUSA ----------------------------


// ---------------------------- DISEGNO OMINO ----------------------------
function disegnaOmino(ctx, umano) {
    ctx.clearRect(0, 0, humanFigureCanvas.width, humanFigureCanvas.height);

    const scaleMultiplier = 2.8;

    const puntoPartenza = [humanFigureCanvas.width / 2, humanFigureCanvas.height - 8];
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

    const lineWidth = 14;

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

    //Disegno femore
    ctx.beginPath();
    ctx.moveTo(posGinocchio[0], posGinocchio[1]);
    ctx.lineTo(posAnca[0], posAnca[1]);
    ctx.strokeStyle = "black";
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    //Disegno torace
    ctx.beginPath();
    ctx.moveTo(posAnca[0], posAnca[1]);
    ctx.lineTo(posSpalla[0], posSpalla[1]);
    ctx.strokeStyle = "black";
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    //Disegno braccio
    ctx.beginPath();
    ctx.moveTo(posSpalla[0], posSpalla[1]);
    ctx.lineTo(posGomito[0], posGomito[1]);
    ctx.strokeStyle = "black";
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    //Disegno avambraccio
    ctx.beginPath();
    ctx.moveTo(posGomito[0], posGomito[1]);
    ctx.lineTo(posImpugnatura[0], posImpugnatura[1]);
    ctx.strokeStyle = "black";
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    //Disegno testa
    ctx.beginPath();
    ctx.arc(posTesta[0], posTesta[1], lineWidth*3.3, 0, 2 * Math.PI);
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
    ctx.font = "18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${umano.angoloAnca.toFixed(0)}°`, posAnca[0], posAnca[1] + 5);

    //Disegno giuntura ginocchio
    ctx.beginPath();
    ctx.moveTo(posGinocchio[0], posGinocchio[1]);
    ctx.arc(posGinocchio[0], posGinocchio[1], 20, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = "18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${umano.angoloGinocchio.toFixed(0)}°`, posGinocchio[0], posGinocchio[1] + 5);

    //Disegno giuntura caviglia
    ctx.beginPath();
    ctx.moveTo(posCaviglia[0], posCaviglia[1]);
    ctx.arc(posCaviglia[0], posCaviglia[1], 20, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = "18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${umano.angoloCaviglia.toFixed(0)}°`, posCaviglia[0], posCaviglia[1] + 5);
}

// Sotto c'è la funzione con le immagini - non appena disponibili modificare per renderle visibili e cancellare la funzione sopra

const images = {
    tibia: new Image(),
    anca: new Image(),
    tronco: new Image(),
    testa: new Image(),
    piede: new Image(),
    caviglia: new Image(),
    manubrio: new Image(),
    braccio: new Image(),
    avambraccio: new Image(),
};

images.tibia.src = '../tool/assets/men/tibia.svg';
images.anca.src = '../tool/assets/men/anca.svg';
images.tronco.src = '../tool/assets/men/tronco.svg';
images.testa.src = '../tool/assets/men/testa.svg';
images.piede.src = '../tool/assets/men/piede.svg';
images.caviglia.src = '../tool/assets/men/caviglia.svg';
images.manubrio.src = '../tool/assets/men/manubrio.svg';
images.braccio.src = '../tool/assets/men/braccio.svg';
images.avambraccio.src = '../tool/assets/men/avambraccio.svg';

function disegnaOminoImmagini(ctx, umano) {
    ctx.clearRect(0, 0, humanFigureCanvas.width, humanFigureCanvas.height);

    const scaleMultiplier = 2.8;

    const puntoPartenza = [humanFigureCanvas.width / 2, humanFigureCanvas.height - 25];
    const posCaviglia = [puntoPartenza[0] + (umano.posCaviglia[0] * scaleMultiplier), puntoPartenza[1] - (umano.posCaviglia[1] * scaleMultiplier)];
    const posGinocchio = [puntoPartenza[0] + (umano.posGinocchio[0] * scaleMultiplier), puntoPartenza[1] - (umano.posGinocchio[1] * scaleMultiplier)];
    const posAnca = [puntoPartenza[0] + (umano.posAnca[0] * scaleMultiplier), puntoPartenza[1] - (umano.posAnca[1] * scaleMultiplier)];
    const posSpalla = [puntoPartenza[0] + (umano.posSpalla[0] * scaleMultiplier), puntoPartenza[1] - (umano.posSpalla[1] * scaleMultiplier)];
    const posTesta = [puntoPartenza[0] + (umano.posTesta[0] * scaleMultiplier), puntoPartenza[1] - (umano.posTesta[1] * scaleMultiplier)];
    const posGomito = [puntoPartenza[0] + (umano.posGomito[0] * scaleMultiplier), puntoPartenza[1] - (umano.posGomito[1] * scaleMultiplier)];
    const posImpugnatura = [puntoPartenza[0] + (umano.posImpugnatura[0] * scaleMultiplier), puntoPartenza[1] - (umano.posImpugnatura[1] * scaleMultiplier)];

    // Funzione per disegnare un rettangolo con fulcri sempre interni
    function disegnaRettangoloConFulcriInterni(ctx, punto1, punto2, ratio, margineFulcro, immagine = null) {
        const deltaX = punto2[0] - punto1[0];
        const deltaY = punto2[1] - punto1[1];

        const lunghezza = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        const larghezzaRettangolo = lunghezza * ratio;
        const altezzaRettangolo = larghezzaRettangolo + 2 * margineFulcro;
        const angolo = Math.atan2(deltaY, deltaX);

        const offsetX = (deltaX / lunghezza) * margineFulcro;
        const offsetY = (deltaY / lunghezza) * margineFulcro;
        const startX = punto1[0] - offsetX;
        const startY = punto1[1] - offsetY;
        const rettangoloLunghezza = lunghezza + 2 * margineFulcro;

        ctx.save();
        ctx.translate(startX, startY);
        ctx.rotate(angolo);

        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
        ctx.beginPath();
        immagine ? ctx.drawImage(immagine, 0, -altezzaRettangolo / 2, rettangoloLunghezza, altezzaRettangolo) : ctx.rect(0, -altezzaRettangolo / 2, rettangoloLunghezza, altezzaRettangolo);
        ctx.fill();
        ctx.stroke();

        ctx.restore();

        ctx.beginPath();
        ctx.arc(punto1[0], punto1[1], 3, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(punto2[0], punto2[1], 3, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
    }

    // Funzione per disegnare rettangolo per pezzi fissi (con margine e fulcro interno)
    function disegnaRettangoloPezzoFisso(ctx, fulcro, larghezza, altezza, margineFulcro, orientamento = 0, immagine = null) {
        const rettangoloLarghezza = larghezza + margineFulcro;
        const rettangoloAltezza = altezza;

        ctx.save();
        ctx.translate(fulcro[0], fulcro[1]);
        ctx.rotate(orientamento);

        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.fillStyle = "rgba(0, 0, 255, 0.1)";
        ctx.beginPath();
        immagine ? ctx.drawImage(immagine, -margineFulcro, -rettangoloAltezza / 2, rettangoloLarghezza, rettangoloAltezza) : ctx.rect(-margineFulcro, -rettangoloAltezza / 2, rettangoloLarghezza, rettangoloAltezza);
        ctx.fill();
        ctx.stroke();

        ctx.restore();

        ctx.beginPath();
        ctx.arc(fulcro[0], fulcro[1], 3, 0, 2 * Math.PI); // Fulcro
        ctx.fillStyle = "red";
        ctx.fill();
    }

    // Disegna tutte le parti del corpo con rettangoli mobili
    const margineFulcro = 10; // Margine per altezza
    disegnaRettangoloConFulcriInterni(ctx, puntoPartenza, posCaviglia, 0.6, margineFulcro, images.caviglia); // Caviglia
    disegnaRettangoloConFulcriInterni(ctx, posCaviglia, posGinocchio, 0.3, margineFulcro, images.tibia); // Tibia
    disegnaRettangoloConFulcriInterni(ctx, posGinocchio, posAnca, 0.4, margineFulcro, images.anca); // Femore
    disegnaRettangoloConFulcriInterni(ctx, posAnca, posSpalla, 0.4, margineFulcro, images.tronco); // Torace
    disegnaRettangoloConFulcriInterni(ctx, posSpalla, posGomito, 0.25, margineFulcro, images.braccio); // Braccio
    disegnaRettangoloConFulcriInterni(ctx, posGomito, posImpugnatura, 0.15, margineFulcro, images.avambraccio); // Avambraccio

    // Disegna pezzi fissi con margini e fulcri
    disegnaRettangoloPezzoFisso(ctx, puntoPartenza, 60, 40, margineFulcro, 0, images.piede); // Piede
    disegnaRettangoloPezzoFisso(ctx, posSpalla, 90, 80, margineFulcro, -Math.PI / 2, images.testa); // Testa (ruotata di 90 gradi)
    disegnaRettangoloPezzoFisso(ctx, posImpugnatura, 70-margineFulcro, 70, margineFulcro, -Math.PI / 2, images.manubrio); // Bilanciere
}
// ---------------------------- END DISEGNO OMINO ----------------------------

// ---------------------------- GRAFICO ----------------------------

const valuesToKeep = 10;

const xValues = Array.from({ length: valuesToKeep }, (_, index) => index + 1);

let hipAngleData = [];
let kneeAngleData = [];
let ankleAngleData = [];
let hipTorqueData = [];
let kneeTorqueData = [];
let ankleTorqueData = [];

function updateGraph(hipAngle, kneeAngle, ankleAngle, hipTorque, kneeTorque, ankleTorque) {
        hipAngleData.push(hipAngle);
        kneeAngleData.push(kneeAngle);
        ankleAngleData.push(ankleAngle);
        hipTorqueData.push(hipTorque);
        kneeTorqueData.push(kneeTorque);
        ankleTorqueData.push(ankleTorque);

        if (hipAngleData.length > valuesToKeep) {
            hipAngleData.shift();
            kneeAngleData.shift();
            ankleAngleData.shift();
            hipTorqueData.shift();
            kneeTorqueData.shift();
            ankleTorqueData.shift();
        }

  myChart.update();

}

const myChart = new Chart("graph", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      label: "Hip Angle",
      data: hipAngleData,
      borderColor: "#9747FF",
      fill: false,
      yAxisID: 'y',
      hidden: false,
    }, {
      label: "Knee Angle",
      data: kneeAngleData,
      borderColor: "#3b94a5",
      fill: false,
      yAxisID: 'y',
      hidden: true,
    }, {
      label: "Ankle Angle",
      data: ankleAngleData,
      borderColor: "#D80F0F",
      fill: false,
      yAxisID: 'y',
      hidden: true,
    }, {
      label: "Hip Torque",
      data: hipTorqueData,
      borderColor: "#F25D05",
      fill: false,
      yAxisID: 'y1',
      hidden: false,
    }, {
        label: "Knee Torque",
        data: kneeTorqueData,
        borderColor: "#7AA619",
        fill: false,
        yAxisID: 'y1',
        hidden: true,
      }, {
        label: "Ankle Torque",
        data: ankleTorqueData,
        borderColor: "#000000",
        fill: false,
        yAxisID: 'y1',
        hidden: true,
      }]
  },
  options: {
    tension: 0.2,
    animation: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 20,
        max: 220,
        title: {
          display: true,
          text: 'Angle (deg°)',
        },
        ticks: {
            stepSize: 10
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        min: -250,
        max: 250,
        title: {
          display: true,
          text: 'Torque (Nm)',
        },
        ticks: {
            stepSize: 50
        }
      },
      x: {
        ticks: {
            display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
            labelColor: function(context) {
                return {
                    borderColor: context.dataset.borderColor,
                    backgroundColor: context.dataset.borderColor,
                    borderWidth: 2.3,
                };
            },
            labelTextColor: function(context) {
                return context.dataset.borderColor;
            },
            title: function() {
                return ''; // Remove the title of the tooltip
            },
            label: function(context) {
                if (context.dataset.label.includes('Angle')) {
                    return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + ' °';
                } else {
                    return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + ' Nm';
                }
            }
        },
        bodySpacing: 8,
        boxPadding: 4,
        backgroundColor: '#F1F1F1',
    }
    }
  }
});

document.getElementById("hipAngle").addEventListener("click", function() {
  const dataset = myChart.data.datasets[0];
  dataset.hidden = !dataset.hidden;
  myChart.update();
});

document.getElementById("kneeAngle").addEventListener("click", function() {
  const dataset = myChart.data.datasets[1];
  dataset.hidden = !dataset.hidden;
  myChart.update();
});

document.getElementById("ankleAngle").addEventListener("click", function() {
  const dataset = myChart.data.datasets[2];
  dataset.hidden = !dataset.hidden;
  myChart.update();
});

document.getElementById("hipTorque").addEventListener("click", function() {
  const dataset = myChart.data.datasets[3];
  dataset.hidden = !dataset.hidden;
  myChart.update();
});

document.getElementById("kneeTorque").addEventListener("click", function() {
  const dataset = myChart.data.datasets[4];
  dataset.hidden = !dataset.hidden;
  myChart.update();
});

document.getElementById("ankleTorque").addEventListener("click", function() {
  const dataset = myChart.data.datasets[5];
  dataset.hidden = !dataset.hidden;
  myChart.update();
});

// ---------------------------- END GRAFICO ----------------------------

// ---------------------------- GRAFICO MOBILE ----------------------------

const valuesToKeepMobile = 10;

const xValuesMobile = Array.from({ length: valuesToKeepMobile }, (_, index) => index + 1);

let hipAngleDataMobile = [];
let kneeAngleDataMobile = [];
let ankleAngleDataMobile = [];
let hipTorqueDataMobile = [];
let kneeTorqueDataMobile = [];
let ankleTorqueDataMobile = [];

function updateGraphMobile(hipAngle, kneeAngle, ankleAngle, hipTorque, kneeTorque, ankleTorque) {
        hipAngleDataMobile.push(hipAngle);
        kneeAngleDataMobile.push(kneeAngle);
        ankleAngleDataMobile.push(ankleAngle);
        hipTorqueDataMobile.push(hipTorque);
        kneeTorqueDataMobile.push(kneeTorque);
        ankleTorqueDataMobile.push(ankleTorque);

        if (hipAngleDataMobile.length > valuesToKeepMobile) {
            hipAngleDataMobile.shift();
            kneeAngleDataMobile.shift();
            ankleAngleDataMobile.shift();
            hipTorqueDataMobile.shift();
            kneeTorqueDataMobile.shift();
            ankleTorqueDataMobile.shift();
        }

  myChartMobile.update();

}

const myChartMobile = new Chart("graphMobileViz", {
  type: "line",
  data: {
    labels: xValuesMobile,
    datasets: [{
      label: "Hip Angle",
      data: hipAngleDataMobile,
      borderColor: "#9747FF",
      fill: false,
      yAxisID: 'y',
      hidden: false,
    }, {
      label: "Knee Angle",
      data: kneeAngleDataMobile,
      borderColor: "#3b94a5",
      fill: false,
      yAxisID: 'y',
      hidden: true,
    }, {
      label: "Ankle Angle",
      data: ankleAngleDataMobile,
      borderColor: "#D80F0F",
      fill: false,
      yAxisID: 'y',
      hidden: true,
    }, {
      label: "Hip Torque",
      data: hipTorqueDataMobile,
      borderColor: "#F25D05",
      fill: false,
      yAxisID: 'y1',
      hidden: false,
    }, {
        label: "Knee Torque",
        data: kneeTorqueDataMobile,
        borderColor: "#7AA619",
        fill: false,
        yAxisID: 'y1',
        hidden: true,
      }, {
        label: "Ankle Torque",
        data: ankleTorqueDataMobile,
        borderColor: "#000000",
        fill: false,
        yAxisID: 'y1',
        hidden: true,
      }]
  },
  options: {
    tension: 0.2,
    animation: false,
    interaction: false,
    stacked: false,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 20,
        max: 190,
        title: {
          display: true,
          text: 'Angle (deg°)',
        },
        ticks: {
            stepSize: 10
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        min: -250,
        max: 250,
        title: {
          display: true,
          text: 'Torque (Nm)',
        },
        ticks: {
            stepSize: 30
        }
      },
      x: {
        ticks: {
            display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
            labelColor: function(context) {
                return {
                    borderColor: context.dataset.borderColor,
                    backgroundColor: context.dataset.borderColor,
                    borderWidth: 2.3,
                };
            },
            labelTextColor: function(context) {
                return context.dataset.borderColor;
            },
            title: function() {
                return ''; // Remove the title of the tooltip
            },
            label: function(context) {
                if (context.dataset.label.includes('Angle')) {
                    return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + ' °';
                } else {
                    return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + ' Nm';
                }
            }
        },
        bodySpacing: 8,
        boxPadding: 4,
        backgroundColor: '#F1F1F1',
      }
    }
  }
});

document.getElementById("hipAngleMobile").addEventListener("click", function() {
  const dataset = myChartMobile.data.datasets[0];
  dataset.hidden = !dataset.hidden;
  myChartMobile.update();
});

document.getElementById("kneeAngleMobile").addEventListener("click", function() {
  const dataset = myChartMobile.data.datasets[1];
  dataset.hidden = !dataset.hidden;
  myChartMobile.update();
});

document.getElementById("ankleAngleMobile").addEventListener("click", function() {
  const dataset = myChartMobile.data.datasets[2];
  dataset.hidden = !dataset.hidden;
  myChartMobile.update();
});

document.getElementById("hipTorqueMobile").addEventListener("click", function() {
  const dataset = myChartMobile.data.datasets[3];
  dataset.hidden = !dataset.hidden;
  myChartMobile.update();
});

document.getElementById("kneeTorqueMobile").addEventListener("click", function() {
  const dataset = myChartMobile.data.datasets[4];
  dataset.hidden = !dataset.hidden;
  myChartMobile.update();
});

document.getElementById("ankleTorqueMobile").addEventListener("click", function() {
  const dataset = myChartMobile.data.datasets[5];
  dataset.hidden = !dataset.hidden;
  myChartMobile.update();
});

// ---------------------------- END GRAFICO MOBILE ----------------------------