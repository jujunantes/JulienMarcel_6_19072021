import { creeMedia } from './mediaFactory.js'

const tableauPhotos = []
let totalLikes = 0
let prixPhotographe = 0

// Gestion du tri
const select = document.getElementById('triPhotos')
let selectionPrecedente = select.options[select.selectedIndex].value
const directionTri = [1, 0, 0] // popularité, date, titre (0 : du moins au plus, 1 : du plus au moins)

// On récupère l'URL pour obtenir l'ID
const url = new URL(window.location)
const id = url.searchParams.get('id')

fetch('js/FishEyeData.json')
  .then((reponse) => reponse.json())
  .then(function (donnees) {
    let monHTMLProfil = '' // le html que nous allons injecter

    // On récupère d'abord le photographe actuel, par son index
    const monPhotographe = donnees.photographers.findIndex(el => el.id === parseInt(id))
    prixPhotographe = donnees.photographers[monPhotographe].price

    // On remplit la section "biographie" du header

    monHTMLProfil += `
        <figure class="carteBiographie" tabindex="">
            <figcaption>
                <h2 tabindex="" aria-label="Ce photographe s'appelle ${donnees.photographers[monPhotographe].name} ">${donnees.photographers[monPhotographe].name}</h2>
                <h3 tabindex="" aria-label="Ce photographe habite à ${donnees.photographers[monPhotographe].city}">${donnees.photographers[monPhotographe].city}, ${donnees.photographers[monPhotographe].country}</h3>
                <blockquote tabindex="" aria-label="Sa devise est :${donnees.photographers[monPhotographe].tagline}">${donnees.photographers[monPhotographe].tagline}</blockquote>
                <p tabindex="" aria-label="Son tarif est ${donnees.photographers[monPhotographe].price}€ par jour">${donnees.photographers[monPhotographe].price}€ /jour</p>
                <div class="filtresPhotographes">`
    for (const tag of donnees.photographers[monPhotographe].tags) monHTMLProfil += `<span class="spanFiltres">#${tag}</span>`
    monHTMLProfil += `
                </div>
            </figcaption>
            <button id="modal-btn">
                Contactez-moi
            </button>
            <img class="photoProfil" tabindex="" src="img/vignettes400/Photographers_ID_Photos/${donnees.photographers[monPhotographe].portrait}" alt="" />
        </figure>`

    document.getElementById('carteBiographie').innerHTML = monHTMLProfil
    document.querySelector('#modal-btn').addEventListener('click', launchModal) // Evenemeent modale -> ouverture

    // On profite de ce fetch pour récupérer aussi toutes les donnees médias
    for (const chaqueMedia of donnees.media) {
      if (chaqueMedia.photographerId === parseInt(id)) {
        const monMedia = creeMedia(chaqueMedia)

        let htmlCarte = ''
        htmlCarte += `
            <figure class="cartePhoto" tabindex="">`
        if (monMedia.image !== '') { htmlCarte += `<img class="photoPlanche" tabindex="" src="img/vignettes400/${id}/${chaqueMedia.image}" alt="${chaqueMedia.alt_text}" />` } else {
          const nomCapture = chaqueMedia.video.slice(0, -4) + '.jpg'
          htmlCarte += `<img class="photoPlanche" tabindex="" src="img/vignettes400/${id}/${nomCapture}" alt="${chaqueMedia.alt_text}" />
              <img class="play-icon" src="img/icones/video-solid.svg" alt="ce fichier est une vidéo" />`
        }

        htmlCarte +=
                `<figcaption class="legendePhoto">
                    <div class="titrePhoto">${chaqueMedia.title}</div>
                    <div class="blocPrixLikes>
                      <p class="spanPrix">${chaqueMedia.price} €</p>
                      <div class="likes">
                        <p id="nombreLikes-${chaqueMedia.id}">${chaqueMedia.likes} </p>
                        <p id="iconeLikes-${chaqueMedia.id}">❤</p>
                      </div>
                    </div>
                </figcaption>
            </figure>`
        monMedia.html = htmlCarte
        tableauPhotos.push(monMedia)
        totalLikes += chaqueMedia.likes
      }
    }
    triPhotos() // Tri initial du tableau
    // Maintenant, on crée le HTML que l'on va injecter dans la page
    let monHTML = ''
    for (let i = 0; i < tableauPhotos.length; i++) monHTML += tableauPhotos[i].html
    document.getElementById('planchePhotos').innerHTML = monHTML
  })

