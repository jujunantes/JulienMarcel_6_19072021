/*
  profil.js : contient toute la logique de contrôle des profils individuels des photographes

  ligne 028 : Récupération des données du photographe et de ses médias (fetch)
  ligne 122 : gestion des likes
  ligne 176 : gestion du tri et du faux select
  ligne 457 : modale de contact
  ligne 619 : fenêtre flottante avec le nombre de likes
  ligne 632 : lightbox
*/

import { creeMedia } from './mediaFactory.js'
import './swiped-events.js'

const tableauPhotos = []
let totalLikes = 0
let prixPhotographe = 0
let nomPhotographe = ''

// Gestion du tri
let selectionPrecedente = 'Popularité'
let togglePremierChoix = 0
let directionTri = [1, 0, 0] // popularité, date, titre (0 : du moins au plus, 1 : du plus au moins)

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
    nomPhotographe = donnees.photographers[monPhotographe].name

    // On remplit la section "biographie" du header

    monHTMLProfil += `
        <div id="carteBiographie" tabindex="">
          <div id="blocBioContact">
            <div>
                <h2 tabindex="2" aria-label="Ce photographe s'appelle ${donnees.photographers[monPhotographe].name} ">${donnees.photographers[monPhotographe].name}</h2>
                <h3 tabindex="3" aria-label="Ce photographe habite à ${donnees.photographers[monPhotographe].city}, ${donnees.photographers[monPhotographe].country}">${donnees.photographers[monPhotographe].city}, ${donnees.photographers[monPhotographe].country}</h3>
                <blockquote tabindex="4" aria-label="Sa devise est :${donnees.photographers[monPhotographe].tagline}">${donnees.photographers[monPhotographe].tagline}</blockquote>
                <div id="filtresProfil">`
    for (const tag of donnees.photographers[monPhotographe].tags) monHTMLProfil += `<span class="spanFiltres">#${tag}</span>`
    monHTMLProfil += `
                </div>
            </div>
          </div>
          <img class="photoProfil" tabindex="5" src="img/vignettes400/Photographers_ID_Photos/${donnees.photographers[monPhotographe].portrait}" alt="${donnees.photographers[monPhotographe].alt_text}" />
        </div>`

    document.getElementById('banniereBiographie').innerHTML = monHTMLProfil
    document.querySelector('#modal-btn').addEventListener('click', launchModal) // Evenement modale -> ouverture

    // On profite de ce fetch pour récupérer aussi toutes les donnees médias
    for (const chaqueMedia of donnees.media) {
      if (chaqueMedia.photographerId === parseInt(id)) {
        const monMedia = creeMedia(chaqueMedia)

        let htmlCarte = ''
        htmlCarte += `
            <figure class="cartePhoto">`
        if (monMedia.image !== '') { htmlCarte += `<img class="photoPlanche" src="img/vignettes400/${id}/${chaqueMedia.image}" alt="${chaqueMedia.alt_text}" />` } else {
          const nomCapture = chaqueMedia.video.slice(0, -4) + '.jpg'
          htmlCarte += `<img tabindex="" class="photoPlanche" src="img/vignettes400/${id}/${nomCapture}" alt="${chaqueMedia.alt_text}" />
              <img class="play-icon" src="img/icones/video-solid.svg" alt="${chaqueMedia.alt_text}" />`
        }

        htmlCarte +=
                `<figcaption class="legendePhoto">
                    <p class="titrePhoto" aria-label="ce média est intitulé ${chaqueMedia.title}"">${chaqueMedia.title}</p>
                    <div class="likes">
                      <p class="pLikes" id="nombreLikes-${chaqueMedia.id}" aria-label="Ce média a déjà été liké ${chaqueMedia.likes} fois">${chaqueMedia.likes}</p>
                      <p tabindex="" class="coeurLikes" id="iconeLikes-${chaqueMedia.id}" aria-label="Cliquez pour liker ce média, déjà liké ${chaqueMedia.likes} fois">❤</p>
                    </div>
                </figcaption>
            </figure>`
        monMedia.html = htmlCarte
        tableauPhotos.push(monMedia)
        totalLikes += chaqueMedia.likes
      }
    }
    if (window.screen.width >= 900) {
      afficheFooter()
    }
    triPhotos('Popularité') // Tri initial du tableau
    // Maintenant, on crée le HTML que l'on va injecter dans la page
    let monHTML = ''
    for (let i = 0; i < tableauPhotos.length; i++) monHTML += tableauPhotos[i].html
    document.getElementById('planchePhotos').innerHTML = monHTML
    // Et maintenant, on numérote correctement les tabindex
    let tabIndexDepart = document.getElementById('troisiemeChoix').tabIndex
    const mesPhotoPlanche = document.getElementsByClassName('photoPlanche')
    const mesTitresPhotos = document.getElementsByClassName('titrePhoto')
    const mesLikes = document.getElementsByClassName('coeurLikes')
    for (let i = 0, max = mesPhotoPlanche.length; i < max; i++) {
      mesPhotoPlanche[i].tabIndex = ++tabIndexDepart
      mesTitresPhotos[i].tabIndex = ++tabIndexDepart
      mesLikes[i].tabIndex = ++tabIndexDepart
    }
    document.getElementById('lbxFermeture').tabIndex = ++tabIndexDepart
    document.getElementById('lbxPrecedent').tabIndex = ++tabIndexDepart
    document.getElementById('lbxSuivant').tabIndex = ++tabIndexDepart
    document.getElementById('diaporama').tabIndex = ++tabIndexDepart
    document.getElementById('nomContact').innerHTML = nomPhotographe

    const cartesMedia = document.querySelectorAll('.photoPlanche')
    cartesMedia.forEach(function (maCarteMedia) {
      maCarteMedia.addEventListener('click', ouvertureDiaporama)
      maCarteMedia.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          ouvertureDiaporama(e)
        }
      })
    })
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
      event.target.style.color = '#901c1c'
      tableauPhotos[indexPhoto].dejaLike = 0
      totalLikes -= 1
      document.getElementById('affTotalLikes').innerHTML = totalLikes + ' ❤' // Affiche nb total de likes
    } else { // non : on like
      tableauPhotos[indexPhoto].likes += 1
      document.getElementById('nombreLikes-' + monElement).innerHTML = tableauPhotos[indexPhoto].likes
      event.target.style.color = 'deeppink'
      tableauPhotos[indexPhoto].dejaLike = 1
      totalLikes += 1
      document.getElementById('affTotalLikes').innerHTML = totalLikes + ' ❤' // Affiche nb total de likes
    }
  }
}

