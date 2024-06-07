var sexInfo = document.getElementById("sex");
var weightInfo = document.getElementById("weight");
var heightInfo = document.getElementById("height");

sexInfo.innerHTML = localStorage.getItem("sex");
weightInfo.innerHTML = localStorage.getItem("weight");
heightInfo.innerHTML = localStorage.getItem("height");

var backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", function() {
    localStorage.setItem("sex", "none");
    localStorage.setItem("weight", "00");
    localStorage.setItem("height", "000");
    window.location.href = "../index.html";
});

var infoBtn = document.getElementById("infoBtn");
infoBtn.addEventListener("click", function() {
    var infoScreen = document.querySelector(".infoScreen");
    infoScreen.style.display = "block";
});

var closeBtn = document.getElementById("closeBtn");
closeBtn.addEventListener("click", function() {
    var infoScreen = document.querySelector(".infoScreen");
    infoScreen.style.display = "none";
});

var barbellWeight = 5;
var barbellPosition = 20;
var hipRange = [110, 160];
var kneeRange = [110, 160];
var ankleRange = [45, 80];
var repsPerMinute = 5;

var chart; // Variable to store the chart instance

function updateUI() {
    document.getElementById("barbellWeight").textContent = barbellWeight;
    document.getElementById("barbellPosition").textContent = barbellPosition;
    document.getElementById("repsPerMinute").textContent = repsPerMinute;
}

document.getElementById("increaseBarbellWeight").addEventListener("click", function() {
    if (barbellWeight < 20) barbellWeight++;
    updateAndRecalculate();
});

document.getElementById("decreaseBarbellWeight").addEventListener("click", function() {
    if (barbellWeight > 1) barbellWeight--;
    updateAndRecalculate();
});

document.getElementById("increaseBarbellPosition").addEventListener("click", function() {
    if (barbellPosition < 50) barbellPosition += 5;
    updateAndRecalculate();
});

document.getElementById("decreaseBarbellPosition").addEventListener("click", function() {
    if (barbellPosition > -5) barbellPosition -= 5;
    updateAndRecalculate();
});

document.getElementById("increaseRepsPerMinute").addEventListener("click", function() {
    if (repsPerMinute < 30) repsPerMinute++;
    updateAndRecalculate();
});

document.getElementById("decreaseRepsPerMinute").addEventListener("click", function() {
    if (repsPerMinute > 1) repsPerMinute--;
    updateAndRecalculate();
});

// Initialize noUiSlider
var hipRangeSlider = document.getElementById('hipRangeSlider');
noUiSlider.create(hipRangeSlider, {
    start: hipRange,
    connect: true,
    range: {
        'min': 90,
        'max': 180
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
    }
}).on('update', function(values, handle) {
    hipRange = values.map(v => Math.round(v));
    updateAndRecalculate();
});

var kneeRangeSlider = document.getElementById('kneeRangeSlider');
noUiSlider.create(kneeRangeSlider, {
    start: kneeRange,
    connect: true,
    range: {
        'min': 90,
        'max': 180
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
    }
}).on('update', function(values, handle) {
    kneeRange = values.map(v => Math.round(v));
    updateAndRecalculate();
});

var ankleRangeSlider = document.getElementById('ankleRangeSlider');
noUiSlider.create(ankleRangeSlider, {
    start: ankleRange,
    connect: true,
    range: {
        'min': 30,
        'max': 90
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
    }
}).on('update', function(values, handle) {
    ankleRange = values.map(v => Math.round(v));
    updateAndRecalculate();
});

document.getElementById('variableSelect').addEventListener('change', function() {
    updateAndRecalculate();
});

function updateAndRecalculate() {
    updateUI();
    calculateSquatParameters(
        localStorage.getItem("sex"),
        parseInt(localStorage.getItem("height")),
        parseInt(localStorage.getItem("weight")),
        barbellWeight,
        barbellPosition,
        hipRange,
        kneeRange,
        ankleRange,
        repsPerMinute
    );
}