/*
  Gestion des likes
*/
document.getElementById('planchePhotos').onclick = (event) => {
  let monElement = event.target.id
  if (monElement.includes('iconeLikes-')) {
    monElement = monElement.slice(11)
    // Cette photo a-t-elle déjà été likée ?
    const indexPhoto = tableauPhotos.findIndex(el => el.id === parseInt(monElement))
    if (tableauPhotos[indexPhoto].dejaLike > 0) { // Oui : on délike
      tableauPhotos[indexPhoto].likes -= 1
      document.getElementById('nombreLikes-' + monElement).innerHTML = tableauPhotos[indexPhoto].likes
      tableauPhotos[indexPhoto].dejaLike = 0
      totalLikes -= 1
      document.getElementById('affTotalLikes').innerHTML = totalLikes // Affiche nb total de likes
    } else { // non : on like
      tableauPhotos[indexPhoto].likes += 1
      document.getElementById('nombreLikes-' + monElement).innerHTML = tableauPhotos[indexPhoto].likes
      tableauPhotos[indexPhoto].dejaLike = 1
      totalLikes += 1
      document.getElementById('affTotalLikes').innerHTML = totalLikes // Affiche nb total de likes
    }
  }
}

// Fin de la gestion des likes

/*
  Fonction de tri
*/
function triPhotos () {
  // On récupère l'ordre de tri
  const ordreTri = select.options[select.selectedIndex].value
  switch (ordreTri) {
    case 'popularite': // Nombre de likes : tableauPhotos.likes
      if (directionTri[0] === 1) { tableauPhotos.sort((a, b) => b.likes - a.likes) } else { tableauPhotos.sort((a, b) => a.likes - b.likes) }
      break
    case 'date': // tableauPhotos.date
      if (directionTri[1] === 1) {
        tableauPhotos.sort(function (a, b) {
          if (a.date > b.date) { return -1 } else { return 1 }
        })
      } else {
        tableauPhotos.sort(function (a, b) {
          if (a.date < b.date) { return -1 } else { return 1 }
        })
      }
      break
    case 'titre': // tableauPhotos.title
      if (directionTri[2] === 1) {
        tableauPhotos.sort(function (a, b) {
          if (a.title > b.title) { return -1 } else { return 1 }
        })
      } else {
        tableauPhotos.sort(function (a, b) {
          if (a.title < b.title) { return -1 } else { return 1 }
        })
      }
  }
}

/*
  gestion du sélecteur de tri
*/

document.getElementById('triPhotos').onclick = (event) => {
  const ordreTri = select.options[select.selectedIndex].value
  if (ordreTri === selectionPrecedente) { // On alterne la direction du tri pour cet ordre de tri (le but est de permettre à l'utilisateur de trier du plus grand au plus petit et inversement)
    switch (ordreTri) {
      case 'popularite': // Nombre de likes : tableauPhotos.likes
        if (directionTri[0] === 1) { directionTri[0] = 0 } else { directionTri[0] = 1 }
        break
      case 'date': // tableauPhotos.date
        if (directionTri[1] === 1) { directionTri[1] = 0 } else { directionTri[1] = 1 }
        break
      case 'titre': // tableauPhotos.title
        if (directionTri[2] === 1) { directionTri[2] = 0 } else { directionTri[2] = 1 }
    }
  }
  selectionPrecedente = ordreTri // On met à jour cette variable pour le prochain clic de l'utilisateur sur le tri
  triPhotos() // On appelle le tri
  // on détruit les écouteurs d'événement en place
  let cartesMedia = document.querySelectorAll('figure img')
  cartesMedia.forEach(function (maCarteMedia) {
    maCarteMedia.removeEventListener('click', ouvertureDiaporama)
  })

  let monHTML = ''
  for (let i = 0; i < tableauPhotos.length; i++) monHTML += tableauPhotos[i].html
  document.getElementById('planchePhotos').innerHTML = monHTML
  // On ajoute les nouveaux écouteurs dévénements
  cartesMedia = document.querySelectorAll('figure img')
  cartesMedia.forEach(function (maCarteMedia) {
    maCarteMedia.addEventListener('click', ouvertureDiaporama)
  })
}
// Fin gestion du sélecteur de tri

/*
  gestion de la modale de contact
*/
// DOM Elements
const maModale = document.getElementById('modaleContact')
const fermeModalBtn = document.querySelectorAll('#close')

fermeModalBtn[0].addEventListener('click', function (event) { // ferme la modale si l'utilisateur clique sur sa croix de fermeture
  if (event.target.matches('#close')) maModale.style.display = 'none'
},
false
)

// ouvre la modale
function launchModal () {
  maModale.style.display = 'block'
}

/*
  Modale : vérification des données utilisateur
*/

