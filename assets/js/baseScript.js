localStorage.setItem("sex", "none");
localStorage.setItem("height", "00");
localStorage.setItem("weight", "00");
localStorage.setItem("bmi", "none");

function sexSelection(button) {
    if (!button.classList.contains("btnClicked")) {
        button.classList.add("btnClicked");
    }

    if (button.textContent == "Male") {
        document.getElementById("humanWoman").style.display = "none";
        document.getElementById("humanMan").style.display = "block";
        document.getElementById("femaleBtn").classList.remove("btnClicked");
    } else if (button.textContent == "Female"){
        document.getElementById("humanMan").style.display = "none";
        document.getElementById("humanWoman").style.display = "block";
        document.getElementById("maleBtn").classList.remove("btnClicked");
    }

    localStorage.setItem("sex", button.textContent);
}

document.getElementById('heightInput').addEventListener('change', function() {
    if (this.value < this.min || this.value > this.max) {
        localStorage.setItem("height", "00");
    } else {
        localStorage.setItem("height", this.value);
    }
});

document.getElementById('weightInput').addEventListener('change', function() {
    if (this.value < this.min || this.value > parseInt(this.max)) {
        localStorage.setItem("weight", "00");
    } else {
        localStorage.setItem("weight", this.value);
    }
});

// Function to calculate and display BMI
function calculateBMI() {
    const weight = parseInt(document.getElementById('weightInput').value);
    const height = parseInt(document.getElementById('heightInput').value);
    
    if (weight >= parseInt(document.getElementById('weightInput').min) && 
        weight <= parseInt(document.getElementById('weightInput').max) && 
        height >= parseInt(document.getElementById('heightInput').min) && 
        height <= parseInt(document.getElementById('heightInput').max)) {
        
        let bmi = (weight / Math.pow((height / 100), 2)).toFixed(1);
        document.getElementById('bmiNr').textContent = bmi;
        bmi < 18.5 ? document.getElementById('bmiName').textContent = "Underweight" : 
        bmi < 24.9 ? document.getElementById('bmiName').textContent = "Normal Weight" : 
        bmi < 29.9 ? document.getElementById('bmiName').textContent = "Overweight" : 
        document.getElementById('bmiName').textContent = "Obesity";
        
        document.getElementById('bmiResult').style.display = "block";
        localStorage.setItem("bmi", document.getElementById('bmiName').textContent);
    } else {
        document.getElementById('bmiResult').style.display = "none";
        localStorage.setItem("bmi", "none");
    }
}

// Update weight input event listener
document.getElementById('weightInput').addEventListener('input', function() {
    if (this.value.trim() !== "" && document.getElementById('heightInput').value.trim() !== "") {
        calculateBMI();
    }
});

// Update height input event listener
document.getElementById('heightInput').addEventListener('input', function() {
    if (this.value.trim() !== "" && document.getElementById('weightInput').value.trim() !== "") {
        calculateBMI();
    }
});

document.getElementById('startBtn').addEventListener('click', function() {
    console.log(localStorage);
    if (localStorage.sex === "none" || localStorage.height === "00" || localStorage.weight === "00") {
        alert("Please fill in all the fields and insert valid values.");
    } else {
        window.location.href = "tool/index.html";
    }
}); 

document.getElementById('closingBtn').addEventListener('click', function() {
    document.getElementsByClassName("about")[0].style.display = "none";
});

document.getElementById('aboutBtn').addEventListener('click', function() {
    document.getElementsByClassName("about")[0].style.display = "block";
});

// Apply styles based on the installed parameter
if (isInstalled) {
    
}