document.getElementById('planchePhotos').onkeydown = (event) => {
  if (event.key === 'Enter') {
    let monElement = event.target.id
    if (monElement.includes('iconeLikes-')) {
      monElement = monElement.slice(11)
      // Cette photo a-t-elle déjà été likée ?
      const indexPhoto = tableauPhotos.findIndex(el => el.id === parseInt(monElement))
      if (tableauPhotos[indexPhoto].dejaLike > 0) { // Oui : on délike
        tableauPhotos[indexPhoto].likes -= 1
        document.getElementById('nombreLikes-' + monElement).innerHTML = tableauPhotos[indexPhoto].likes
        event.target.style.color = '#901c1c'
        tableauPhotos[indexPhoto].dejaLike = 0
        totalLikes -= 1
        document.getElementById('affTotalLikes').innerHTML = totalLikes + ' ❤' // Affiche nb total de likes
      } else { // non : on like
        tableauPhotos[indexPhoto].likes += 1
        document.getElementById('nombreLikes-' + monElement).innerHTML = tableauPhotos[indexPhoto].likes
        event.target.style.color = 'deeppink'
        tableauPhotos[indexPhoto].dejaLike = 1
        totalLikes += 1
        document.getElementById('affTotalLikes').innerHTML = totalLikes + ' ❤' // Affiche nb total de likes
      }
    }
  }
}
// Fin de la gestion des likes

