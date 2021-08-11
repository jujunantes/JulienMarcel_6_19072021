import { tableauHTMLPhotographes } from "./variables.js";

document.getElementById('fltPortrait').addEventListener("click", filtrageTheme);
document.getElementById('fltArt').addEventListener("click", filtrageTheme);
document.getElementById('fltFashion').addEventListener("click", filtrageTheme);
document.getElementById('fltArchitecture').addEventListener("click", filtrageTheme);
document.getElementById('fltTravel').addEventListener("click", filtrageTheme);
document.getElementById('fltSport').addEventListener("click", filtrageTheme);
document.getElementById('fltAnimals').addEventListener("click", filtrageTheme);
document.getElementById('fltEvents').addEventListener("click", filtrageTheme);

function filtrageTheme(e) {
    /*
        Fonctionnement :
            - dans main.js on a stocké le html de chaque carte de photographe dans tableauHTMLPhotographes[]
            - maintenant :
                - on récupère le filtre qui a déclenché l'appel
                - on construit le span de filtre recherché
                - on cycle dans le tableau pour retrouver toutes les occurences de ce span
                - auquel cas, on ajoute la carte au html à injecter ensuite
    */
    let monHTML = '';
    let filtreCherche = `<span class="spanFiltres">#`+ e.target.id.substring(3).toLowerCase() +`</span>`;
    let occurences = 0;
    for(let i=0; i<tableauHTMLPhotographes.length; i++)
        if (tableauHTMLPhotographes[i].includes(filtreCherche)) {
            monHTML += tableauHTMLPhotographes[i];
            occurences++;
        }
    // On modifie le nombre de colonnes de notre "main" en fonction du nombre d'occurences
    switch(occurences) {
        case 1:
            document.getElementById("main").style.columns = 1;
            break;
        case 2:
            document.getElementById("main").style.columns = 2;
            break;
        default:
            document.getElementById("main").style.columns = 3;
    }
    document.getElementById('nosPhotographes').innerHTML = monHTML;
}