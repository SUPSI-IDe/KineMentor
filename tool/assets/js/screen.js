//Questo file contiene tutte le funzioni di aggiornamento informazioni a schermo come sesso, altezza e peso

export function aggiornamentoFunzioniSchermo () {
    // Definizioni variabili da recuperare dal localStorage
        var sexInfo = document.getElementById("sex");
        var weightInfo = document.getElementById("weight");
        var heightInfo = document.getElementById("height");

        sexInfo.innerHTML = localStorage.getItem("sex");
        weightInfo.innerHTML = localStorage.getItem("weight");
        heightInfo.innerHTML = localStorage.getItem("height");

    // Definizione variabili e funzioni bottoni back, info e close
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
}