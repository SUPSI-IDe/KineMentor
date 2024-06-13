// Retrieve elements from the HTML

var sexInfo = document.getElementById("sex");
var weightInfo = document.getElementById("weight");
var heightInfo = document.getElementById("height");

sexInfo.innerHTML = localStorage.getItem("sex");
weightInfo.innerHTML = localStorage.getItem("weight");
heightInfo.innerHTML = localStorage.getItem("height");

var hipRangeSlider = document.getElementById('hipRangeSlider');
var kneeRangeSlider = document.getElementById('kneeRangeSlider');
var ankleRangeSlider = document.getElementById('ankleRangeSlider');

const humanFigureCanvas = document.getElementById('humanFigureCanvas');
const humanFigureCtx = humanFigureCanvas.getContext('2d');

var backBtn = document.getElementById("backBtn");
var infoBtn = document.getElementById("infoBtn");
var closeBtn = document.getElementById("closeBtn");

// Event listeners for the buttons on the header
backBtn.addEventListener("click", function() {
    localStorage.setItem("sex", "none");
    localStorage.setItem("weight", "00");
    localStorage.setItem("height", "000");
    window.location.href = "../index.html";
});

infoBtn.addEventListener("click", function() {
    var infoScreen = document.querySelector(".infoScreen");
    infoScreen.style.display = "block";
});

closeBtn.addEventListener("click", function() {
    var infoScreen = document.querySelector(".infoScreen");
    infoScreen.style.display = "none";
});

// Variables to setup the tool
var barbellWeight = 5;
var barbellPosition = 20;
var hipRange = [90, 160];
var kneeRange = [90, 160];
var ankleRange = [60, 90];
var repsPerMinute = 5;

// Variable to store the chart instance
var chartAngle;
var chartForce;
var chartCOM;

// Event listeners for the buttons to increase or decrease the values
document.getElementById("increaseBarbellWeight").addEventListener("click", function() {
    if (barbellWeight < 20) barbellWeight++;
    updateAndRecalculate();
});

document.getElementById("decreaseBarbellWeight").addEventListener("click", function() {
    if (barbellWeight > 1) barbellWeight--;
    updateAndRecalculate();
});

