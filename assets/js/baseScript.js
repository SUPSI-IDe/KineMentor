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

document.getElementById('weightInput').addEventListener('input', function() {
    if (this.value.trim() !== "" && document.getElementById('heightInput').value.trim() !== "") {
        if (parseInt(document.getElementById('weightInput').value) > parseInt(document.getElementById('weightInput').min) && parseInt(document.getElementById('weightInput').value) < parseInt(document.getElementById('weightInput').max) && parseInt(document.getElementById('heightInput').value) > parseInt(document.getElementById('heightInput').min) && parseInt(document.getElementById('heightInput').value) < parseInt(document.getElementById('heightInput').max)){
            let bmi = (parseInt(this.value) / Math.pow((parseInt(document.getElementById('heightInput').value) / 100), 2)).toFixed(1);
            document.getElementById('bmiNr').textContent = bmi;
            bmi < 18.5 ? document.getElementById('bmiName').textContent = "Underweight" : bmi < 24.9 ? document.getElementById('bmiName').textContent = "Normalweight" : bmi < 29.9 ? document.getElementById('bmiName').textContent = "Overweigth" : document.getElementById('bmiName').textContent = "Obesity";
            document.getElementById('bmiResult').style.display = "block";
            localStorage.setItem("bmi", document.getElementById('bmiName').textContent);
        }
    } else {
        document.getElementById('bmiResult').style.display = "none";
        localStorage.setItem("bmi", "none");
    }
});

document.getElementById('heightInput').addEventListener('input', function() {
    if (this.value.trim() !== "" && document.getElementById('heightInput').value.trim() !== "") {
        if (parseInt(document.getElementById('weightInput').value) > parseInt(document.getElementById('weightInput').min) && parseInt(document.getElementById('weightInput').value) < parseInt(document.getElementById('weightInput').max) && parseInt(document.getElementById('heightInput').value) > parseInt(document.getElementById('heightInput').min) && parseInt(document.getElementById('heightInput').value) < parseInt(document.getElementById('heightInput').max)){
            let bmi = (parseInt(this.value) / Math.pow((parseInt(document.getElementById('heightInput').value) / 100), 2)).toFixed(1);
            document.getElementById('bmiNr').textContent = bmi;
            bmi < 18.5 ? document.getElementById('bmiName').textContent = "Underweight" : bmi < 24.9 ? document.getElementById('bmiName').textContent = "Normal Weight" : bmi < 29.9 ? document.getElementById('bmiName').textContent = "Overweigth" : document.getElementById('bmiName').textContent = "Obesity";
            document.getElementById('bmiResult').style.display = "block";
            localStorage.setItem("bmi", document.getElementById('bmiName').textContent);
        }
    } else {
        document.getElementById('bmiResult').style.display = "none";
        localStorage.setItem("bmi", "none");
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