function drawHumanFigure(ctx, hipAngle, kneeAngle, ankleAngle, height, barbellWeight, barbellPosition, comTotalY) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Pulisce il canvas

    const scale = height / 4; // Scala il disegno per adattarlo al canvas
    const startX = ctx.canvas.width / 2; // Inizia al centro del canvas
    const startY = ctx.canvas.height - scale; // Inizia leggermente sopra il centro del canvas

    // Coordinate iniziali del piede
    const footX = startX;
    const footY = startY;
    const personHeight = height - scale;

    // Calcola le coordinate della caviglia
    const ankleX = footX + (personHeight / 4) * Math.sin((90 - ankleAngle) * Math.PI / 180);
    const ankleY = footY - (personHeight / 4) * Math.cos((90 - ankleAngle) * Math.PI / 180);

    // Calcola le coordinate del ginocchio
    const kneeX = ankleX + (personHeight / 4) * Math.sin(((kneeAngle / 2 ) - 90) * Math.PI / 180);
    const kneeY = ankleY - (personHeight / 4) * Math.cos(((kneeAngle / 2 ) - 90) * Math.PI / 180);

    // Calcola le coordinate dell'anca
    const hipX = kneeX + (personHeight / 3) * Math.sin((90 - (hipAngle / 2 )) * Math.PI / 180);
    const hipY = kneeY - (personHeight / 3) * Math.cos((90 - (hipAngle / 2 )) * Math.PI / 180);

    // Normalizza la dimensione del peso
    const minWeight = 1; // Valore minimo per la normalizzazione
    const maxWeight = 20; // Valore massimo per la normalizzazione
    const normalizedRadius = 4 + 8 * ((barbellWeight - minWeight) / (maxWeight - minWeight)); // Scala il raggio tra 5 e 20

    // Disegna la linea del piede
    ctx.beginPath();
    ctx.moveTo(footX, footY);
    ctx.lineTo(footX + 25, footY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Disegna la gamba inferiore
    ctx.beginPath();
    ctx.moveTo(footX, footY);
    ctx.lineTo(ankleX, ankleY);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Disegna la gamba superiore
    ctx.beginPath();
    ctx.moveTo(ankleX, ankleY);
    ctx.lineTo(kneeX, kneeY);
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Disegna il torso
    ctx.beginPath();
    ctx.moveTo(kneeX, kneeY);
    ctx.lineTo(hipX, hipY);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Disegna il braccio superiore
    ctx.beginPath();
    ctx.moveTo(hipX, hipY);
    ctx.lineTo(hipX + (barbellPosition/2), hipY + 10);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Disegna il braccio inferiore
    ctx.beginPath();
    ctx.moveTo(hipX + (barbellPosition/2), hipY + 10);
    ctx.lineTo(hipX + barbellPosition, hipY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Disegna il peso
    ctx.beginPath();
    ctx.arc(hipX + barbellPosition, hipY, normalizedRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();

    // Disegna la testa
    ctx.beginPath();
    ctx.arc(hipX, hipY - 30, 15, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();

    // Angolo della caviglia
    ctx.fillText(`Ankle: ${ankleAngle.toFixed(2)}°`, footX + 10, footY + 10);

    // Angolo del ginocchio
    ctx.fillText(`Knee: ${kneeAngle.toFixed(2)}°`, ankleX + 10, ankleY);

    // Angolo dell'anca
    ctx.fillText(`Hip: ${hipAngle.toFixed(2)}°`, kneeX + 10, kneeY);
}

const humanFigureCanvas = document.getElementById('humanFigureCanvas');
const humanFigureCtx = humanFigureCanvas.getContext('2d');

function calculateSquatParameters(sex, height, weight, barbellWeight, barbellPosition, hipRange, kneeRange, ankleRange, repsPerMinute) {
    const g = 9.81; // Accelerazione gravitazionale in m/s^2

    // Parametri del corpo
    const torsoWeight = 0.5 * weight; // Peso del torso
    const thighWeight = 0.2 * weight; // Peso di ogni coscia
    const lowerLegWeight = 0.1 * weight; // Peso di ogni gamba inferiore
    const barbellY = barbellPosition;

    // Calcolo delle posizioni dei segmenti
    const torsoLength = 0.4 * height; // Lunghezza del torso
    const thighLength = 0.25 * height; // Lunghezza di ogni coscia
    const lowerLegLength = 0.25 * height; // Lunghezza di ogni gamba inferiore

    // Calcolo del COM per ogni segmento
    const comTorso = {
        x: 0,
        y: -torsoLength / 2
    };
    const comThigh = {
        x: thighLength * Math.sin(hipRange[0] * Math.PI / 180),
        y: -thighLength * Math.cos(hipRange[0] * Math.PI / 180)
    };
    const comLowerLeg = {
        x: comThigh.x + lowerLegLength * Math.sin(kneeRange[0] * Math.PI / 180),
        y: comThigh.y - lowerLegLength * Math.cos(kneeRange[0] * Math.PI / 180)
    };

    // Calcolo del COM totale
    const totalWeight = weight + barbellWeight;
    const comTotalY = (torsoWeight * comTorso.y + 2 * thighWeight * comThigh.y + 2 * lowerLegWeight * comLowerLeg.y + barbellWeight * barbellY) / totalWeight;
    const comTotalX = (torsoWeight * comTorso.x + 2 * thighWeight * comThigh.x + 2 * lowerLegWeight * comLowerLeg.x) / totalWeight;

    // Determina se la figura è stabile
    const isStable = Math.abs(comTotalX) <= 0.1 * height; // Considera stabile se il COM è entro il 10% dell'altezza dai piedi

    // Forza gravitazionale totale
    const totalForce = totalWeight * g;

    // Bracci del momento approssimativi (in realtà dipendono dalla postura specifica)
    const momentArmHip = 0.2 * height; // Distanza approssimativa dal COM all'anca
    const momentArmKnee = 0.15 * height; // Distanza approssimativa dal COM al ginocchio
    const momentArmAnkle = 0.1 * height; // Distanza approssimativa dal COM alla caviglia

    // Tempo di una ripetizione
    const repTime = 60 / repsPerMinute; // Tempo di una ripetizione in secondi
    let startTime = null;

    // Dati per il grafico
    const data = {
        labels: Array.from({ length: 300 }, (_, i) => (i / 10).toFixed(1)), // Crea 300 etichette vuote
        datasets: [{
            data: Array(300).fill(null), // Inizializza con 300 punti null
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2, // Spessore della linea
            tension: 2, // Tensione della linea per curve lisce
            fill: false,
            pointRadius: 0, // Rimuove i punti dal grafico
            showLine: true // Mostra la linea
        }]
    };

    // Aggiungi un po' di spazio sopra e sotto
    const padding = 20;
    const minVariableValue = Math.min(...hipRange, ...kneeRange, ...ankleRange) - padding;
    const maxVariableValue = Math.max(...hipRange, ...kneeRange, ...ankleRange) + padding;

    // Configurazione del grafico
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (s)'
                    },
                    ticks: {
                        display: false // Nascondi i numeri sull'asse x
                    },
                    grid: {
                        display: false, // Nascondi le linee di griglia dell'asse x
                        drawBorder: true // Mostra solo il bordo esterno
                    }
                },
                y: {
                    min: minVariableValue,
                    max: maxVariableValue,
                    title: {
                        display: true,
                        text: 'val'
                    },
                    ticks: {
                        display: true // Nascondi i numeri sull'asse y
                    },
                    grid: {
                        display: false, // Nascondi le linee di griglia dell'asse y
                        drawBorder: true // Mostra solo il bordo esterno
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false // Disabilita l'interazione al mouse over
                }
            }
        }
    };

    // Creazione del grafico
    if (chart) {
        chart.destroy(); // Distruggi il grafico esistente
    }
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    chart = new Chart(ctx, config);

    // Funzione di interpolazione lineare
    function interpolate(value1, value2, factor) {
        return value1 + (value2 - value1) * factor;
    }

    // Variabili di stato per il movimento "bounce"
    let direction = 1; // 1 per avanti, -1 per indietro
    let factor = 0; // Fattore di interpolazione

    // Funzione di aggiornamento
    function updateParameters(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsedTime = (timestamp - startTime) / 1000; // Tempo trascorso in secondi

        // Calcolo del fattore di interpolazione basato sul tempo trascorso
        const cycleTime = elapsedTime % repTime; // Tempo all'interno di una ripetizione
        const cycleFactor = cycleTime / repTime; // Fattore di progresso nella ripetizione

        // Determina il fattore di interpolazione e la direzione
        if (cycleFactor <= 0.5) {
            factor = cycleFactor * 2; // Avanza da 0 a 1
            direction = 1;
        } else {
            factor = 2 * (1 - cycleFactor); // Torna da 1 a 0
            direction = -1;
        }

        // Interpolazione degli angoli
        const hipAngle = interpolate(hipRange[0], hipRange[1], factor);
        const kneeAngle = interpolate(kneeRange[0], kneeRange[1], factor);
        const ankleAngle = interpolate(ankleRange[0], ankleRange[1], factor);

        // Calcolo delle coppie
        const hipTorque = totalForce * momentArmHip * Math.cos(hipAngle * Math.PI / 180);
        const kneeTorque = totalForce * momentArmKnee * Math.cos(kneeAngle * Math.PI / 180);
        const ankleTorque = totalForce * momentArmAnkle * Math.cos(ankleAngle * Math.PI / 180);

        // Mostra i risultati
        document.getElementById('output').innerHTML = `
            <p>Time: ${elapsedTime.toFixed(2)} s</p>
            <p>Coppia Anca: ${hipTorque.toFixed(2)} Nm</p>
            <p>Angolo Anca: ${hipAngle.toFixed(2)} °</p>
            <p>Coppia Ginocchio: ${kneeTorque.toFixed(2)} Nm</p>
            <p>Angolo Ginocchio: ${kneeAngle.toFixed(2)} °</p>
            <p>Coppia Caviglia: ${ankleTorque.toFixed(2)} Nm</p>
            <p>Angolo Caviglia: ${ankleAngle.toFixed(2)} °</p>
            <p>Centro di Massa: ${comTotalY.toFixed(2)} cm</p>
            <p>Is stable: ${isStable}</p>
        `;

        // Aggiorna il grafico per gli angoli in base alla variabile selezionata
        const selectedVariable = document.getElementById('variableSelect').value;
        let selectedValue;
        switch (selectedVariable) {
            case 'Hip Angle':
                selectedValue = hipAngle;
                break;
            case 'Knee Angle':
                selectedValue = kneeAngle;
                break;
            case 'Ankle Angle':
                selectedValue = ankleAngle;
                break;
        }

        config.options.scales.y.title.text = selectedVariable; // Aggiorna il titolo dell'asse y
        data.datasets[0].data.push(selectedValue);
        data.datasets[0].data.shift(); // Rimuove il primo elemento per mantenere la lunghezza costante
        chart.update();

        // Chiama la funzione per disegnare la figura umana
        drawHumanFigure(humanFigureCtx, hipAngle, kneeAngle, ankleAngle, height, barbellWeight, barbellPosition, comTotalY);

        // Richiede il prossimo frame di animazione
        requestAnimationFrame(updateParameters);
    }

    // Avvia l'animazione
    requestAnimationFrame(updateParameters);
}

updateUI();
updateAndRecalculate();
