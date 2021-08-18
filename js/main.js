import { creePhotographe } from "./photographeFactory.js";

var tableauHTMLPhotographes = [];   // On stocke le html de chaque photographe, car il sera réutilisé avec les filtres
var tableauPhotographes = [];       // Ce tableau contient les données des photographes, pour ne pas avoir à recharger le fichier json

/*
    On affiche, depuis le fichier JSON, les photographes :
    sources :
        fetch   : https://www.pierre-giraud.com/javascript-apprendre-coder-cours/api-fetch/
        factory : https://medium.com/@thebabscraig/javascript-design-patterns-part-1-the-factory-pattern-5f135e881192
*/
function afficheTousPhotographes() {
    let monHTML = ''; // On construit le HTML à injecter initialement
    for(let i=0; i<tableauHTMLPhotographes.length; i++) monHTML += tableauHTMLPhotographes[i];
    document.getElementById("main").style.columns = 3;
    document.getElementById('nosPhotographes').innerHTML = monHTML;
}

document.getElementById('titre').addEventListener("click", afficheTousPhotographes);

fetch('js/FishEyeData.json')
  .then((reponse) => reponse.json())
  .then(function (donnees){

    let monHTML = '';

    for(let chaquePhotographe of donnees.photographers) {
        monHTML = '';
        let photographe = creePhotographe(chaquePhotographe);
        // On peut maintenant ajouter la carte de chaque photographe
        monHTML += `
        <a href="profil.html?id=${photographe.id}" aria-label="Affichez le profil de ${photographe.name}">
            <figure class="cartePhotographe" tabindex="">
                <img class="photoProfil" tabindex="" src="img/Sample_Photos/Photographers_ID_Photos/${photographe.portrait}" alt="" />
                <figcaption>
                    <h2 tabindex="" aria-label="Ce photographe s'appelle ${photographe.name} ">${photographe.name}</h2>
                    <h3 tabindex="" aria-label="Ce photographe habite à ${photographe.city}">${photographe.city}, ${photographe.country}</h3>
                    <blockquote tabindex="" aria-label="Sa devise est :${photographe.tagline}">${photographe.tagline}</blockquote>
                    <p  tabindex="" aria-label="Son tarif est ${photographe.price}€ par jour">${photographe.price}€ /jour</p>
                    <div class="filtresPhotographes">`;
        for(let tag of chaquePhotographe.tags) monHTML += `<span class="spanFiltres">#${tag}</span>`;
        monHTML += `
                    </div>
                </figcaption>
            </figure>
        </a>`;
        tableauHTMLPhotographes.push(monHTML);
        tableauPhotographes.push(photographe);
    }
    afficheTousPhotographes();
});

/*
    bouton haut de page
    source : https://www.makeuseof.com/how-to-create-a-scroll-to-the-top-button-using-javascript-and-jquery/
*/

const scrollTop = document.getElementById('retourMain')
// When the page is loaded, hide the scroll-to-top button
window.onload = () => {
 scrollTop.style.visibility = "hidden";
 scrollTop.style.opacity = 0;
}
// If the page is scrolled more than 100px,
// display the scroll-to-top button
// Otherwise keep the button hidden
window.onscroll = () => {
    if (window.scrollY > 100) {
        scrollTop.style.visibility = "visible";
        scrollTop.style.opacity = 1;
    } else {
        scrollTop.style.visibility = "hidden";
        scrollTop.style.opacity = 0;
    }
};

// Gestion des filtres
document.getElementById("filtres").onclick = (event)=> {
    if(event.target !== event.currentTarget) {
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
        let filtreCherche = `<span class="spanFiltres">#`+ event.target.id.substring(3).toLowerCase() +`</span>`;
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
    } else {
        event.preventDefault();
    }
}