document.getElementById("increaseBarbellPosition").addEventListener("click", function() {
    if (barbellPosition < 40) barbellPosition += 5;
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

// Event listener for the variable select dropdown for the chart
document.getElementById('variableAngleSelect').addEventListener('change', function() {
    updateAndRecalculate();
});

// Event listener for the variable select dropdown for the chart
document.getElementById('variableForceSelect').addEventListener('change', function() {
    updateAndRecalculate();
});

// Create sliders for the hip, knee and ankle angles
noUiSlider.create(hipRangeSlider, {
    start: hipRange,
    connect: true,
    range: {
        'min': 60,
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
    },
    pips: {
        mode: 'values',
        values: [60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180]
    }
}).on('update', function(values, handle) {
    hipRange = values.map(v => Math.round(v));
    updateAndRecalculate();
});

noUiSlider.create(kneeRangeSlider, {
    start: kneeRange,
    connect: true,
    range: {
        'min': 60,
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
    },
    pips: {
        mode: 'values',
        values: [60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180]
    }
}).on('update', function(values, handle) {
    kneeRange = values.map(v => Math.round(v));
    updateAndRecalculate();
});

noUiSlider.create(ankleRangeSlider, {
    start: ankleRange,
    connect: true,
    range: {
        'min': 30,
        'max': 120
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
        values: [30, 40, 50, 60, 70, 80, 90, 100, 110, 120]
    }
}).on('update', function(values, handle) {
    ankleRange = values.map(v => Math.round(v));
    updateAndRecalculate();
});

// Function to update the UI based on the user input
function updateUI() {
    document.getElementById("barbellWeight").textContent = barbellWeight;
    document.getElementById("barbellPosition").textContent = barbellPosition;
    document.getElementById("repsPerMinute").textContent = repsPerMinute;
}

// Function to update the UI and recalculate the squat parameters
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

// Function to calculate the squat parameters
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

    // Dati per il grafico per gli angoli
    const angleData = {
        labels: Array.from({ length: 300 }, (_, i) => (i / 10).toFixed(1)), // Crea 300 etichette vuote
        datasets: [{
            data: Array(300).fill(null), // Inizializza con 300 punti null
            borderColor: '#0D4BF4',
            borderWidth: 3, // Spessore della linea
            tension: 2, // Tensione della linea per curve lisce
            fill: false,
            pointRadius: 0, // Rimuove i punti dal grafico
            showLine: true // Mostra la linea
        }]
    };

    // Dati per il grafico per gli angoli
    const forceData = {
        labels: Array.from({ length: 300 }, (_, i) => (i / 10).toFixed(1)), // Crea 300 etichette vuote
        datasets: [{
            data: Array(300).fill(null), // Inizializza con 300 punti null
            borderColor: '#0D4BF4',
            borderWidth: 3, // Spessore della linea
            tension: 2, // Tensione della linea per curve lisce
            fill: false,
            pointRadius: 0, // Rimuove i punti dal grafico
            showLine: true // Mostra la linea
        }]
    };

    // COM graph data
    const comData = {
        labels: ['Start', 'End'],
        datasets: [{
            data: [{ x: 0, y: comTotalY }, { x: 1, y: comTotalY }], // Static line data
            borderColor: '#0D4BF4',
            borderWidth: 3, // Line thickness
            tension: 0.1, // Line tension for smooth curves
            fill: false,
            pointRadius: 0, // Rimuove i punti dal grafico
            showLine: true // Mostra la linea
        }]
    };

    // Configurazione del grafico per gli angoli
    const configAngle = {
        type: 'line',
        data: angleData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time',
                        color: '#0D4BF4'
                    },
                    ticks: {
                        display: false // Nascondi i numeri sull'asse x
                    },
                    grid: {
                        display: false, // Nascondi le linee di griglia dell'asse x
                        drawBorder: true // Mostra solo il bordo esterno
                    },
                    border: {
                        color: '#0D4BF4',
                        width: 2
                    }
                },
                y: {
                    min: 20,
                    max: 180,
                    title: {
                        display: false,
                        text: 'val'
                    },
                    ticks: {
                        display: true, // Nascondi i numeri sull'asse y
                        color: '#0D4BF4'
                    },
                    grid: {
                        display: false, // Nascondi le linee di griglia dell'asse y
                        drawBorder: true, // Mostra solo il bordo esterno
                        color: '#0D4BF4'
                    },
                    border: {
                        color: '#0D4BF4',
                        width: 2
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

    // Creazione del grafico per gli angoli
    if (chartAngle) {
        chartAngle.destroy(); // Distruggi il grafico esistente
    }
    const ctxAngle = document.getElementById('chartAngleCanvas').getContext('2d');
    chartAngle = new Chart(ctxAngle, configAngle);

    // Configurazione del grafico per la forza
    const configForce = {
        type: 'line',
        data: forceData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time',
                        color: '#0D4BF4'
                    },
                    ticks: {
                        display: false // Nascondi i numeri sull'asse x
                    },
                    grid: {
                        display: false, // Nascondi le linee di griglia dell'asse x
                        drawBorder: true // Mostra solo il bordo esterno
                    },
                    border: {
                        color: '#0D4BF4',
                        width: 2
                    }
                },
                y: {
                    min: -40000,
                    max: 40000,
                    title: {
                        display: false,
                        text: 'val'
                    },
                    ticks: {
                        display: true, // Nascondi i numeri sull'asse y
                        color: '#0D4BF4'
                    },
                    grid: {
                        display: false, // Nascondi le linee di griglia dell'asse y
                        drawBorder: true, // Mostra solo il bordo esterno
                        color: '#0D4BF4'
                    },
                    border: {
                        color: '#0D4BF4',
                        width: 2
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

    // Creazione del grafico per la forza
    if (chartForce) {
        chartForce.destroy(); // Distruggi il grafico esistente
    }
    const ctxForce = document.getElementById('chartForceCanvas').getContext('2d');
    chartForce = new Chart(ctxForce, configForce);

    // Configurazione del grafico per il centro di massa (COM)
    const configCOM = {
        type: 'line',
        data: comData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: false,
            scales: {
                x: {
                    min: -1,
                    max: 2,
                    title: {
                        display: true,
                        text: 'Static Line',
                        color: '#0D4BF4'
                    },
                    ticks: {
                        display: false // Hide x-axis numbers
                    },
                    grid: {
                        display: false, // Hide x-axis grid lines
                        drawBorder: true // Show only the outer border
                    },
                    border: {
                        color: '#0D4BF4',
                        width: 2
                    }
                },
                y: {
                    min: -20,
                    max: 20,
                    title: {
                        display: false,
                        text: 'COM (cm)'
                    },
                    ticks: {
                        display: true, // Show y-axis numbers
                        color: '#0D4BF4'
                    },
                    grid: {
                        display: false, // Hide y-axis grid lines
                        drawBorder: true, // Show only the outer border
                        color: '#0D4BF4'
                    },
                    border: {
                        color: '#0D4BF4',
                        width: 2
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false // Disable mouse over interaction
                }
            }
        }
    };

    // Creazione del grafico per la forza
    if (chartCOM) {
        chartCOM.destroy(); // Distruggi il grafico esistente
    }
    const ctxCOM = document.getElementById('chartCOMCanvas').getContext('2d');
    chartCOM = new Chart(ctxCOM, configCOM);

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

        // Aggiorna il grafico per gli angoli in base alla variabile selezionata per gli angoli
        const selectedAngleVariable = document.getElementById('variableAngleSelect').value;
        let selectedAngleValue;
        switch (selectedAngleVariable) {
            case 'Hip Angle':
                selectedAngleValue = hipAngle;
                break;
            case 'Knee Angle':
                selectedAngleValue = kneeAngle;
                break;
            case 'Ankle Angle':
                selectedAngleValue = ankleAngle;
                break;
        }

        // Aggiorna il grafico con il nuovo valore per gli angoli
        configAngle.options.scales.y.title.text = selectedAngleVariable; // Aggiorna il titolo dell'asse y
        angleData.datasets[0].data.push(selectedAngleValue);
        angleData.datasets[0].data.shift(); // Rimuove il primo elemento per mantenere la lunghezza costante
        chartAngle.update();

        // Aggiorna il grafico per gli angoli in base alla variabile selezionata
        const selectedForceVariable = document.getElementById('variableForceSelect').value;
        let selectedForceValue;
        switch (selectedForceVariable) {
            case 'Hip Torque':
                selectedForceValue = hipTorque;
                break;
            case 'Knee Torque':
                selectedForceValue = kneeTorque;
                break;
            case 'Ankle Torque':
                selectedForceValue = ankleTorque;
                break;
        }

        // Aggiorna il grafico con il nuovo valore per la forza
        configForce.options.scales.y.title.text = selectedForceVariable; // Aggiorna il titolo dell'asse y
        forceData.datasets[0].data.push(selectedForceValue);
        forceData.datasets[0].data.shift(); // Rimuove il primo elemento per mantenere la lunghezza costante
        chartForce.update();

        // Aggiorna il grafico con il nuovo valore per il centro di massa
        comData.datasets[0].data[0].y = comTotalY;
        comData.datasets[0].data[1].y = comTotalY;

        console.log(comData.datasets[0].data[0].x);
        console.log(comData.datasets[0].data[1].x);
        chartCOM.update();

        // Chiama la funzione per disegnare la figura umana
        drawHumanFigure(humanFigureCtx, hipAngle, kneeAngle, ankleAngle, parseInt(localStorage.getItem("height")), barbellWeight, barbellPosition, comTotalY);

        // Richiede il prossimo frame di animazione
        requestAnimationFrame(updateParameters);
    }

    // Avvia l'animazione
    requestAnimationFrame(updateParameters);
}

// Function to draw the human figure
function drawHumanFigure(ctx, hipAngle, kneeAngle, ankleAngle, height, barbellWeight, barbellPosition, comTotalY) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Pulisce il canvas

    const startX = ctx.canvas.width / 2; // Inizia al centro del canvas
    const startY = ctx.canvas.height - 10; // Inizia leggermente sopra il centro del canvas

    // Coordinate iniziali del piede
    const footX = startX - 20;
    const footY = startY - 20;
    const personHeight = ctx.canvas.height / 1.3;
    var barbellY = barbellPosition * 3;
    const minBarbellY = -5 * 3;
    const maxBarbellY = 40 * 3;
    barbellY = Math.min(maxBarbellY, Math.max(minBarbellY, barbellY));

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
    const normalizedRadius = 18 + 8 * ((barbellWeight - minWeight) / (maxWeight - minWeight)); // Scala il raggio tra 5 e 20

    // Disegna la linea del piede
    ctx.beginPath();
    ctx.moveTo(footX, footY);
    ctx.lineTo(footX + 75, footY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Disegna la gamba inferiore
    ctx.beginPath();
    ctx.moveTo(footX, footY);
    ctx.lineTo(ankleX, ankleY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Disegna la gamba superiore
    ctx.beginPath();
    ctx.moveTo(ankleX, ankleY);
    ctx.lineTo(kneeX, kneeY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Disegna il torso
    ctx.beginPath();
    ctx.moveTo(kneeX, kneeY);
    ctx.lineTo(hipX, hipY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Disegna il braccio superiore
    ctx.beginPath();
    ctx.moveTo(hipX, hipY);
    ctx.lineTo(hipX + (barbellY/2) + 20, hipY + 60);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Disegna il braccio inferiore
    ctx.beginPath();
    ctx.moveTo(hipX + (barbellY/2) + 20, hipY + 60);
    ctx.lineTo(hipX + barbellY + 20, hipY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Disegna il peso
    ctx.beginPath();
    ctx.arc(hipX + barbellY + 20, hipY, normalizedRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();

    // Disegna la testa
    ctx.beginPath();
    ctx.arc(hipX + 20, hipY - 50, 24, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();

    // Disegna angolo caviglia
    ctx.beginPath();
    ctx.arc(footX, footY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#0D4BF4';
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = "15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${ankleAngle.toFixed(0)}°`, footX, footY + 5);

    // Disegna angolo ginocchio
    ctx.beginPath();
    ctx.arc(ankleX, ankleY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#0D4BF4';
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = "15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${kneeAngle.toFixed(0)}°`, ankleX, ankleY + 5);

    // Disegna angolo ginocchio
    ctx.beginPath();
    ctx.arc(kneeX, kneeY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#0D4BF4';
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = "15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${hipAngle.toFixed(0)}°`, kneeX, kneeY + 5);

    // Disegna angolo spalla
    ctx.beginPath();
    ctx.arc(hipX, hipY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#0D4BF4';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hipX, hipY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Disegna angolo gomito
    ctx.beginPath();
    ctx.arc(hipX + (barbellY/2) + 20, hipY + 60, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#0D4BF4';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hipX + (barbellY/2) + 20, hipY + 60, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

}

updateUI();
updateAndRecalculate();
