//Appunti aggiuntivi a blocco note

//Valore del ginocchio = 151 creato da interpolate (da rendere più carino sinusoidale)

var mioArray = [];
    console.log(mioArray);

    var numPiccolissimo = Infinity;


    //La prima passata di for prende i valori limite da UI
    for (var angoloCaviglia = 66; angoloCaviglia < 98; angoloCaviglia++){
        for (var angoloAnca = 30; angoloAnca < 180; angoloAnca++){
            //Centro di massa controllo
            //var centroMassa = (0 < (calcoloCM) < piedeMax) ? calcoloCM : Infinity
            var valoreIdeale = Math.random(2,5); //Al posto di random c'è calcolo absolute(CentroMassa - PuntoIdeale) + absolute(angolo tra torso e tibia)
            if(numPiccolissimo > valoreIdeale){
                numPiccolissimo = valoreIdeale;
                //Aggiorno le 6 variabili: centro di massa, angolo anca, coppia anca, ancolo caviglia, coppia caviglia, ginocchio angolo, ginocchio coppia
                //Salvo le coordinate del corpo per il disegno: caviglia [x, y], etc.
            }
            mioArray.push(valoreIdeale); 
        }
    }

    //Restituisce gli indici degli angoli di caviglia e anca (es. 18 132)

    //Dalla seconda passata di for in poi prende i valori di for dal risultato calcolato precedentemente +/- 10 gradi o step (creare variabile per step)