/*
  Gestion du tri et du faux-select
*/
const monHTML = document.getElementById('html')
monHTML.addEventListener('click', function (e) {
  // Cette fonction permet de fermer le faux-select en cas de clic à l'extérieur ou de perte de focus
  if ((e.target.id === 'monFauxSelect') || (e.target.id === 'premierChoix') || (e.target.id === 'enTeteChevron')) {
    document.getElementById('monFauxSelect').classList.toggle('open')
    document.getElementById('mesOptions').classList.toggle('open')
    document.getElementById('enTeteChevron').classList.toggle('chevronOpen')
    document.getElementById('enTeteChevron').classList.toggle('chevron')
    if (document.getElementById('monFauxSelect').getAttribute('aria-expanded') === 'true') {
      document.getElementById('monFauxSelect').setAttribute('aria-expanded', 'false')
    } else {
      document.getElementById('monFauxSelect').setAttribute('aria-expanded', 'true')
    }
  } else if (document.getElementById('monFauxSelect').getAttribute('aria-expanded') === 'true') {
    document.getElementById('monFauxSelect').classList.toggle('open')
    document.getElementById('mesOptions').classList.toggle('open')
    document.getElementById('enTeteChevron').classList.toggle('chevronOpen')
    document.getElementById('enTeteChevron').classList.toggle('chevron')
    togglePremierChoix = 0
    document.getElementById('monFauxSelect').setAttribute('aria-expanded', 'false')
  }
})

document.getElementById('monFauxSelect').onfocus = (event) => {
  if (document.getElementById('monFauxSelect').getAttribute('aria-expanded') === 'false') {
    document.getElementById('monFauxSelect').classList.toggle('open')
    document.getElementById('mesOptions').classList.toggle('open')
    document.getElementById('enTeteChevron').classList.toggle('chevronOpen')
    document.getElementById('enTeteChevron').classList.toggle('chevron')
    document.getElementById('monFauxSelect').setAttribute('aria-expanded', 'true')
  }
}

// permet de connaître l'état de la touche shift, même lors d'un événement onblur
let shiftPresse = false
document.onkeydown = function (e) {
  if (e.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT) {
    shiftPresse = true
  }
}
document.onkeyup = function (e) {
  if (e.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT) {
    shiftPresse = false
  }
}

// L'événement suivant permet de fermer le faux-select lorsque, au clavier, on quitte avec tab son dernier élément
document.getElementById('troisiemeChoix').onblur = (event) => {
  if (!shiftPresse) {
    if (document.getElementById('monFauxSelect').getAttribute('aria-expanded') === 'true') {
      document.getElementById('monFauxSelect').classList.toggle('open')
      document.getElementById('mesOptions').classList.toggle('open')
      document.getElementById('enTeteChevron').classList.toggle('chevronOpen')
      document.getElementById('enTeteChevron').classList.toggle('chevron')
      togglePremierChoix = 0
      document.getElementById('monFauxSelect').setAttribute('aria-expanded', 'false')
    }
  }
}
// Idem en quittant le faux-select par le haut, avec un shift-tab
document.getElementById('monFauxSelect').onblur = (event) => {
  if (shiftPresse) {
    if (document.getElementById('monFauxSelect').getAttribute('aria-expanded') === 'true') {
      document.getElementById('monFauxSelect').classList.toggle('open')
      document.getElementById('mesOptions').classList.toggle('open')
      document.getElementById('enTeteChevron').classList.toggle('chevronOpen')
      document.getElementById('enTeteChevron').classList.toggle('chevron')
      togglePremierChoix = 0
      document.getElementById('monFauxSelect').setAttribute('aria-expanded', 'false')
    }
  }
}

// L'événement suivant permet de rouvrir le faux-select lorsque, au clavier, on le rejoint avec un shift-tab sur son dernier élément
document.getElementById('troisiemeChoix').onfocus = (event) => {
  if (document.getElementById('monFauxSelect').getAttribute('aria-expanded') === 'false') {
    document.getElementById('monFauxSelect').classList.toggle('open')
    document.getElementById('mesOptions').classList.toggle('open')
    document.getElementById('enTeteChevron').classList.toggle('chevronOpen')
    document.getElementById('enTeteChevron').classList.toggle('chevron')
    document.getElementById('monFauxSelect').setAttribute('aria-expanded', 'true')
  }
}

