// DOM Elements
const maModale = document.getElementById("modaleContact");
const modalBtn = document.querySelectorAll(".modal-btn");
const fermeModalBtn = document.querySelectorAll("#close");

// Evenements
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal)); // launch modal event
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