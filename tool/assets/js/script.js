//Importazione funzioni da altri file
import {aggiornamentoFunzioniSchermo} from './screen.js';
import {setupAngoli} from './calcolatore.js';
import {aggiornamentoAngoli} from './calcolatore.js';

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

const images = {
    tibia: new Image(),
    anca: new Image(),
    tronco: new Image(),
    testa: new Image(),
    piede: new Image(),
    manubrio: new Image(),
    braccio: new Image(),
    avambraccio: new Image(),
};

images.tibia.src = '../tool/assets/men/tibia.svg';
images.anca.src = '../tool/assets/men/anca.svg';
images.tronco.src = '../tool/assets/men/tronco.svg';
images.testa.src = '../tool/assets/men/testa.svg';
images.piede.src = '../tool/assets/men/piede.svg';
images.manubrio.src = '../tool/assets/men/manubrio.svg';
images.braccio.src = '../tool/assets/men/braccio.svg';
images.avambraccio.src = '../tool/assets/men/avambraccio.svg';

function disegnaOLDOmino(ctx, umano) {
    ctx.clearRect(0, 0, humanFigureCanvas.width, humanFigureCanvas.height);

    const scaleMultiplier = 1;

    const puntoPartenza = [humanFigureCanvas.width / 2, humanFigureCanvas.height - 40];
    const posCaviglia = [puntoPartenza[0] + (umano.posCaviglia[0] * scaleMultiplier), puntoPartenza[1] - (umano.posCaviglia[1] * scaleMultiplier)];
    const posGinocchio = [puntoPartenza[0] + (umano.posGinocchio[0] * scaleMultiplier), puntoPartenza[1] - (umano.posGinocchio[1] * scaleMultiplier)];
    const posAnca = [puntoPartenza[0] + (umano.posAnca[0] * scaleMultiplier), puntoPartenza[1] - (umano.posAnca[1] * scaleMultiplier)];
    const posSpalla = [puntoPartenza[0] + (umano.posSpalla[0] * scaleMultiplier), puntoPartenza[1] - (umano.posSpalla[1] * scaleMultiplier)];
    const posTesta = [puntoPartenza[0] + ((umano.posTesta[0] + 8 * Math.cos((Math.PI / 180) * (umano.angoloCaviglia - umano.angoloGinocchio + umano.angoloAnca))) * scaleMultiplier), puntoPartenza[1] - ((umano.posTesta[1] + 8 * Math.sin((Math.PI / 180) * (umano.angoloCaviglia - umano.angoloGinocchio + umano.angoloAnca))) * scaleMultiplier)];
    const posGomito = [puntoPartenza[0] + (umano.posGomito[0] * scaleMultiplier), puntoPartenza[1] - (umano.posGomito[1] * scaleMultiplier)];
    const posImpugnatura = [puntoPartenza[0] + (umano.posImpugnatura[0] * scaleMultiplier), puntoPartenza[1] - (umano.posImpugnatura[1] * scaleMultiplier)];

    // Helper function to draw images
    function drawImageWithTwoFulcrums(
        ctx,
        image,
        pointA,
        pointB,
        topFulcrumOffset = [0, 0],
        bottomFulcrumOffset = [0, 0],
        scale = 1,
        rotationOffset = 0,
        showFulcrums = false
    ) {
        // Calculate the distance and angle between the two points
        const dx = pointB[0] - pointA[0];
        const dy = pointB[1] - pointA[1];
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
    
        // Calculate the image's scaling factor for its height
        const imageHeight = image.height;
        const fulcrumDistance = (imageHeight + bottomFulcrumOffset[1] - topFulcrumOffset[1]) * scale;
        const scaleFactor = distance / fulcrumDistance;
    
        const scaledWidth = image.width * scaleFactor;
        const scaledHeight = image.height * scaleFactor;
    
        // Calculate the actual offsets for the fulcrums in the scaled image
        const scaledTopFulcrumOffsetX = topFulcrumOffset[0] * scaleFactor;
        const scaledTopFulcrumOffsetY = topFulcrumOffset[1] * scaleFactor;
        const scaledBottomFulcrumOffsetX = bottomFulcrumOffset[0] * scaleFactor;
        const scaledBottomFulcrumOffsetY = bottomFulcrumOffset[1] * scaleFactor;
    
        // Save the canvas state
        ctx.save();
    
        // Translate the canvas to the top fulcrum point (pointA)
        ctx.translate(pointA[0], pointA[1]);
    
        // Rotate the canvas to align the image between the two points, plus the rotation offset
        ctx.rotate(angle + rotationOffset);
    
        // Translate to account for the top fulcrum offset
        ctx.translate(-scaledTopFulcrumOffsetX, -scaledTopFulcrumOffsetY);
    
        // Draw the image, scaling it properly
        ctx.drawImage(
            image,
            0, // Top-left corner of the image
            0, // Top-left corner of the image
            scaledWidth,
            scaledHeight
        );
    
        // Optionally draw the fulcrums as red dots
        if (showFulcrums) {
            ctx.fillStyle = "red";
    
            // Top fulcrum (pointA)
            ctx.beginPath();
            ctx.arc(scaledTopFulcrumOffsetX, scaledTopFulcrumOffsetY, 5, 0, 2 * Math.PI);
            ctx.fill();
    
            // Bottom fulcrum (pointB)
            const bottomFulcrumPositionX = scaledTopFulcrumOffsetX + scaledBottomFulcrumOffsetX;
            const bottomFulcrumPositionY = scaledTopFulcrumOffsetY + distance;
            ctx.beginPath();
            ctx.arc(bottomFulcrumPositionX, bottomFulcrumPositionY, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    
        // Restore the canvas state
        ctx.restore();
    }

    // Draw each body part with the appropriate image and fulcrum offsets
    drawImageWithTwoFulcrums(ctx, images.piede, puntoPartenza, posCaviglia, [0, 0], [images.piede.width, images.piede.height], 0.05, 90 * Math.PI / 180, true); // Foot
    //drawImageWithTwoFulcrums(ctx, images.tibia, posCaviglia, posGinocchio, [0, 0], [images.tibia.width, images.tibia.height], 90 * Math.PI / 180, true); // Tibia
    // drawImageWithTwoFulcrums(ctx, images.anca, posGinocchio, posAnca, [20, 10], [20, 150]); // Thigh
    // drawImageWithTwoFulcrums(ctx, images.tronco, posAnca, posSpalla, [25, 10], [25, 150]); // Torso
    // drawImageWithTwoFulcrums(ctx, images.testa, posSpalla, posTesta, [15, 30], [15, 50]); // Head
    // drawImageWithTwoFulcrums(ctx, images.braccio, posSpalla, posGomito, [10, 10], [10, 100]); // Upper Arm
    // drawImageWithTwoFulcrums(ctx, images.avambraccio, posGomito, posImpugnatura, [10, 10], [10, 80]); // Forearm
    // drawImageWithTwoFulcrums(ctx, images.manubrio, posImpugnatura, posImpugnatura, [0, 0], [0, 0]); // Dumbbell
}

function disegnaImgOmino(ctx, umano, svgPaths) {
    ctx.clearRect(0, 0, humanFigureCanvas.width, humanFigureCanvas.height);

    const scaleMultiplier = 3;

    // Define all body part positions
    const puntoPartenza = [humanFigureCanvas.width / 2, humanFigureCanvas.height - 10];
    const positions = {
        piede: [puntoPartenza[0], puntoPartenza[1]],
        caviglia: [puntoPartenza[0] + (umano.posCaviglia[0] * scaleMultiplier), puntoPartenza[1] - (umano.posCaviglia[1] * scaleMultiplier)],
        ginocchio: [puntoPartenza[0] + (umano.posGinocchio[0] * scaleMultiplier), puntoPartenza[1] - (umano.posGinocchio[1] * scaleMultiplier)],
        anca: [puntoPartenza[0] + (umano.posAnca[0] * scaleMultiplier), puntoPartenza[1] - (umano.posAnca[1] * scaleMultiplier)],
        spalla: [puntoPartenza[0] + (umano.posSpalla[0] * scaleMultiplier), puntoPartenza[1] - (umano.posSpalla[1] * scaleMultiplier)],
        testa: [puntoPartenza[0] + (umano.posTesta[0] * scaleMultiplier), puntoPartenza[1] - (umano.posTesta[1] * scaleMultiplier)],
        gomito: [puntoPartenza[0] + (umano.posGomito[0] * scaleMultiplier), puntoPartenza[1] - (umano.posGomito[1] * scaleMultiplier)],
        impugnatura: [puntoPartenza[0] + (umano.posImpugnatura[0] * scaleMultiplier), puntoPartenza[1] - (umano.posImpugnatura[1] * scaleMultiplier)],
    };

    // Draw connecting segments with corresponding SVGs
    const segments = [
        { from: "piede", to: "caviglia", svg: svgPaths.piede },
        { from: "caviglia", to: "ginocchio", svg: svgPaths.tibia },
        { from: "ginocchio", to: "anca", svg: svgPaths.anca },
        { from: "anca", to: "spalla", svg: svgPaths.tronco },
        { from: "spalla", to: "gomito", svg: svgPaths.braccio },
        { from: "gomito", to: "impugnatura", svg: svgPaths.avambraccio },
    ];

    segments.forEach((segment) => {
        const start = positions[segment.from];
        const end = positions[segment.to];

        // Use SVG if provided, else fallback to a line
        if (segment.svg) {
            const img = new Image();
            img.src = segment.svg;
            const larghezzaImg = img.width;
            const altezzaImg = img.height;
            const angle = Math.atan2(end[1] - start[1], end[0] - start[0]); // Angle between points
            const length = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2)); // Distance
            ctx.save();
            ctx.translate(start[0], start[1]);
            ctx.rotate(angle); // Rotate to align the SVG with the segment
            ctx.drawImage(img, 0, -10, length, 20); // Stretch SVG along the segment
            ctx.restore();
        } else {
            // Draw a line as a fallback
            ctx.beginPath();
            ctx.moveTo(start[0], start[1]);
            ctx.lineTo(end[0], end[1]);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 5;
            ctx.stroke();
        }
    });

    // Draw individual SVGs for joints or static body parts
    const parts = ["testa", "manubrio"];
    parts.forEach((part) => {
        const img = new Image();
        img.src = svgPaths[part];
        img.onload = () => {
            const [x, y] = positions[part === "manubrio" ? "impugnatura" : part];
            const size = part === "testa" ? 50 : 40; // Adjust size for head and weight
            ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
        };
    });
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