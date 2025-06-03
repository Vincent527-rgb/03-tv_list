// ==== Sélections ====
const btnContainer      = document.querySelector(".btn-container");
const displayCategory   = document.querySelector(".display-category");
const popup             = document.querySelector(".popup");
// Pagination
const previousPage      = document.querySelector(".previous");
const nextPage          = document.querySelector(".next");
const numeroPage        = document.querySelector(".numero-page");

// ==== Variables ==== 
let currentPage = 1;
let currentCategory = "airing_today";
let totalPages = 0;

// ==== Fonctions utilitaires ==== 
function createElement(tag, className, content) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }
    if (content) {
        element.innerHTML = content;
    }
    return element;
}
function appendElement(parent, child) {
    parent.append(child);
}

// ==== Fonctions Fetch => API ====
async function getApi(choice = "airing_today", pageCategory = "1") {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${choice}?api_key=6631e5f1dc96088e0d26b86da29b5b6a&page=${pageCategory}`);
        const data = await response.json();

        console.log(data, "data");
        
        return data
    }
    catch (error) {
        console.error(error);
    }
}

async function displayApi(category = currentCategory, page = currentPage) {
    currentCategory = category;
    currentPage     = page;
    
    const movies = await getApi(category, page);
    totalPages = movies.total_pages;

    numeroPage.innerHTML = "";
    numeroPage.innerHTML = `${movies.page} /${totalPages}`;

    displayCategory.innerHTML = "";

    movies.results.forEach(movie => {

        const carte = createElement("div", "card", "");
        const titre = createElement("h2", "", `${movie.name}`);
        const figure = createElement("figure", "", `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.name}">`);
        const scoreOverlay = createElement("div", "score", `${movie.vote_average} /10`)

        appendElement(displayCategory, carte);
        appendElement(carte, titre);
        appendElement(carte, figure);
        appendElement(carte, scoreOverlay)
    });

    // Mettre à jour l'état des boutons de pagination
    previousPage.disabled = currentPage <= 1;
    nextPage.disabled = currentPage >= totalPages;
}

displayApi();

async function displayApiPopup(titleMovie) {

    const movies = await getApi(currentCategory, currentPage);
    popup.innerHTML = "";

    const moviePopup = movies.results.find(movie => movie.name === titleMovie)

    if (moviePopup) {
        const carte = createElement("div", "card", "");
        const figure = createElement("figure", "card__poster", `<img src="https://image.tmdb.org/t/p/w500${moviePopup.poster_path}" alt="${moviePopup.name}">`);
        const description = createElement("div", "card__description", "");
        const titre = createElement("h2", "", `${moviePopup.name}`);
        const airDate = createElement("small", "", `${moviePopup.first_air_date}`)
        const paragraphe = createElement("p", "", `${moviePopup.overview}`);
        const infoSupp = createElement("div", "info-supp", "");
        const country = createElement("div", "", `Pays d'origine: <span>${moviePopup.origin_country}</span>`)
        const language = createElement("div", "", `Langue d'origine: <span>${moviePopup.original_language}</span>`)
        const name = createElement("div", "", `Nom d'origine: <span>${moviePopup.original_name}</span>`)

        appendElement(popup, carte);
        appendElement(carte, figure)
        appendElement(carte, description)
        appendElement(description, titre)
        appendElement(description, airDate)
        appendElement(description, paragraphe)
        appendElement(description, infoSupp)
        appendElement(infoSupp, country)
        appendElement(infoSupp, language)
        appendElement(infoSupp, name)


        // Btn enlever la popup
        const btnClose = createElement("div", "close-btn", `❌`)
        appendElement(popup, btnClose)

        btnClose.addEventListener("click", function (event) {
            event.preventDefault();

            popup.classList.remove("active");
        })
    }
}

// ==== Evénements ====
btnContainer.addEventListener("click", function (event) {
    event.preventDefault();
    
    const btnCategory = document.querySelectorAll("button");
    btnCategory.forEach(bouton => {
        bouton.classList.remove("active");
    })

    if (event.target.dataset.category) {
        const category = event.target.dataset.category;
        event.target.classList.add("active");

        currentCategory = category;
        currentPage = 1; // Reset sur la première page au changement de catégorie
        
        displayApi(currentCategory, currentPage);
    }
})

previousPage.addEventListener("click", function (event) {
    event.preventDefault();

    if (currentPage > 1) {
        currentPage -= 1;
        displayApi(currentCategory, currentPage)
    }

})
nextPage.addEventListener("click", function (event) {
    event.preventDefault();

    currentPage += 1;
    displayApi(currentCategory, currentPage)
    
})

displayCategory.addEventListener("click", function (event) {
    event.preventDefault();

    if (event.target.closest(".card")) {
        const titleMovie = event.target.closest(".card").querySelector("h2").innerText;

        popup.classList.add("active");

        displayApiPopup(titleMovie);
    }
})