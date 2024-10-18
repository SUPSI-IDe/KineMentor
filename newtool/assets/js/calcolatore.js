export function setupAngoli(umano, pesoManubrio, posizioneManubrio, minCaviglia, maxCaviglia, minAnca, maxAnca, maxGinocchio){
    var minValIdeale = Infinity;

    for (var angoloCaviglia = minCaviglia; angoloCaviglia <= maxCaviglia; angoloCaviglia++){
        for (var angoloAnca = minAnca; angoloAnca <= maxAnca; angoloAnca++){
            var posGinocchio = [Infinity, Infinity];
            var posAnca = [Infinity, Infinity];
            var posSpalla = [Infinity, Infinity];
            var posTesta = [Infinity, Infinity];
            var posGomito = [Infinity, Infinity];
            var posImpugnatura = [Infinity, Infinity];
            
            //Calcolo coordinate articolari
            posGinocchio[0] = umano.posCaviglia[0] + umano.lunghezzaTibia * Math.cos((Math.PI / 180) * angoloCaviglia);
            posGinocchio[1] = umano.posCaviglia[1] + umano.lunghezzaTibia * Math.sin((Math.PI / 180) * angoloCaviglia);
            posAnca[0] = posGinocchio[0] + umano.lunghezzaFemore * Math.cos((Math.PI / 180) * (angoloCaviglia + (180 - maxGinocchio)));
            posAnca[1] = posGinocchio[1] + umano.lunghezzaFemore * Math.sin((Math.PI / 180) * (angoloCaviglia + (180 - maxGinocchio)));
            posSpalla[0] = posAnca[0] + umano.lunghezzaTorace * Math.cos((Math.PI / 180) * (angoloCaviglia - maxGinocchio + angoloAnca));
            posSpalla[1] = posAnca[1] + umano.lunghezzaTorace * Math.sin((Math.PI / 180) * (angoloCaviglia - maxGinocchio + angoloAnca));
            posTesta[0] = posSpalla[0] + umano.lunghezzaCollo * Math.cos((Math.PI / 180) * (angoloCaviglia - maxGinocchio + angoloAnca));
            posTesta[1] = posSpalla[1] + umano.lunghezzaCollo * Math.sin((Math.PI / 180) * (angoloCaviglia - maxGinocchio + angoloAnca));
            posGomito[0] = posSpalla[0] + posizioneManubrio/2;
            posGomito[1] = posSpalla[1] - Math.sqrt(Math.pow(umano.lunghezzaAvambraccio, 2) - Math.pow((posizioneManubrio/2), 2));
            posImpugnatura[0] = posSpalla[0] + posizioneManubrio;
            posImpugnatura[1] = posSpalla[1];

            //Calcolo baricentri articolari
            var baricentroTibia = [umano.posCaviglia[0] + (umano.lunghezzaTibia * 0.43) * Math.cos((Math.PI / 180) * angoloCaviglia), umano.posCaviglia[1] + (umano.lunghezzaTibia * 0.43) * Math.sin((Math.PI / 180) * angoloCaviglia)];
            var baricentroFemore = [posGinocchio[0] + (umano.lunghezzaFemore * 0.50) * Math.cos((Math.PI / 180) * (angoloCaviglia + (180 - maxGinocchio))), posGinocchio[1] + (umano.lunghezzaFemore * 0.50) * Math.sin((Math.PI / 180) * (angoloCaviglia + (180 - maxGinocchio)))];
            var baricentroToraceTesta = [posAnca[0] + (umano.lunghezzaTorace * 0.50) * Math.cos((Math.PI / 180) * (angoloCaviglia - maxGinocchio + angoloAnca)), posAnca[1] + (umano.lunghezzaTorace * 0.50) * Math.sin((Math.PI / 180) * (angoloCaviglia - maxGinocchio + angoloAnca))];
            var baricentroBraccio = [posSpalla[0] + posizioneManubrio/4, posSpalla[1] - Math.sqrt(Math.pow(umano.lunghezzaAvambraccio, 2) - Math.pow((posizioneManubrio/2), 2))/2];
            var baricentroAvambraccio = [posSpalla[0] + posizioneManubrio/2 + posizioneManubrio/4, posSpalla[1] - Math.sqrt(Math.pow(umano.lunghezzaAvambraccio, 2) - Math.pow((posizioneManubrio/2), 2))/2];

            //Calcolo coppie articolari
            const g = 9.80665; //accelerazione di gravità in m*s^-2
            var coppiaAnca = g*(pesoManubrio *(posImpugnatura[0] - posAnca[0]) + umano.pesoAvambraccio * (baricentroAvambraccio[0] - posAnca[0]) + umano.pesoBraccio * (baricentroBraccio[0] - posAnca[0]) + umano.pesoTorace * (baricentroToraceTesta[0] - posAnca[0]) + umano.pesoTesta * (baricentroToraceTesta[0] - posAnca[0]))/100;
            var coppiaGinocchio = g*(pesoManubrio *(posImpugnatura[0] - posGinocchio[0]) + umano.pesoAvambraccio * (baricentroAvambraccio[0] - posGinocchio[0]) + umano.pesoBraccio * (baricentroBraccio[0] - posGinocchio[0]) + umano.pesoTorace * (baricentroToraceTesta[0] - posGinocchio[0]) + umano.pesoTesta * (baricentroToraceTesta[0] - posGinocchio[0]) + umano.pesoFemore * (baricentroFemore[0] - posGinocchio[0]))/100;
            var coppiaCaviglia = g*(pesoManubrio *(posImpugnatura[0] - umano.posCaviglia[0]) + umano.pesoAvambraccio * (baricentroAvambraccio[0] - umano.posCaviglia[0]) + umano.pesoBraccio * (baricentroBraccio[0] - umano.posCaviglia[0]) + umano.pesoTorace * (baricentroToraceTesta[0] - umano.posCaviglia[0]) + umano.pesoTesta * (baricentroToraceTesta[0] - umano.posCaviglia[0]) + umano.pesoFemore * (baricentroFemore[0] - umano.posCaviglia[0]) + umano.pesoTibia * (baricentroTibia[0] - umano.posCaviglia[0]))/100;

            var centroDiMassa = coppiaCaviglia/((umano.peso - umano.pesoPiede + pesoManubrio)/g);

            if (0 < centroDiMassa < umano.lunghezzaPiede){
                var valoreIdeale = Math.abs(centroDiMassa - 4) + Math.abs(angoloAnca - maxGinocchio);
                
                if(minValIdeale > valoreIdeale){
                    minValIdeale = valoreIdeale;
                    umano.posGinocchio = posGinocchio;
                    umano.posAnca = posAnca;
                    umano.posSpalla = posSpalla;
                    umano.posTesta = posTesta;
                    umano.posGomito = posGomito;
                    umano.posImpugnatura = posImpugnatura;

                    umano.baricentroTibia = baricentroTibia;
                    umano.baricentroFemore = baricentroFemore;
                    umano.baricentroToraceTesta = baricentroToraceTesta;
                    umano.baricentroBraccio = baricentroBraccio;
                    umano.baricentroAvambraccio = baricentroAvambraccio;

                    umano.coppiaAnca = coppiaAnca;
                    umano.angoloAnca = angoloAnca;
                    umano.coppiaGinocchio = coppiaGinocchio;
                    umano.angoloGinocchio = maxGinocchio;
                    umano.coppiaCaviglia = coppiaCaviglia;
                    umano.angoloCaviglia = angoloCaviglia;

                    umano.centroDiMassa = centroDiMassa;
                }
            }    
        }
    }
}

