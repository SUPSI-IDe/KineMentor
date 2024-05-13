var maleBtn = document.getElementById("maleBtn");
var femaleBtn = document.getElementById("femaleBtn");
localStorage.setItem("sex", "female");
document.getElementById("maleCheck").style.display = "none";
document.getElementById("checkKg").style.display = "none";
document.getElementById("checkCm").style.display = "none";

var figure = document.getElementById("figure");
var weightInput = document.getElementById("weightInput");
var heightInput = document.getElementById("heightInput");

var submitBtn = document.getElementById("submitBtn");

var maleBtnWidth = document.getElementById('maleBtn').getBoundingClientRect().width;
var femaleBtnWidth = document.getElementById('femaleBtn').getBoundingClientRect().width;

inputWidth = maleBtnWidth + femaleBtnWidth;

document.getElementById('weightInput').style.width = 'calc(' + inputWidth + 'px' + ' + 2vw)';
document.getElementById('heightInput').style.width = 'calc(' + inputWidth + 'px' + ' + 2vw)';

maleBtn.addEventListener("click", function() {
    if (localStorage.getItem("sex") != "male"){
        maleBtn.classList.add("clicked");
        document.getElementById("maleCheck").style.display = "inline-block";
        femaleBtn.classList.remove("clicked");
        document.getElementById("femaleCheck").style.display = "none";
        localStorage.setItem("sex", "male");
        figure.classList.remove("figureWoman");
        figure.classList.add("figureMan");
    }
});

femaleBtn.addEventListener("click", function() {
    if (localStorage.getItem("sex") != "female"){
        femaleBtn.classList.add("clicked");
        document.getElementById("femaleCheck").style.display = "inline-block";
        maleBtn.classList.remove("clicked");
        document.getElementById("maleCheck").style.display = "none";
        localStorage.setItem("sex", "female");
        figure.classList.remove("figureMan");
        figure.classList.add("figureWoman");
    }
});

weightInput.addEventListener("focusin", function() {
    weightInput.placeholder = "";
    weightInput.style.opacity = 1;
    var chilos = document.getElementById("chilos");
    chilos.style.display = "none";
    var kgPlaceholder = document.getElementById("kgPlaceholder");
    kgPlaceholder.style.display = "block";
});

weightInput.addEventListener("focusout", function() {
    weightInput.placeholder = "ENTER THE WEIGHT IN KG";
    if (weightInput.value == "") {
        weightInput.style.opacity = 0.2;
    }
    var kgPlaceholder = document.getElementById("kgPlaceholder");
    kgPlaceholder.style.display = "none";
});

heightInput.addEventListener("focusin", function() {
    heightInput.placeholder = "";
    heightInput.style.opacity = 1;
    var centimeter = document.getElementById("centimeter");
    centimeter.style.display = "none";
    var cmPlaceholder = document.getElementById("cmPlaceholder");
    cmPlaceholder.style.display = "block";
});

heightInput.addEventListener("focusout", function() {
    heightInput.placeholder = "ENTER THE HEIGHT IN CM";
    if (heightInput.value == "") {
        heightInput.style.opacity = 0.2;
    }
    var cmPlaceholder = document.getElementById("cmPlaceholder");
    cmPlaceholder.style.display = "none";
});

weightInput.addEventListener("change", function() {
    if (this.value == "") {
        weightInput.style.opacity = 0.2;
        var chilos = document.getElementById("chilos");
        chilos.style.display = "none";
    } else {
        weightInput.style.opacity = 1;
        var chilos = document.getElementById("chilos");
        chilos.style.display = "block";
        document.getElementById("checkKg").style.display = "inline-block";
    }

    let v = parseInt(this.value);
    if (v < this.min) this.value = this.min;
    if (v > this.max) this.value = this.max;

    var weight = weightInput.value;
    localStorage.setItem("weight", weight);
    console.log("Weight: " + weight);
});

heightInput.addEventListener("change", function() {
    if (this.value == "") {
        heightInput.style.opacity = 0.2;
        var centimeter = document.getElementById("centimeter");
        centimeter.style.display = "none";
    } else {
        heightInput.style.opacity = 1;
        var centimeter = document.getElementById("centimeter");
        centimeter.style.display = "block";
        document.getElementById("checkCm").style.display = "inline-block";
    }
    
    let v = parseInt(this.value);
    if (v < this.min) this.value = this.min;
    if (v > this.max) this.value = this.max;

    var height = heightInput.value;
    localStorage.setItem("height", height);
    console.log("Height: " + height);

    var figureHeight = document.getElementById("figure");
    figureHeight.style.backgroundSize = "100% " + (height/2) + "%";
});

submitBtn.addEventListener("click", function() {
    weight = document.getElementById("weightInput").value;
    height = document.getElementById("heightInput").value;

    if (weight == "" || height == "" || localStorage.getItem("sex") == "none"){
        alert("Please fill all the fields");
        return;
    } else {
        console.log("Sex: " + localStorage.getItem("sex"));
        console.log("Weight: " + localStorage.getItem("weight"));
        console.log("Height: " + localStorage.getItem("height"));
        window.location.href = "tool/index.html";
    }
});

window.addEventListener("resize", function() {
    maleBtnWidth = document.getElementById('maleBtn').getBoundingClientRect().width;
    femaleBtnWidth = document.getElementById('femaleBtn').getBoundingClientRect().width;

    inputWidth = maleBtnWidth + femaleBtnWidth;

    document.getElementById('weightInput').style.width = 'calc(' + inputWidth + 'px' + ' + 2vw)';
    document.getElementById('heightInput').style.width = 'calc(' + inputWidth + 'px' + ' + 2vw)';
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