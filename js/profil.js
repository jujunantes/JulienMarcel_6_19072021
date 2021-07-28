// On récupère l'URL pour obtenir l'ID
const url = new URL(window.location);
const id = url.searchParams.get('id');

const mainProfil = document.getElementById('mainProfil');

mainProfil.innerHTML = "ID : " + id;