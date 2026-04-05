// Initialisation Swup
const swup = new Swup();

// Fonction de recherche existante
window.search = function() {
    let input = document.getElementById('searchBar').value.toLowerCase();
    let cards = document.getElementsByClassName('card');
            
    for (let i = 0; i < cards.length; i++) {
        if (!cards[i].innerText.toLowerCase().includes(input)) {
            cards[i].style.display = "none";
        } else {
            cards[i].style.display = "flex";
        }
    }
}

// Récupérer et afficher les cocktails
async function fetchAndDisplayCocktails() {
    const cardsContainer = document.querySelector('.cards');
    
    // Vérifier qu'on est sur la page des cards
    if (!cardsContainer) return; 

    try {
        // Appel d'API (liste les cockails qui commencent par A)
        const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a');
        const data = await response.json();

        // Limitation par rapport au nombre de cards
        const cocktails = data.drinks.slice(0, 4);

        cocktails.forEach((cocktail, index) => {
            // Afficher avec/sans alcool
            const isAlcoholic = cocktail.strAlcoholic; 

            // HTML de la card avec les données de l'API
            const cardHTML = `
            <div class="card-wrapper">
                <article class="card" style="--card-bg: #29395d;" data-tilt data-tilt-glare data-tilt-max-glare="0.5"> 
                    <div class="inner-border">
                        <h3>${cocktail.strDrink}</h3>
                        <img src="${cocktail.strDrinkThumb}/small" alt="${cocktail.strDrink}" class="cocktail-img">
                        <p class="deg">${isAlcoholic}</p>
                        <input type="checkbox" id="fav${index}" class="fav_checkbox">
                        <label for="fav${index}" class="fav_heart">❤</label>
                    </div>
                </article>
            </div>
            `;
            // Ajouter la card dans le HTML
            cardsContainer.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Reinitialiser VanillaTilt pour que l'effet s'applique aux cards
        const tiltElements = document.querySelectorAll("[data-tilt]"); 
        if (tiltElements.length > 0 && typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(tiltElements);
        }

    } catch (error) {
        console.error("Erreur lors de la récupération des cocktails :", error);
        cardsContainer.innerHTML = "<p style='color: white;'>Impossible de charger les cocktails.</p>";
    }
}

// Fonction init 
function init() {
    // Lancement de la récupération et de l'affichage des cartes via l'API
    fetchAndDisplayCocktails();

    // Initialisation Vanilla Tilt
    const tiltElements = document.querySelectorAll("[data-tilt]"); 
    // Verification de cartes et librairie
    if (tiltElements.length > 0 && typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(tiltElements);
    }

    // Formulaire
    let form = document.querySelector('#inscriptionForm');
    
    // Vérification de la présence du form pour éviter crash
    if (form) {
        form.addEventListener('submit', function(event) {
            // Blocage du rafraichissement submit
            event.preventDefault();

            // Définition des variables
            let pseudo = document.querySelector('#pseudo');
            let email = document.querySelector('#email');
            let password = document.querySelector('#password');
            let passwordRepeat = document.querySelector('#password2');
            
            let errorContainer = document.querySelector('.message-error');
            let errorList = document.querySelector('#errorList');
            let successContainer = document.querySelector('.message-success');

            // Réinitialisation des messages à chaque soumission
            errorList.innerHTML = '';
            errorContainer.classList.remove('visible');
            successContainer.classList.remove('visible');

            // VERIFICATION PSEUDO
            if(pseudo.value.length < 5) {
                errorContainer.classList.add('visible');
                pseudo.classList.remove('success');
                let err = document.createElement('li');
                err.innerText = "Le champ pseudo doit contenir au moins 5 caractères";
                errorList.appendChild(err);
            } else {
                pseudo.classList.add('success');
            }

            // VERIFICATION EMAIL
            if(email.value.length === 0) {
                errorContainer.classList.add('visible');
                email.classList.remove('success');
                let err = document.createElement('li');
                err.innerText = "Le champ email ne peut pas être vide";
                errorList.appendChild(err);
            } else {
                email.classList.add('success');
            }

            // VERIFICATION MOT DE PASSE
            let passCheck = new RegExp("^(?=.*[A-Z])(?=(?:.*[-+_!@#$%^&*.,?]){2}).+$");

            if(password.value.length < 8 || passCheck.test(password.value) == false) {
                errorContainer.classList.add('visible');
                password.classList.remove('success');
                let err = document.createElement('li');
                err.innerText = "Le mot de passe doit faire 8 caractères minimum, contenir 1 majuscule et 2 caractères spéciaux";
                errorList.appendChild(err);
            } else {
                password.classList.add('success');
            }

            // CONFIRMATION MDP
            if(passwordRepeat.value.length === 0 || passwordRepeat.value !== password.value) {
                errorContainer.classList.add('visible');
                passwordRepeat.classList.remove('success');
                let err = document.createElement('li');
                err.innerText = "Les mots de passe ne correspondent pas";
                errorList.appendChild(err);
            } else {
                passwordRepeat.classList.add('success');
            }

            // VALIDATION FINALE
            if(
                pseudo.classList.contains('success') &&
                email.classList.contains('success') &&
                password.classList.contains('success') &&
                passwordRepeat.classList.contains('success')
            ) {
                successContainer.classList.add('visible');
            }
        });
    }
}

// Chargement des scripts au premiet lancement
init();

// A chaque transition : swup init les scripts
swup.hooks.on('page:view', init);