function triPhotos (ordreTri) {
  // On récupère l'ordre de tri
  switch (ordreTri) {
    case 'Popularité': // Nombre de likes : tableauPhotos.likes
      if (directionTri[0] === 1) { tableauPhotos.sort((a, b) => b.likes - a.likes) } else { tableauPhotos.sort((a, b) => a.likes - b.likes) }
      break
    case 'Date': // tableauPhotos.date
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
    case 'Titre': // tableauPhotos.title
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
function lanceTri (ordreTri) {
  togglePremierChoix = 0
  if (ordreTri === selectionPrecedente) { // On alterne la direction du tri pour cet ordre de tri (le but est de permettre à l'utilisateur de trier du plus grand au plus petit et inversement)
    switch (ordreTri) {
      case 'Popularité': // Nombre de likes : tableauPhotos.likes
        if (directionTri[0] === 1) { directionTri[0] = 0 } else { directionTri[0] = 1 }
        break
      case 'Date': // tableauPhotos.date
        if (directionTri[1] === 1) { directionTri[1] = 0 } else { directionTri[1] = 1 }
        break
      case 'Titre': // tableauPhotos.title
        if (directionTri[2] === 1) { directionTri[2] = 0 } else { directionTri[2] = 1 }
    }
  } else {
    directionTri = [1, 0, 0]
  }
  selectionPrecedente = ordreTri // On met à jour cette variable pour le prochain clic de l'utilisateur sur le tri
  triPhotos(ordreTri) // On appelle le tri
  // on détruit les écouteurs d'événement en place
  let cartesMedia = document.querySelectorAll('.photoPlanche')
  cartesMedia.forEach(function (maCarteMedia) {
    maCarteMedia.removeEventListener('click', ouvertureDiaporama)
    maCarteMedia.removeEventListener('keydown', ouvertureDiaporama)
  })

  let monHTML = ''
  for (let i = 0; i < tableauPhotos.length; i++) monHTML += tableauPhotos[i].html
  document.getElementById('planchePhotos').innerHTML = monHTML
  // On ajoute les nouveaux écouteurs dévénements
  cartesMedia = document.querySelectorAll('.photoPlanche')
  cartesMedia.forEach(function (maCarteMedia) {
    maCarteMedia.addEventListener('click', ouvertureDiaporama)
    maCarteMedia.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        ouvertureDiaporama(e)
      }
    })
  })
  // Et maintenant, on numérote correctement les tabindex
  let tabIndexDepart = document.getElementById('troisiemeChoix').tabIndex
  const mesPhotoPlanche = document.getElementsByClassName('photoPlanche')
  const mesTitresPhotos = document.getElementsByClassName('titrePhoto')
  const mesLikes = document.getElementsByClassName('coeurLikes')
  for (let i = 0, max = mesPhotoPlanche.length; i < max; i++) {
    mesPhotoPlanche[i].tabIndex = ++tabIndexDepart
    mesTitresPhotos[i].tabIndex = ++tabIndexDepart
    mesLikes[i].tabIndex = ++tabIndexDepart
  }
  // Et, si il est encore ouvert (se produit lors d'un choix par clavier), on ferme le faux-select
  if (document.getElementById('monFauxSelect').getAttribute('aria-expanded') === 'true') {
    document.getElementById('monFauxSelect').classList.toggle('open')
    document.getElementById('mesOptions').classList.toggle('open')
    document.getElementById('enTeteChevron').classList.toggle('chevronOpen')
    document.getElementById('enTeteChevron').classList.toggle('chevron')
    togglePremierChoix = 0
    document.getElementById('monFauxSelect').setAttribute('aria-expanded', 'false')
  }
}

// Les deux événements suivants permettent de changer la couleur de fond du chevron si le premier li est survolé
document.getElementById('monTestDiv').addEventListener('mouseover', function (event) {
  const r = document.querySelector(':root')
  r.style.setProperty('--couleurFondChevron', '#d3573c')
})
document.getElementById('monTestDiv').addEventListener('mouseout', function (event) {
  const r = document.querySelector(':root')
  r.style.setProperty('--couleurFondChevron', '#901c1c')
})

document.getElementById('monFauxSelect').onclick = (event) => {
  if (togglePremierChoix > 0) lanceTri(document.getElementById('premierChoix').innerHTML)
  else togglePremierChoix = 1
}

