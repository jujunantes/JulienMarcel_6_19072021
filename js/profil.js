import { creeMedia } from "./mediaFactory.js";

var tableauPhotos = []; 

// On récupère l'URL pour obtenir l'ID
const url = new URL(window.location);
const id = url.searchParams.get('id');

const mainProfil = document.getElementById('mainProfil');

//mainProfil.innerHTML = "ID : " + id; // Pour test
fetch('js/FishEyeData.json')
  .then((reponse) => reponse.json())
  .then(function (donnees){
      
    let monHTMLProfil = ''; // le html que nous allons injecter

    // On récupère d'abord le photographe actuel, par son index
    let monPhotographe =  donnees.photographers.findIndex(el => el.id === parseInt(id));

    // On remplit la section "biographie" du header

    monHTMLProfil += `
        <figure class="carteBiographie" tabindex="">
            <figcaption>
                <h2 tabindex="" aria-label="Ce photographe s'appelle ${donnees.photographers[monPhotographe].name} ">${donnees.photographers[monPhotographe].name}</h2>
                <h3 tabindex="" aria-label="Ce photographe habite à ${donnees.photographers[monPhotographe].city}">${donnees.photographers[monPhotographe].city}, ${donnees.photographers[monPhotographe].country}</h3>
                <blockquote tabindex="" aria-label="Sa devise est :${donnees.photographers[monPhotographe].tagline}">${donnees.photographers[monPhotographe].tagline}</blockquote>
                <p tabindex="" aria-label="Son tarif est ${donnees.photographers[monPhotographe].price}€ par jour">${donnees.photographers[monPhotographe].price}€ /jour</p>
                <div class="filtresPhotographes">`;
    for(let tag of donnees.photographers[monPhotographe].tags) monHTMLProfil += `<span class="spanFiltres">#${tag}</span>`;
    monHTMLProfil += `
                </div>
            </figcaption>
            <button id="modal-btn">
                Contactez-moi
            </button>
            <img class="photoProfil" tabindex="" src="img/Sample_Photos/Photographers_ID_Photos/${donnees.photographers[monPhotographe].portrait}" alt="" />
        </figure>`;

    document.getElementById("carteBiographie").innerHTML = monHTMLProfil;
    document.querySelector("#modal-btn").addEventListener("click", launchModal); // Evenemeent modale -> ouverture

    // On profite de ce fetch pour récupérer aussi toutes les donnees médias
    let monHTML = '';
    for(let chaqueMedia of donnees.media)
      if (chaqueMedia.photographerId === parseInt(id)) {
        let monMedia = creeMedia(chaqueMedia);

        tableauPhotos.push(creeMedia(chaqueMedia));
        
        monHTML += `
        <a href="" aria-label="">
            <figure class="cartePhoto" tabindex="">`;
        if (monMedia.image !== "")
          monHTML += `<img class="photoPlanche" tabindex="" src="img/Sample_Photos/${id}/${chaqueMedia.image}" alt="${chaqueMedia.alt_text}" />`;
        else
          monHTML += `<video controls class="photoPlanche" tabindex="" src="img/Sample_Photos/${id}/${chaqueMedia.video}" alt="${chaqueMedia.alt_text}"></video>`;
        monHTML += 
                `<figcaption>
                    <p  tabindex="" aria-label="">${chaqueMedia.title} ${chaqueMedia.price}€ ${chaqueMedia.likes} ❤</p>
                </figcaption>
            </figure>
        </a>`;
      }
      document.getElementById('planchePhotos').innerHTML = monHTML;
});

/*
  gestion de la modale
*/
// DOM Elements
const maModale = document.getElementById("modaleContact");
const modalBtn = document.querySelectorAll(".modal-btn");
const fermeModalBtn = document.querySelectorAll("#close");

document.addEventListener("click",
  function(event) {
    // ferme la modale si l'utilisateur clique sur sa croix de fermeture
    if (event.target.matches("#close")) maModale.style.display = "none";
  },
  false
)

// ouvre la modale
function launchModal() {
    maModale.style.display = "block";
}

/*
  Modale : vérification des données utilisateur
*/

// constantes
const formulaire = document.getElementById("formulaireContact");
const prenom = document.getElementById("prenom");
const nom = document.getElementById("nom");
const email = document.getElementById("email");
const texteMessage = document.getElementById("texteMessage");

function validate() {
    var validiteFormulaire = true;

    // Validation du prénom (min 2 chars, pas vide)
    let prenomEntre = prenom.value.trim();
    if (prenomEntre === "") {
		document.getElementById("erreurPrenom").innerHTML = "Merci d'entrer un prénom";
		validiteFormulaire = false;
	} else if (prenomEntre.length < 2) {
		document.getElementById("erreurPrenom").innerHTML = "Le prénom doit comporter au moins 2 lettres";
		validiteFormulaire = false;
	} else {
		document.getElementById("erreurPrenom").innerHTML = "";
	}

    // Validation du Nom (min 2 chars, pas vide)
    let nomEntre = nom.value.trim();
    if (nomEntre === "") {
		document.getElementById("erreurNom").innerHTML = "Merci d'entrer un nom";
		validiteFormulaire = false;
	} else if (nomEntre.length < 2) {
		document.getElementById("erreurNom").innerHTML = "Le nom doit comporter au moins 2 lettres";
		validiteFormulaire = false;
	} else {
		document.getElementById("erreurNom").innerHTML = "";
	}

    // Validation de l'email
    let emailEntre = email.value.trim();
    if (emailEntre === "") {
		document.getElementById("erreurEmail").innerHTML = "Merci d'entrer une adresse email";
		validiteFormulaire = false;
	} else {
        // source : https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
        if(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(emailEntre)){
            document.getElementById("erreurEmail").innerHTML = "";
        } else {
            document.getElementById("erreurEmail").innerHTML = "Veuillez entrer une adresse email valide";
		    validiteFormulaire = false;
        }
	}

    // Validation du texte du message
    let messageEntre = texteMessage.value.trim();
    if (messageEntre === "") {
		document.getElementById("erreurTexteMessage").innerHTML = "Merci d'entrer un message";
		validiteFormulaire = false;

	}

    return validiteFormulaire;
}

function validerFormulaire(event) {
    if(validate()){
        formulaire.style.minHeight = formulaire.clientHeight +"px"; // Pour que la modale conserve la même hauteur

        //formulaire.className = "centrage centrageVertical";
        formulaire.innerText = "Merci, votre message a été envoyé !";
        // Ajoutons un bouton de fermeture
        const monBr = document.createElement("br");
        formulaire.appendChild(monBr);
        const monBr2 = document.createElement("br");
        formulaire.appendChild(monBr2);
        const monBouton = document.createElement("button");
        monBouton.innerHTML = "Fermer";
        //monBouton.className = "btn-signup modal-btn centrage margeBouton";
        formulaire.appendChild(monBouton);
    }
    else {
        event.preventDefault();
        return false;
    }
}

// On crée le gestionnaire d'événement interceptant le clic du bouton de soumission
document.querySelector(".btn-submit").addEventListener("click", validerFormulaire);