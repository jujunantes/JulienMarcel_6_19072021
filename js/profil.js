import { creePhotographe } from "./photographeFactory.js";
import { creeMedia } from "./mediaFactory.js";

// On récupère l'URL pour obtenir l'ID
const url = new URL(window.location);
const id = url.searchParams.get('id');

const mainProfil = document.getElementById('mainProfil');

//mainProfil.innerHTML = "ID : " + id; // Pour test

fetch('js/FishEyeData.json')
  .then((reponse) => reponse.json())
  .then(function (donnees){
      
    let monHTMLProfil = ''; // le html que nous allons injecter

    // On récupère d'abord le photographe actuel
    let photographe = creePhotographe(donnees.photographers.filter((photographer) => photographer.id === parseInt(id)));

});