document.getElementById('monFauxSelect').onkeydown = (event) => {
  if (event.key === 'Enter') {
    if (togglePremierChoix > 0) lanceTri(document.getElementById('premierChoix').innerHTML)
    else togglePremierChoix = 1
  }
}

document.getElementById('deuxiemeChoix').onclick = (event) => {
  lanceTri(document.getElementById('deuxiemeChoix').innerHTML)
  const tempString = document.getElementById('premierChoix').innerHTML
  document.getElementById('premierChoix').innerHTML = document.getElementById('deuxiemeChoix').innerHTML
  document.getElementById('deuxiemeChoix').innerHTML = tempString
  const r = document.querySelector(':root')
  switch (document.getElementById('premierChoix').innerHTML) {
    case 'Date':
      r.style.setProperty('--ajoutRem', '6.76rem')
      break
    case 'Titre':
      r.style.setProperty('--ajoutRem', '6.76rem')
      break
    default: // Popularité
      r.style.setProperty('--ajoutRem', '3.9rem')
  }
  document.getElementById('monFauxSelect').setAttribute('data-selected-value', document.getElementById('premierChoix').innerHTML)
}

document.getElementById('deuxiemeChoix').onkeydown = (event) => {
  if (event.key === 'Enter') {
    lanceTri(document.getElementById('deuxiemeChoix').innerHTML)
    const tempString = document.getElementById('premierChoix').innerHTML
    document.getElementById('premierChoix').innerHTML = document.getElementById('deuxiemeChoix').innerHTML
    document.getElementById('deuxiemeChoix').innerHTML = tempString
    const r = document.querySelector(':root')
    switch (document.getElementById('premierChoix').innerHTML) {
      case 'Date':
        r.style.setProperty('--ajoutRem', '6.76rem')
        break
      case 'Titre':
        r.style.setProperty('--ajoutRem', '6.76rem')
        break
      default: // Popularité
        r.style.setProperty('--ajoutRem', '3.9rem')
    }
    document.getElementById('monFauxSelect').setAttribute('data-selected-value', document.getElementById('premierChoix').innerHTML)
  }
}

document.getElementById('troisiemeChoix').onclick = (event) => {
  lanceTri(document.getElementById('troisiemeChoix').innerHTML)
  const tempString = document.getElementById('premierChoix').innerHTML
  document.getElementById('premierChoix').innerHTML = document.getElementById('troisiemeChoix').innerHTML
  document.getElementById('troisiemeChoix').innerHTML = tempString
  const r = document.querySelector(':root')
  switch (document.getElementById('premierChoix').innerHTML) {
    case 'Date':
      r.style.setProperty('--ajoutRem', '6.76rem')
      break
    case 'Titre':
      r.style.setProperty('--ajoutRem', '6.76rem')
      break
    default: // Popularité
      r.style.setProperty('--ajoutRem', '3.9rem')
  }
  document.getElementById('monFauxSelect').setAttribute('data-selected-value', document.getElementById('premierChoix').innerHTML)
}

document.getElementById('troisiemeChoix').onkeydown = (event) => {
  if (event.key === 'Enter') {
    lanceTri(document.getElementById('troisiemeChoix').innerHTML)
    const tempString = document.getElementById('premierChoix').innerHTML
    document.getElementById('premierChoix').innerHTML = document.getElementById('troisiemeChoix').innerHTML
    document.getElementById('troisiemeChoix').innerHTML = tempString
    const r = document.querySelector(':root')
    switch (document.getElementById('premierChoix').innerHTML) {
      case 'Date':
        r.style.setProperty('--ajoutRem', '6.76rem')
        break
      case 'Titre':
        r.style.setProperty('--ajoutRem', '6.76rem')
        break
      default: // Popularité
        r.style.setProperty('--ajoutRem', '3.9rem')
    }
    document.getElementById('monFauxSelect').setAttribute('data-selected-value', document.getElementById('premierChoix').innerHTML)
  }
}
// Fin gestion du sélecteur de tri

/*
  gestion de la modale de contact
*/
// DOM Elements
const maModale = document.getElementById('modaleContact')
const fermeModalBtn = document.querySelectorAll('#close')

