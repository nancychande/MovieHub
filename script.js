
const KEY = "e9e0cab6";
let watchlist = JSON.parse(localStorage.getItem("movies")) || [];

async function searchMovies() {
    let name = document.getElementById("search").value;
    let url = `https://www.omdbapi.com/?s=${name}&apikey=${KEY}`;
    let data = await fetch(url).then(r => r.json());
    showMovies(data.Search || [], "movies");
}

function showMovies(list, id) {
    document.getElementById(id).innerHTML = list.map(m =>
        `<div class="movie-card">
        <img src="${m.Poster}">
        <h3>${m.Title}</h3><p>${m.Year}</p>
        <button onclick="details('${m.imdbID}')">Details</button>
        </div>`).join("");
}

async function details(id) {
    let data = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${KEY}`).then(r => r.json());
    document.getElementById("modalContent").innerHTML =
        `<h2>${data.Title}</h2><img src="${data.Poster}" width="150">
        <p>${data.Plot}</p><p>${data.Genre}</p>
        <button onclick="save('${id}')">Add to Watchlist</button>`;
    document.getElementById("modal").classList.add("show");
}

function save(id) {
    if (!watchlist.some(m => m.imdbID === id)) watchlist.push({ imdbID: id });
    localStorage.setItem("movies", JSON.stringify(watchlist));
    alert("Movie saved!");
}

function loadList() {
    Promise.all(watchlist.map(m => fetch(`https://www.omdbapi.com/?i=${m.imdbID}&apikey=${KEY}`).then(r => r.json())))
    .then(data => showMovies(data, "savedMovies"));
}

document.getElementById("searchBtn").onclick = searchMovies;
document.getElementById("closeModal").onclick = () => document.getElementById("modal").classList.remove("show");
document.querySelectorAll("nav button").forEach(b => b.onclick = () => {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(b.dataset.page).classList.add("active");
    if (b.dataset.page === "watchlist") loadList();
});
document.getElementById("home").classList.add("active");
