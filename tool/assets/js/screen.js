//Questo file contiene tutte le funzioni di aggiornamento informazioni a schermo come sesso, altezza e peso

export function aggiornamentoFunzioniSchermo () {
    // Definizioni variabili da recuperare dal localStorage
        const sexInfo = document.getElementById("sexInfo");
        const weightInfo = document.getElementById("weightInfo");
        const heightInfo = document.getElementById("heightInfo");
        const bmiInfo = document.getElementById("bmiInfo");

        sexInfo.innerHTML = localStorage.getItem("sex");
        weightInfo.innerHTML = localStorage.getItem("weight");
        heightInfo.innerHTML = (localStorage.getItem("height")/100).toFixed(2);
        bmiInfo.innerHTML = localStorage.getItem("bmi");

    // Definizione variabili e funzioni bottoni back, info e close
        var backBtn = document.getElementById("editBtn");
        backBtn.addEventListener("click", function() {
            localStorage.setItem("sex", "none");
            localStorage.setItem("height", "00");
            localStorage.setItem("weight", "00");
            localStorage.setItem("bmi", "none");
            window.location.href = "../index.html";
        });

        document.getElementById('closingBtn').addEventListener('click', function() {
            document.getElementsByClassName("about")[0].style.display = "none";
        });
        
        document.getElementById('aboutBtn').addEventListener('click', function() {
            document.getElementsByClassName("about")[0].style.display = "block";
        });

        document.getElementById('closingBtnInfo').addEventListener('click', function() {
            document.getElementsByClassName("info")[0].style.display = "none";
        });
        
        document.getElementById('infoBtn').addEventListener('click', function() {
            document.getElementsByClassName("info")[0].style.display = "block";
        });

        document.getElementById('incomingData').addEventListener('click', function() {
            document.getElementsByClassName("info")[0].style.display = "block";
        });

        if(localStorage.getItem("bmi") == "Underweight") {
            document.getElementById("uW_info").classList.add("bmiSelected");
        }
        if(localStorage.getItem("bmi") == "Normalweight") {
            document.getElementById("nW_info").classList.add("bmiSelected");
        }
        if(localStorage.getItem("bmi") == "Overweigth") {
            document.getElementById("oW_info").classList.add("bmiSelected");
        }
        if(localStorage.getItem("bmi") == "Obesity") {
            document.getElementById("O_info").classList.add("bmiSelected");
        }
    
    // Bottoni info slider
    document.getElementById("hipInfo").addEventListener("click", function() {
        document.getElementById("hipInfoBox").style.display = "flex";
    });
    document.getElementById("hipInfoClosingBtn").addEventListener("click", function() {
        document.getElementById("hipInfoBox").style.display = "none";
    });
    
    document.getElementById("kneeInfo").addEventListener("click", function() {
        document.getElementById("kneeInfoBox").style.display = "flex";
    });
    document.getElementById("kneeInfoClosingBtn").addEventListener("click", function() {
        document.getElementById("kneeInfoBox").style.display = "none";
    });

    document.getElementById("ankleInfo").addEventListener("click", function() {
        document.getElementById("ankleInfoBox").style.display = "flex";
    });
    document.getElementById("ankleInfoClosingBtn").addEventListener("click", function() {
        document.getElementById("ankleInfoBox").style.display = "none";
    });
}