fermeModalBtn[0].addEventListener('click', function (event) { // ferme la modale si l'utilisateur clique sur sa croix de fermeture
  document.getElementById('modaleContact').setAttribute('aria-hidden', 'true')
  if (event.target.matches('#close')) maModale.style.display = 'none'
  window.removeEventListener('keydown', handleKey)
  document.getElementById('modal-btn').focus()
},
false
)

fermeModalBtn[0].addEventListener('keydown', function (event) { // ferme la modale si l'utilisateur active la croix au clavier
  document.getElementById('modaleContact').setAttribute('aria-hidden', 'true')
  if ((event.target.matches('#close')) && (event.key !== 'Tab')) maModale.style.display = 'none'
  window.removeEventListener('keydown', handleKey)
  document.getElementById('modal-btn').focus()
},
false
)
maModale.addEventListener('keydown', function (event) { // ferme la modale si l'utilisateur appuie sur escape
  document.getElementById('modaleContact').setAttribute('aria-hidden', 'true')
  if (event.key === 'Escape') maModale.style.display = 'none'
  window.removeEventListener('keydown', handleKey)
  document.getElementById('modal-btn').focus()
},
false)

// Piège le focus sur la modale ouverte
// Idée et code trouvés sur https://stackoverflow.com/questions/50178419/how-can-restrict-the-tab-key-press-only-within-the-modal-popup-when-its-open
function handleKey (e) {
  if (e.key === 'Tab') {
    const focusable = document.querySelector('#formulaireContact').querySelectorAll('span, div,input,button,select,textarea')
    if (focusable.length) {
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const shift = e.shiftKey
      if (shift) {
        if (e.target === first) { // shift-tab pressed on first input in dialog
          last.focus()
          e.preventDefault()
        }
      } else {
        if (e.target === last) { // tab pressed on last input in dialog
          first.focus()
          e.preventDefault()
        }
      }
    }
  }
}

// ouvre la modale
function launchModal () {
  document.getElementById('modaleContact').setAttribute('aria-hidden', 'false')
  maModale.style.display = 'block'
  document.getElementById('formulaireContact').focus()
  maModale.addEventListener('keydown', handleKey) // Piège le focus sur la modale ouverte
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
    document.getElementById('erreurPrenom').setAttribute('aria-hidden', 'false')
    validiteFormulaire = false
  } else if (prenomEntre.length < 2) {
    document.getElementById('erreurPrenom').innerHTML = 'Le prénom doit comporter au moins 2 lettres'
    document.getElementById('erreurPrenom').setAttribute('aria-hidden', 'false')
    validiteFormulaire = false
  } else {
    document.getElementById('erreurPrenom').innerHTML = ''
    document.getElementById('erreurPrenom').setAttribute('aria-hidden', 'true')
  }

  // Validation du Nom (min 2 chars, pas vide)
  const nomEntre = nom.value.trim()
  if (nomEntre === '') {
    document.getElementById('erreurNom').innerHTML = "Merci d'entrer un nom"
    document.getElementById('erreurNom').setAttribute('aria-hidden', 'false')
    validiteFormulaire = false
  } else if (nomEntre.length < 2) {
    document.getElementById('erreurNom').innerHTML = 'Le nom doit comporter au moins 2 lettres'
    document.getElementById('erreurNom').setAttribute('aria-hidden', 'false')
    validiteFormulaire = false
  } else {
    document.getElementById('erreurNom').innerHTML = ''
    document.getElementById('erreurNom').setAttribute('aria-hidden', 'true')
  }

  // Validation de l'email
  const emailEntre = email.value.trim()
  if (emailEntre === '') {
    document.getElementById('erreurEmail').innerHTML = "Merci d'entrer une adresse email"
    document.getElementById('erreurEmail').setAttribute('aria-hidden', 'false')
    validiteFormulaire = false
  } else {
    // source : https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    if (/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/.test(emailEntre)) {
      document.getElementById('erreurEmail').innerHTML = ''
      document.getElementById('erreurEmail').setAttribute('aria-hidden', 'true')
    } else {
      document.getElementById('erreurEmail').innerHTML = 'Veuillez entrer une adresse email valide'
      document.getElementById('erreurEmail').setAttribute('aria-hidden', 'false')
      validiteFormulaire = false
    }
  }

  // Validation du texte du message
  const messageEntre = texteMessage.value.trim()
  if (messageEntre === '') {
    document.getElementById('erreurTexteMessage').innerHTML = "Merci d'entrer un message"
    document.getElementById('erreurTexteMessage').setAttribute('aria-hidden', 'false')
    validiteFormulaire = false
  } else {
    document.getElementById('erreurTexteMessage').setAttribute('aria-hidden', 'true')
  }

  return validiteFormulaire
}

