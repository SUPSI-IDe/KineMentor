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
}