import { creePhotographe } from "./photographeFactory.js";

/*
    On affiche, depuis le fichier JSON, les photographes :
    sources :
        fetch   : https://www.pierre-giraud.com/javascript-apprendre-coder-cours/api-fetch/
        factory : https://medium.com/@thebabscraig/javascript-design-patterns-part-1-the-factory-pattern-5f135e881192
*/
fetch('js/FishEyeData.json')
  .then((reponse) => reponse.json())
  .then(function (donnees){

    for(var chaquePhotographe of donnees.photographers) {
        //console.log(chaquePhotographe.name);
        var photographe = creePhotographe(chaquePhotographe);
        // On peut maintenant ajouter la carte de chaque photographe
        document.getElementById('main').innerHTML += `
        <a href="profil.html?id=${photographe.id}" aria-label="Affichez le profil de ${photographe.name}">
            <figure class="cartePhotographe" tabindex="">
                <img class="photoProfil" tabindex="" src="img/Sample_Photos/Photographers_ID_Photos/${photographe.portrait}" alt="" />
                <figcaption>
                    <h2 tabindex="" aria-label="Le nom du photographe est ${photographe.name} ">${photographe.name}</h2>
                    <h3 tabindex="" aria-label="Le photographe viens de ${photographe.city}">${photographe.city}, ${photographe.country}</h3>
                    <blockquote tabindex="" aria-label="La devise du photographe est :${photographe.tagline}">${photographe.tagline}</blockquote>
                    <p  tabindex="" aria-label="Le prix de ce photographe est ${photographe.price}€ par jour">${photographe.price}€ /jour</p>
                    <div id="filtresPhotographes_${photographe.id}"></div>
                </figcaption>
            </figure>
        </a>
        `;
        const filtres = document.getElementById("filtresPhotographes_"+photographe.id); //on nomme le filtre avec l'id du photographe sinon on bouclera sur les tags des autres photographes
        for(var tag of chaquePhotographe.tags) filtres.innerHTML+= `<span class="spanFiltres">#${tag}</span>`;        
    }
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
// If the page is scrolled more than 200px,
// display the scroll-to-top button
// Otherwise keep the button hidden
window.onscroll = () => {
 if (window.scrollY > 200) {
 scrollTop.style.visibility = "visible";
 scrollTop.style.opacity = 1;
 } else {
 scrollTop.style.visibility = "hidden";
 scrollTop.style.opacity = 0;
 }
};