// constantes
const formulaire = document.getElementById('formulaireContact')
const prenom = document.getElementById('prenom')
const nom = document.getElementById('nom')
const email = document.getElementById('email')
const texteMessage = document.getElementById('texteMessage')

function validate () {
  let validiteFormulaire = true

  // Validation du prénom (min 2 chars, pas vide)
  const prenomEntre = prenom.value.trim()
  if (prenomEntre === '') {
    document.getElementById('erreurPrenom').innerHTML = "Merci d'entrer un prénom"
    validiteFormulaire = false
  } else if (prenomEntre.length < 2) {
    document.getElementById('erreurPrenom').innerHTML = 'Le prénom doit comporter au moins 2 lettres'
    validiteFormulaire = false
  } else {
    document.getElementById('erreurPrenom').innerHTML = ''
  }

  // Validation du Nom (min 2 chars, pas vide)
  const nomEntre = nom.value.trim()
  if (nomEntre === '') {
    document.getElementById('erreurNom').innerHTML = "Merci d'entrer un nom"
    validiteFormulaire = false
  } else if (nomEntre.length < 2) {
    document.getElementById('erreurNom').innerHTML = 'Le nom doit comporter au moins 2 lettres'
    validiteFormulaire = false
  } else {
    document.getElementById('erreurNom').innerHTML = ''
  }

  // Validation de l'email
  const emailEntre = email.value.trim()
  if (emailEntre === '') {
    document.getElementById('erreurEmail').innerHTML = "Merci d'entrer une adresse email"
    validiteFormulaire = false
  } else {
    // source : https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    if (/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/.test(emailEntre)) {
      document.getElementById('erreurEmail').innerHTML = ''
    } else {
      document.getElementById('erreurEmail').innerHTML = 'Veuillez entrer une adresse email valide'
      validiteFormulaire = false
    }
  }

  // Validation du texte du message
  const messageEntre = texteMessage.value.trim()
  if (messageEntre === '') {
    document.getElementById('erreurTexteMessage').innerHTML = "Merci d'entrer un message"
    validiteFormulaire = false
  }

  return validiteFormulaire
}

function validerFormulaire (event) {
  if (validate()) {
    formulaire.style.minHeight = formulaire.clientHeight + 'px' // Pour que la modale conserve la même hauteur

    // formulaire.className = "centrage centrageVertical";
    formulaire.innerText = 'Merci, votre message a été envoyé !'
    // Ajoutons un bouton de fermeture
    const monBr = document.createElement('br')
    formulaire.appendChild(monBr)
    const monBr2 = document.createElement('br')
    formulaire.appendChild(monBr2)
    const monBouton = document.createElement('button')
    monBouton.innerHTML = 'Fermer'
    // monBouton.className = "btn-signup modal-btn centrage margeBouton";
    formulaire.appendChild(monBouton)
  } else {
    event.preventDefault()
    return false
  }
}

// On crée le gestionnaire d'événement interceptant le clic du bouton de soumission
document.querySelector('.btn-submit').addEventListener('click', validerFormulaire)

/*
  fenêtre flottante avec le nombre de likes
*/

function afficheFooter () {
  const footer = document.querySelector('footer')
  footer.innerHTML += `
    <div id="compteurLikes">
      <span id="affTotalLikes">${totalLikes} ❤</span>
    </div>
    <p>${prixPhotographe} €/jour</p>`
}

/*
  === Gestion de la lightbox ===
*/

const maLightbox = document.getElementById('modaleLightBox')
const monDiaporama = document.getElementById('diaporama')
const lbxFermeture = document.getElementById('lbxFermeture')
const lbxPrecedent = document.getElementById('lbxPrecedent')
const lbxSuivant = document.getElementById('lbxSuivant')
let indexPhoto = 0

// Création des gestionnaires d'événements pour le pilotage de la lightbox
lbxFermeture.addEventListener('click', fermeLightBox)
window.addEventListener('keydown', (event) => { if (event.key === 'Escape') fermeLightBox() })
lbxPrecedent.addEventListener('click', diapoPrecedente)
window.addEventListener('keydown', (event) => { if (event.key === 'ArrowLeft') diapoPrecedente() })
lbxSuivant.addEventListener('click', diapoSuivante)
window.addEventListener('keydown', (event) => { if (event.key === 'ArrowRight') diapoSuivante() })
window.addEventListener('keydown', (event) => { if (event.code === 'Space') joueVideo() })

function fermeLightBox () {
  maLightbox.style.display = 'none'
  monDiaporama.innerHTML = ''
  document.getElementById('conteneurPage').style.display = 'block'
  document.querySelector('footer').style.display = 'flex'
}

