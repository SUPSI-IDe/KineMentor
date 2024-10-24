localStorage.setItem("sex", "none");
localStorage.setItem("height", "00");
localStorage.setItem("weight", "00");

function sexSelection(button) {
    if (!button.classList.contains("btnClicked")) {
        button.classList.add("btnClicked");
    }

    if (button.textContent == "MALE") {
        document.getElementById("humanWoman").style.display = "none";
        document.getElementById("humanMan").style.display = "block";
        document.getElementById("femaleBtn").classList.remove("btnClicked");
    } else if (button.textContent == "FEMALE"){
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

document.getElementById('startBtn').addEventListener('click', function() {
    console.log(localStorage);
    if (localStorage.sex === "none" || localStorage.height === "00" || localStorage.weight === "00") {
        alert("Please fill in all the fields and insert valid values.");
    } else {
        window.location.href = "index.html";
    }
}); 

document.getElementById('closingBtn').addEventListener('click', function() {
    document.getElementsByClassName("about")[0].style.display = "none";
});

document.getElementById('aboutBtn').addEventListener('click', function() {
    document.getElementsByClassName("about")[0].style.display = "block";
});
