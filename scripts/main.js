// ==== Sélections ====
const btnContainer      = document.querySelector(".btn-container");
const displayCategory   = document.querySelector(".display-category");
const popup             = document.querySelector(".popup");

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
async function getApi(choice = "airing_today") {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${choice}?api_key=6631e5f1dc96088e0d26b86da29b5b6a`);
        const data = await response.json();

        console.log(data.results, "data");
        
        return data.results
    }
    catch (error) {
        console.error(error);
    }
}

async function displayApi() {
    const movies = await getApi();

    displayCategory.innerHTML = "";

    movies.forEach(movie => {

        const carte = createElement("div", "card", "");
        const titre = createElement("h2", "", `${movie.original_name}`);
        const figure = createElement("figure", "", `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.original_name}">`);

        appendElement(displayCategory, carte);
        appendElement(carte, titre);
        appendElement(carte, figure);
    });
}

displayApi();