function joueVideo () { // Permet de jouer ou de pauser la vidéo à la pression de la barre "espace"
  const maVideo = document.getElementById('maVideo')
  if (maVideo != null) {
    if (maVideo.paused) { maVideo.play() } else { maVideo.pause() }
  }
}

function ouvertureDiaporama (e) {
  console.log('début. indexPhoto : ' + indexPhoto) // debug
  document.getElementById('conteneurPage').style.display = 'none'
  document.querySelector('footer').style.display = 'none'
  // On récupère le nom de l'image sur laquelle l'utilisateur a cliqué
  const sousChaine = '/img/vignettes400/' + id + '/'
  let nomImage = new URL(e.path[0].currentSrc).pathname.substring(sousChaine.length)
  console.log('nom image 1 : ' + nomImage) // debug
  // Puis son index dans le tableau des médias
  indexPhoto = tableauPhotos.findIndex(imageCherchee => imageCherchee.image === nomImage)
  console.log('indexPhoto 1 : ' + indexPhoto) // debug
  // on génère le HTML à injecter
  let htmlDiapo = ''
  if (indexPhoto === -1) { // pas d'image répondant à ce nom : c'est donc une vidéo
    // on remplace "jpg" par "mp4"
    nomImage = new URL(e.path[0].currentSrc).pathname.substring(sousChaine.length).replace(/jpg/g, 'mp4')
    console.log('nom image 2 : ' + nomImage) // debug
    indexPhoto = tableauPhotos.findIndex(imageCherchee => imageCherchee.video === nomImage)
    console.log('indexPhoto 2 : ' + indexPhoto) // debug
    htmlDiapo = `<video controls class='diapo' id="maVideo" src='img/Sample_Photos/${id}/${nomImage.replace(/jpg/g, 'mp4')}' alt=''></video>`
  } else {
    htmlDiapo = `<img class="diapo" src='img/vignettesLightbox/${id}/${nomImage}' alt='${tableauPhotos[indexPhoto].alt_text}'/>`
  }
  console.log('index : ' + indexPhoto) // debug
  console.log('{tableauPhotos[indexPhoto] : ' + tableauPhotos[indexPhoto]) // debug
  htmlDiapo += `<p>${tableauPhotos[indexPhoto].title}</p>`
  document.getElementById('diaporama').innerHTML = htmlDiapo

  maLightbox.style.display = 'block'
}

function diapoPrecedente () {
  indexPhoto -= 1
  if (indexPhoto < 0) indexPhoto = tableauPhotos.length - 1
  let mediaPrecedent = tableauPhotos[indexPhoto].image
  let htmlDiapo = ''
  if (mediaPrecedent === '') { // c'est une vidéo
    mediaPrecedent = tableauPhotos[indexPhoto].video
    htmlDiapo = `<video controls class='diapo' id="maVideo" src='img/Sample_Photos/${id}/${mediaPrecedent}' alt='${tableauPhotos[indexPhoto].alt_text}'></video>`
  } else {
    htmlDiapo = `<img class="diapo" src='img/vignettesLightbox/${id}/${mediaPrecedent}' alt='${tableauPhotos[indexPhoto].alt_text}'/>`
  }
  htmlDiapo += `<p>${tableauPhotos[indexPhoto].title}</p>`
  document.getElementById('diaporama').innerHTML = htmlDiapo
}

function diapoSuivante () {
  indexPhoto += 1
  if (indexPhoto >= tableauPhotos.length) indexPhoto = 0
  let mediaSuivant = tableauPhotos[indexPhoto].image
  let htmlDiapo = ''
  if (mediaSuivant === '') { // c'est une vidéo
    mediaSuivant = tableauPhotos[indexPhoto].video
    htmlDiapo = `<video controls class='diapo' id="maVideo" src='img/Sample_Photos/${id}/${mediaSuivant}' alt='${tableauPhotos[indexPhoto].alt_text}'></video>`
  } else {
    htmlDiapo = `<img class="diapo" src='img/vignettesLightbox/${id}/${mediaSuivant}' alt='${tableauPhotos[indexPhoto].alt_text}'/>`
  }
  htmlDiapo += `<p>${tableauPhotos[indexPhoto].title}</p>`
  document.getElementById('diaporama').innerHTML = htmlDiapo
}

// Fin de la gestion de la lightbox

window.onload = function (e) {
  afficheFooter()

  const cartesMedia = document.querySelectorAll('figure img')
  cartesMedia.forEach(function (maCarteMedia) {
    maCarteMedia.addEventListener('click', ouvertureDiaporama)
  })
}
