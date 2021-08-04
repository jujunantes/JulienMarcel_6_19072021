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

    // Validation du ptexte du message
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