function validerFormulaire (event) {
  if (validate()) {
    formulaire.style.minHeight = formulaire.clientHeight + 'px' // Pour que la modale conserve la même hauteur
    formulaire.className = 'centrage'
    formulaire.innerHTML = '<p id="pFinal">Merci, votre message a été envoyé !</p>'
    // Ajoutons un bouton de fermeture
    const monBr = document.createElement('br')
    formulaire.appendChild(monBr)
    const monBr2 = document.createElement('br')
    formulaire.appendChild(monBr2)
    const monBouton = document.createElement('button')
    monBouton.innerHTML = 'Fermer'
    monBouton.className = 'btn-submit centrageBouton'
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
      <span id="affTotalLikes" aria-label="Ce photographe a reçu ${totalLikes} likes">${totalLikes} ❤</span>
    </div>
    <p aria-label="Ce photographe loue ses services pour ${prixPhotographe} euros par jour">${prixPhotographe} €/jour</p>`
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
lbxFermeture.addEventListener('keydown', (event) => {
  if ((event.key === 'Escape') || (event.key === 'Enter')) fermeLightBox()
})
window.addEventListener('keydown', (event) => { if (event.key === 'Escape') fermeLightBox() })
lbxPrecedent.addEventListener('click', diapoPrecedente)
lbxPrecedent.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') diapoPrecedente()
})
window.addEventListener('keydown', (event) => { if (event.key === 'ArrowLeft') diapoPrecedente() })
document.getElementById('modaleLightBox').addEventListener('swiped-left', diapoSuivante)
lbxSuivant.addEventListener('click', diapoSuivante)
document.getElementById('modaleLightBox').addEventListener('swiped-right', diapoSuivante)
lbxSuivant.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') diapoSuivante()
})
window.addEventListener('keydown', (event) => { if (event.key === 'ArrowRight') diapoSuivante() })
window.addEventListener('keydown', (event) => { if (event.code === 'Space') joueVideo() })

function fermeLightBox () {
  maLightbox.style.display = 'none'
  monDiaporama.innerHTML = ''
  document.getElementById('conteneurPage').style.display = 'block'
  document.querySelector('footer').style.display = 'flex'
  document.getElementById('modaleLightBox').setAttribute('aria-hidden', 'true')
  document.getElementById('modal-btn').style.visibility = 'visible'
  if (window.screen.width >= 900) {
    document.getElementById('monFooter').style.visibility = 'visible'
  }
}

function joueVideo () { // Permet de jouer ou de pauser la vidéo à la pression de la barre "espace"
  const maVideo = document.getElementById('maVideo')
  if (maVideo != null) {
    if (maVideo.paused) { maVideo.play() } else { maVideo.pause() }
  }
}

function ouvertureDiaporama (e) {
  if (window.screen.width < 900) {
    // Sinon le footer réapparaît...
    document.getElementById('monFooter').style.visibility = 'hidden'
    document.getElementById('monFooter').style.width = '0px'
  }
  document.getElementById('modal-btn').style.visibility = 'hidden'
  document.getElementById('conteneurPage').style.display = 'none'
  document.querySelector('footer').style.display = 'none'
  // On récupère le nom de l'image sur laquelle l'utilisateur a cliqué
  // const URLFichier = new URL(e.path[0].currentSrc).pathname
  const URLFichier = new URL(e.target.src).pathname
  console.log(e.target.src)
  let nomImage = URLFichier.split('/').pop() // https://stackoverflow.com/questions/511761/js-function-to-get-filename-from-url/2480287
  // Puis son index dans le tableau des médias
  indexPhoto = tableauPhotos.findIndex(imageCherchee => imageCherchee.image === nomImage)
  // on génère le HTML à injecter
  let htmlDiapo = ''
  if (indexPhoto === -1) { // pas d'image répondant à ce nom : c'est donc une vidéo
    // on remplace "jpg" par "mp4"
    nomImage = nomImage.replace(/jpg/g, 'mp4')
    indexPhoto = tableauPhotos.findIndex(imageCherchee => imageCherchee.video === nomImage)
    htmlDiapo = `<video controls id='diapo' id="maVideo" src='img/Sample_Photos/${id}/${nomImage.replace(/jpg/g, 'mp4')}' alt=''></video>`
  } else {
    htmlDiapo = `<img id="diapo" src='img/vignettesLightbox/${id}/${nomImage}' alt='${tableauPhotos[indexPhoto].alt_text}'/>`
  }
  htmlDiapo += `<p tabindex="54">${tableauPhotos[indexPhoto].title}</p>`
  document.getElementById('diaporama').innerHTML = htmlDiapo
  reportWindowSize()

  maLightbox.style.display = 'block'
  document.getElementById('modaleLightBox').setAttribute('aria-hidden', 'false')
}

function diapoPrecedente () {
  indexPhoto -= 1
  if (indexPhoto < 0) indexPhoto = tableauPhotos.length - 1
  let mediaPrecedent = tableauPhotos[indexPhoto].image
  let htmlDiapo = ''
  if (mediaPrecedent === '') { // c'est une vidéo
    mediaPrecedent = tableauPhotos[indexPhoto].video
    htmlDiapo = `<video controls id='diapo' id="maVideo" src='img/Sample_Photos/${id}/${mediaPrecedent}' alt='${tableauPhotos[indexPhoto].alt_text}'></video>`
  } else {
    htmlDiapo = `<img id="diapo" src='img/vignettesLightbox/${id}/${mediaPrecedent}' alt='${tableauPhotos[indexPhoto].alt_text}'/>`
  }
  htmlDiapo += `<p>${tableauPhotos[indexPhoto].title}</p>`
  document.getElementById('diaporama').innerHTML = htmlDiapo
  reportWindowSize()
}

function diapoSuivante () {
  indexPhoto += 1
  if (indexPhoto >= tableauPhotos.length) indexPhoto = 0
  let mediaSuivant = tableauPhotos[indexPhoto].image
  let htmlDiapo = ''
  if (mediaSuivant === '') { // c'est une vidéo
    mediaSuivant = tableauPhotos[indexPhoto].video
    htmlDiapo = `<video controls id='diapo' id="maVideo" src='img/Sample_Photos/${id}/${mediaSuivant}' alt='${tableauPhotos[indexPhoto].alt_text}'></video>`
  } else {
    htmlDiapo = `<img id="diapo" src='img/vignettesLightbox/${id}/${mediaSuivant}' alt='${tableauPhotos[indexPhoto].alt_text}'/>`
  }
  htmlDiapo += `<p>${tableauPhotos[indexPhoto].title}</p>`
  document.getElementById('diaporama').innerHTML = htmlDiapo
  reportWindowSize()
}

function reportWindowSize () {
  if (window.innerWidth < 1250) {
    document.getElementById('diapo').style.width = window.innerWidth * 21 / 25 + 'px'
    document.getElementById('diapo').style.height = window.innerWidth * 18 / 25 + 'px'
    document.getElementById('lbxFermeture').style.transform = 'translate(0, -35vw)'
  } else {
    document.getElementById('diapo').style.width = '1050px'
    document.getElementById('diapo').style.height = '900px'
    document.getElementById('lbxFermeture').style.transform = 'translate(0, -1350%)'
  }
  document.getElementById('diapo').style.objectFit = 'cover'
  document.getElementById('diapo').style.display = 'block'
  document.getElementById('diapo').style.margin = 'auto'
  document.getElementById('diapo').style.boxShadow = 'rgba(0, 0, 0, 0.15) 5px 0 2.6px'
}

window.addEventListener('resize', reportWindowSize)
// Fin de la gestion de la lightbox