export function aggiornamentoAngoli(umano, pesoManubrio, posizioneManubrio, minCaviglia, maxCaviglia, minAnca, maxAnca, minGinocchio, maxGinocchio){
    var minValIdeale = Infinity;

    const valoreRestringimentoAngoli = 5;

    ((umano.angoloCaviglia - valoreRestringimentoAngoli) > minCaviglia) ? minCaviglia = umano.angoloCaviglia - valoreRestringimentoAngoli : minCaviglia = minCaviglia;
    ((umano.angoloCaviglia + valoreRestringimentoAngoli) < maxCaviglia) ? maxCaviglia = umano.angoloCaviglia + valoreRestringimentoAngoli : maxCaviglia = maxCaviglia;
    ((umano.angoloAnca - valoreRestringimentoAngoli) > minAnca) ? minAnca = umano.angoloAnca - valoreRestringimentoAngoli : minAnca = minAnca;
    ((umano.angoloAnca + valoreRestringimentoAngoli) < maxAnca) ? maxAnca = umano.angoloAnca + 5 : maxAnca = maxAnca;

    if (umano.angoloGinocchioPrecedente > umano.angoloGinocchio && minGinocchio < umano.angoloGinocchio){
        var angoloGinocchioCorrente = umano.angoloGinocchio - 1;
    } else if (umano.angoloGinocchioPrecedente < umano.angoloGinocchio && umano.angoloGinocchio < maxGinocchio){
        var angoloGinocchioCorrente = umano.angoloGinocchio + 1;
    } else if (umano.angoloGinocchio < maxGinocchio && minGinocchio <= umano.angoloGinocchio) {
        var angoloGinocchioCorrente = umano.angoloGinocchio + 1;
    } else if (umano.angoloGinocchio > minGinocchio && umano.angoloGinocchio <= maxGinocchio) {
        var angoloGinocchioCorrente = umano.angoloGinocchio - 1;
    } else {
        throw "angolo ginocchio non compreso tra min e max. Valori di calcolo: " + umano.angoloGinocchio + ", " + minGinocchio + ", " + maxGinocchio;
    }
    var angoloGinocchioPrecedente = umano.angoloGinocchio;

    for (var angoloCavigliaStretto = minCaviglia; angoloCavigliaStretto <= maxCaviglia; angoloCavigliaStretto++){
        for (var angoloAncaStretto = minAnca; angoloAncaStretto <= maxAnca; angoloAncaStretto++){

            var posGinocchio = [Infinity, Infinity];
            var posAnca = [Infinity, Infinity];
            var posSpalla = [Infinity, Infinity];
            var posTesta = [Infinity, Infinity];
            var posGomito = [Infinity, Infinity];
            var posImpugnatura = [Infinity, Infinity];
            
            //Calcolo coordinate articolari
            posGinocchio[0] = umano.posCaviglia[0] + umano.lunghezzaTibia * Math.cos((Math.PI / 180) * angoloCavigliaStretto);
            posGinocchio[1] = umano.posCaviglia[1] + umano.lunghezzaTibia * Math.sin((Math.PI / 180) * angoloCavigliaStretto);
            posAnca[0] = posGinocchio[0] + umano.lunghezzaFemore * Math.cos((Math.PI / 180) * (angoloCavigliaStretto + (180 - angoloGinocchioCorrente)));
            posAnca[1] = posGinocchio[1] + umano.lunghezzaFemore * Math.sin((Math.PI / 180) * (angoloCavigliaStretto + (180 - angoloGinocchioCorrente)));
            posSpalla[0] = posAnca[0] + umano.lunghezzaTorace * Math.cos((Math.PI / 180) * (angoloCavigliaStretto - angoloGinocchioCorrente + angoloAncaStretto));
            posSpalla[1] = posAnca[1] + umano.lunghezzaTorace * Math.sin((Math.PI / 180) * (angoloCavigliaStretto - angoloGinocchioCorrente + angoloAncaStretto));
            posTesta[0] = posSpalla[0] + umano.lunghezzaCollo * Math.cos((Math.PI / 180) * (angoloCavigliaStretto - angoloGinocchioCorrente + angoloAncaStretto));
            posTesta[1] = posSpalla[1] + umano.lunghezzaCollo * Math.sin((Math.PI / 180) * (angoloCavigliaStretto - angoloGinocchioCorrente + angoloAncaStretto));
            posGomito[0] = posSpalla[0] + posizioneManubrio/2;
            posGomito[1] = posSpalla[1] - Math.sqrt(Math.pow(umano.lunghezzaAvambraccio, 2) - Math.pow((posizioneManubrio/2), 2));
            posImpugnatura[0] = posSpalla[0] + posizioneManubrio;
            posImpugnatura[1] = posSpalla[1];

            //Calcolo baricentri articolari
            var baricentroTibia = [umano.posCaviglia[0] + (umano.lunghezzaTibia * 0.43) * Math.cos((Math.PI / 180) * angoloCavigliaStretto), umano.posCaviglia[1] + (umano.lunghezzaTibia * 0.43) * Math.sin((Math.PI / 180) * angoloCavigliaStretto)];
            var baricentroFemore = [posGinocchio[0] + (umano.lunghezzaFemore * 0.50) * Math.cos((Math.PI / 180) * (angoloCavigliaStretto + (180 - angoloGinocchioCorrente))), posGinocchio[1] + (umano.lunghezzaFemore * 0.50) * Math.sin((Math.PI / 180) * (angoloCavigliaStretto + (180 - angoloGinocchioCorrente)))];
            var baricentroToraceTesta = [posAnca[0] + (umano.lunghezzaTorace * 0.50) * Math.cos((Math.PI / 180) * (angoloCavigliaStretto - angoloGinocchioCorrente + angoloAncaStretto)), posAnca[1] + (umano.lunghezzaTorace * 0.50) * Math.sin((Math.PI / 180) * (angoloCavigliaStretto - angoloGinocchioCorrente + angoloAncaStretto))];
            var baricentroBraccio = [posSpalla[0] + posizioneManubrio/4, posSpalla[1] - Math.sqrt(Math.pow(umano.lunghezzaAvambraccio, 2) - Math.pow((posizioneManubrio/2), 2))/2];
            var baricentroAvambraccio = [posSpalla[0] + posizioneManubrio/2 + posizioneManubrio/4, posSpalla[1] - Math.sqrt(Math.pow(umano.lunghezzaAvambraccio, 2) - Math.pow((posizioneManubrio/2), 2))/2];
            
            //Calcolo coppie articolari
            const g = 9.80665; //accelerazione di gravità
            var coppiaAnca = g*(pesoManubrio *(posImpugnatura[0] - posAnca[0]) + umano.pesoAvambraccio * (baricentroAvambraccio[0] - posAnca[0]) + umano.pesoBraccio * (baricentroBraccio[0] - posAnca[0]) + umano.pesoTorace * (baricentroToraceTesta[0] - posAnca[0]) + umano.pesoTesta * (baricentroToraceTesta[0] - posAnca[0]))/100;
            var coppiaGinocchio = g*(pesoManubrio *(posImpugnatura[0] - posGinocchio[0]) + umano.pesoAvambraccio * (baricentroAvambraccio[0] - posGinocchio[0]) + umano.pesoBraccio * (baricentroBraccio[0] - posGinocchio[0]) + umano.pesoTorace * (baricentroToraceTesta[0] - posGinocchio[0]) + umano.pesoTesta * (baricentroToraceTesta[0] - posGinocchio[0]) + umano.pesoFemore * (baricentroFemore[0] - posGinocchio[0]))/100;
            var coppiaCaviglia = g*(pesoManubrio *(posImpugnatura[0] - umano.posCaviglia[0]) + umano.pesoAvambraccio * (baricentroAvambraccio[0] - umano.posCaviglia[0]) + umano.pesoBraccio * (baricentroBraccio[0] - umano.posCaviglia[0]) + umano.pesoTorace * (baricentroToraceTesta[0] - umano.posCaviglia[0]) + umano.pesoTesta * (baricentroToraceTesta[0] - umano.posCaviglia[0]) + umano.pesoFemore * (baricentroFemore[0] - umano.posCaviglia[0]) + umano.pesoTibia * (baricentroTibia[0] - umano.posCaviglia[0]))/100;

            var centroDiMassa = coppiaCaviglia/((umano.peso - umano.pesoPiede + pesoManubrio)/g);

            if (centroDiMassa < umano.lunghezzaPiede && centroDiMassa > 0){
                var valoreIdeale = Math.abs(centroDiMassa - 4) + Math.abs(angoloAncaStretto - angoloGinocchioCorrente);
                
                if(minValIdeale > valoreIdeale){
                    minValIdeale = valoreIdeale;
                    umano.posGinocchio = posGinocchio;
                    umano.posAnca = posAnca;
                    umano.posSpalla = posSpalla;
                    umano.posTesta = posTesta;
                    umano.posGomito = posGomito;
                    umano.posImpugnatura = posImpugnatura;

                    umano.baricentroTibia = baricentroTibia;
                    umano.baricentroFemore = baricentroFemore;
                    umano.baricentroToraceTesta = baricentroToraceTesta;
                    umano.baricentroBraccio = baricentroBraccio;
                    umano.baricentroAvambraccio = baricentroAvambraccio;

                    umano.coppiaAnca = coppiaAnca;
                    umano.angoloAnca = angoloAncaStretto;
                    umano.coppiaGinocchio = coppiaGinocchio;
                    umano.angoloGinocchio = angoloGinocchioCorrente;
                    umano.coppiaCaviglia = coppiaCaviglia;
                    umano.angoloCaviglia = angoloCavigliaStretto;

                    umano.centroDiMassa = centroDiMassa;
                }
            }

            umano.angoloGinocchioPrecedente = angoloGinocchioPrecedente;
        }
    }
}