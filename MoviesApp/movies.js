const apiKey = "6ef066366ac0704309d982ed711227d9";
let movies = [];
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

function showLoading() {
  document.getElementById("loading").classList.remove("hidden");
}

function hideLoading() {
  document.getElementById("loading").classList.add("hidden");
}

async function getRecommendedMovies() {
  showLoading();
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
  );
  const data = await response.json();
  movies = data.results;
  displayMovies(movies);
  hideLoading();
}

async function searchMovies() {
  const query = document.getElementById("searchInput").value;
  if (query) {
    showLoading();
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`
    );
    const data = await response.json();
    movies = data.results;
    displayMovies(movies);
    hideLoading();
  }
}

function displayMovies(movies) {
  const movieGrid = document.getElementById("movieGrid");
  movieGrid.innerHTML = movies
    .map(
      (movie) => `
        <div class="movie-card" onclick="showMovieDetails(${movie.id})">
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Release Date: ${movie.release_date}</p>
            <button class = "btn" onclick="addToWatchlist(event, ${movie.id})">Add to Watchlist</button>
        </div>
    `
    )
    .join("");
}

function sortMovies(criteria) {
  if (criteria === "popularity") {
    movies.sort((a, b) => b.popularity - a.popularity);
  } else if (criteria === "release_date") {
    movies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
  } else if (criteria === "rating") {
    movies.sort((a, b) => b.vote_average - a.vote_average);
  }
  displayMovies(movies);
}

async function showMovieDetails(movieId) {
  showLoading();
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,videos`
    );
    const movie = await response.json();
    
    console.log(movie);

    if (!movie || !movie.title) {
      alert("Movie data not found!");
      return;
    }

    const movieDetails = document.getElementById("movieDetails");
    movieDetails.innerHTML = `
      <h2>${movie.title}</h2>
      <p><strong>Rating:</strong> ${movie.vote_average}</p>
      <p><strong>Runtime:</strong> ${movie.runtime} minutes</p>
      <p><strong>Synopsis:</strong> ${movie.overview}</p>
      <p><strong>Cast:</strong> ${movie.credits.cast.slice(0, 5).map(actor => actor.name).join(", ")}</p>
      ${movie.videos.results.length ? 
        `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${movie.videos.results[0].key}" frameborder="0" allowfullscreen></iframe>` 
        : ""}
    `;
    
    document.getElementById("modal").classList.remove("hidden");
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
  hideLoading();
}


function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}
function displayWatchlist() {
  const watchlistGrid = document.getElementById("watchlistGrid");
  document.getElementById("watchlist").classList.remove("hidden");
  document.getElementById("movieGrid").classList.add("hidden");

  if (watchlist.length > 0) {
    watchlistGrid.innerHTML = ""; 
    watchlist.forEach(async (movieId) => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
      );
      const movie = await response.json();
      watchlistGrid.innerHTML += `
        <div class="movie-card" onclick="showMovieDetails(${movie.id})">
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Release Date: ${movie.release_date}</p>
            <button onclick="removeFromWatchlist(event, ${movie.id})">Remove</button>
        </div>
      `;
    });
  } else {
    watchlistGrid.innerHTML = "<p>Your watchlist is empty.</p>";
  }
}

function closeWatchlist() {
  document.getElementById("watchlist").classList.add("hidden");
  document.getElementById("movieGrid").classList.remove("hidden");
}
function addToWatchlist(event, movieId) {
  event.stopPropagation();
  if (!watchlist.includes(movieId)) {
    watchlist.push(movieId);
    localStorage.setItem("watchlist", JSON.stringify(watchlist)); 
    alert("Movie added to watchlist!");
  } else {
    alert("This movie is already in your watchlist.");
  }
}

function removeFromWatchlist(event, movieId) {
  event.stopPropagation();
  watchlist = watchlist.filter((id) => id !== movieId); 
  localStorage.setItem("watchlist", JSON.stringify(watchlist)); 
  displayWatchlist(); 
}

document.addEventListener("DOMContentLoaded", () => {
  getRecommendedMovies();

  if (watchlist.length>0) {
    displayWatchlist();
  }
});

function handleSortChange(select) {
  const value = select.value;
  if (value === "watchlist") {
    displayWatchlist(); 
  } else {
    sortMovies(value);
  }
}