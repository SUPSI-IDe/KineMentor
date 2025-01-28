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

            // Calcolo percentuali corpo femminile
            document.getElementById("femaleHeadPercentage").innerHTML = "9,73";
            document.getElementById("femaleTrunkPercentage").innerHTML = "42,27";
            document.getElementById("femaleUpperArmPercentage").innerHTML = "2,67";
            document.getElementById("femaleForearmPercentage").innerHTML = "2,00";
            document.getElementById("femaleHandPercentage").innerHTML = "1,07";
            document.getElementById("femaleThighPercentage").innerHTML = "11,11";
            document.getElementById("femaleShankPercentage").innerHTML = "4,89";
            document.getElementById("femaleFootPercentage").innerHTML = "2,27";

            // Calcolo percentuali corpo maschile
            document.getElementById("maleHeadPercentage").innerHTML = "10,00";
            document.getElementById("maleTrunkPercentage").innerHTML = "40,80";
            document.getElementById("maleUpperArmPercentage").innerHTML = "3,17";
            document.getElementById("maleForearmPercentage").innerHTML = "2,33";
            document.getElementById("maleHandPercentage").innerHTML = "1,00";
            document.getElementById("maleThighPercentage").innerHTML = "10,00";
            document.getElementById("maleShankPercentage").innerHTML = "5,83";
            document.getElementById("maleFootPercentage").innerHTML = "2,27";
        }
        if(localStorage.getItem("bmi") == "Normalweight") {
            document.getElementById("nW_info").classList.add("bmiSelected");

            // Calcolo percentuali corpo femminile
            document.getElementById("femaleHeadPercentage").innerHTML = "7,30";
            document.getElementById("femaleTrunkPercentage").innerHTML = "43,30";
            document.getElementById("femaleUpperArmPercentage").innerHTML = "2,50";
            document.getElementById("femaleForearmPercentage").innerHTML = "1,70";
            document.getElementById("femaleHandPercentage").innerHTML = "0,80";
            document.getElementById("femaleThighPercentage").innerHTML = "14,00";
            document.getElementById("femaleShankPercentage").innerHTML = "4,00";
            document.getElementById("femaleFootPercentage").innerHTML = "1,70";

            // Calcolo percentuali corpo maschile
            document.getElementById("maleHeadPercentage").innerHTML = "7,50";
            document.getElementById("maleTrunkPercentage").innerHTML = "47,70";
            document.getElementById("maleUpperArmPercentage").innerHTML = "3,00";
            document.getElementById("maleForearmPercentage").innerHTML = "1,90";
            document.getElementById("maleHandPercentage").innerHTML = "0,80";
            document.getElementById("maleThighPercentage").innerHTML = "10,00";
            document.getElementById("maleShankPercentage").innerHTML = "5,00";
            document.getElementById("maleFootPercentage").innerHTML = "1,70";
        }
        if(localStorage.getItem("bmi") == "Overweigth") {
            document.getElementById("oW_info").classList.add("bmiSelected");

            // Calcolo percentuali corpo femminile
            document.getElementById("femaleHeadPercentage").innerHTML = "4,87";
            document.getElementById("femaleTrunkPercentage").innerHTML = "39,36";
            document.getElementById("femaleUpperArmPercentage").innerHTML = "3,33";
            document.getElementById("femaleForearmPercentage").innerHTML = "1,44";
            document.getElementById("femaleHandPercentage").innerHTML = "0,67";
            document.getElementById("femaleThighPercentage").innerHTML = "16,67";
            document.getElementById("femaleShankPercentage").innerHTML = "4,44";
            document.getElementById("femaleFootPercentage").innerHTML = "1,33";

            // Calcolo percentuali corpo maschile
            document.getElementById("maleHeadPercentage").innerHTML = "5,42";
            document.getElementById("maleTrunkPercentage").innerHTML = "53,42";
            document.getElementById("maleUpperArmPercentage").innerHTML = "3,17";
            document.getElementById("maleForearmPercentage").innerHTML = "1,50";
            document.getElementById("maleHandPercentage").innerHTML = "0,58";
            document.getElementById("maleThighPercentage").innerHTML = "10,00";
            document.getElementById("maleShankPercentage").innerHTML = "4,00";
            document.getElementById("maleFootPercentage").innerHTML = "1,33";
        }
        if(localStorage.getItem("bmi") == "Obesity") {
            document.getElementById("O_info").classList.add("bmiSelected");

            // Calcolo percentuali corpo femminile
            document.getElementById("femaleHeadPercentage").innerHTML = "4,87";
            document.getElementById("femaleTrunkPercentage").innerHTML = "39,36";
            document.getElementById("femaleUpperArmPercentage").innerHTML = "3,33";
            document.getElementById("femaleForearmPercentage").innerHTML = "1,44";
            document.getElementById("femaleHandPercentage").innerHTML = "0,67";
            document.getElementById("femaleThighPercentage").innerHTML = "16,67";
            document.getElementById("femaleShankPercentage").innerHTML = "4,44";
            document.getElementById("femaleFootPercentage").innerHTML = "1,33";

            // Calcolo percentuali corpo maschile
            document.getElementById("maleHeadPercentage").innerHTML = "5,42";
            document.getElementById("maleTrunkPercentage").innerHTML = "53,42";
            document.getElementById("maleUpperArmPercentage").innerHTML = "3,17";
            document.getElementById("maleForearmPercentage").innerHTML = "1,50";
            document.getElementById("maleHandPercentage").innerHTML = "0,58";
            document.getElementById("maleThighPercentage").innerHTML = "10,00";
            document.getElementById("maleShankPercentage").innerHTML = "4,00";
            document.getElementById("maleFootPercentage").innerHTML = "1,33";
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