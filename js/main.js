import { creePhotographe } from "./photographeFactory.js";
import { creeMedia } from "./mediaFactory.js";
import { tableauHTMLPhotographes, tableauPhotographes, tableauPhotos } from "./variables.js";

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
    // On profite de ce fetch pour récupérer aussi toutes les donnees médias
    for(let chaqueMedia of donnees.media) tableauPhotos.push(creeMedia(chaqueMedia));
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