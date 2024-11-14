


const apiKey = "72182bb1b3c64718bd9a79433f9caf56"; // Use your actual API key

async function searchRecipes() {
    const searchQuery = document.getElementById("query").value;
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${searchQuery}&addRecipeInformation=true`);
        const data = await response.json();
        const recipeList = document.getElementById("results");
        recipeList.innerHTML = "";

        if (data.results.length === 0) {
            recipeList.innerHTML = "No recipes found.";
        } else {
            data.results.forEach(recipe => {
                const recipeItem = document.createElement("div");
                recipeItem.className = "recipe-item";

                const recipeTitle = document.createElement("h3");
                recipeTitle.textContent = recipe.title;

                const recipeDuration = document.createElement("p");
                recipeDuration.textContent = `Preperation time: ${recipe.readyInMinutes} min`;

                const recipeImage = document.createElement("img");
                recipeImage.src = recipe.image;
                recipeImage.alt = recipe.title; 

                const recipeLink = document.createElement("a");
                recipeLink.href = "#";
                recipeLink.textContent = "View Recipe";
                recipeLink.onclick = async function () {
                    await showRecipeDetails(recipe.id);
                };

                const favoriteMark = document.createElement("i");
                favoriteMark.className = "fas fa-heart"; 
                favoriteMark.style.cursor = "pointer";
                favoriteMark.onclick = ()=>favoriteStatusForREcipes(recipe)
                

                recipeItem.appendChild(recipeImage);
                recipeItem.appendChild(recipeTitle);
                recipeItem.appendChild(recipeDuration);
                recipeItem.appendChild(recipeLink);
                recipeItem.appendChild(favoriteMark);
                recipeList.appendChild(recipeItem);
            });
        }
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

async function showRecipeDetails(recipeId) {
    const recipeDetailsDiv = document.getElementById("recipe-details");
    const recipeContentDiv = document.getElementById("recipe-content");

    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
        const recipeData = await response.json();
        const kcal = Math.floor(Math.random() * 900) + 100;

        recipeContentDiv.innerHTML = `
            <h3>${recipeData.title}</h3>
            <img src="${recipeData.image}" alt="${recipeData.title}">
            <p><strong>Preperation time:</strong> ${recipeData.readyInMinutes} min</p>
            <p><strong>Calories:</strong>${kcal}kcal</p>
            <p><strong>Ingredients:</strong> ${recipeData.extendedIngredients.map(
                ingredient => ingredient.original
            ).join(', ')}</p>
            <p><strong>Instructions:</strong> ${recipeData.instructions || 'No instructions available.'}</p>
        `;

        recipeDetailsDiv.style.display = "block";
    } catch (error) {
        console.error("Error fetching recipe details:", error);
    }
}

function closeRecipeDetails() {
    const recipeDetailsDiv = document.getElementById("recipe-details");
    recipeDetailsDiv.style.display = "none";
}

function favoriteStatusForREcipes(recipe){
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isFavorite = favorites.some(fav => fav.id === recipe.id);

    if (isFavorite) {
        favorites = favorites.filter(fav => fav.id !== recipe.id);
        iconElement.classList.remove("active"); 
    } else {
        favorites.push(recipe);
        iconElement.classList.add("active"); 
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const favoritesContainer = document.getElementById("favorites-list");
    favoritesContainer.innerHTML = "";

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "No favorite recipes saved.";
    } else {
        favorites.forEach(recipe => {
            const recipeItem = document.createElement("div");
            recipeItem.className = "recipe-item";

            const recipeTitle = document.createElement("h3");
            recipeTitle.textContent = recipe.title;

            const recipeDuration = document.createElement("p");
            recipeDuration.textContent = `Preparation time: ${recipe.readyInMinutes} min`;

            const recipeImage = document.createElement("img");
            recipeImage.src = recipe.image;
            recipeImage.alt = recipe.title;

            recipeItem.appendChild(recipeImage);
            recipeItem.appendChild(recipeTitle);
            recipeItem.appendChild(recipeDuration);
            favoritesContainer.appendChild(recipeItem);
        });
    }
}

function autoSuggest() {
    const query = document.getElementById("query").value;
    if (query.length < 3) {
        document.getElementById("suggestions").style.display = "none";
        return;
    }

    fetch(`https://api.spoonacular.com/recipes/autocomplete?apiKey=${apiKey}&number=5&query=${query}`)
        .then(response => response.json())
        .then(data => {
            const suggestionsList = document.getElementById("suggestions");
            suggestionsList.innerHTML = "";
            data.forEach(suggestion => {
                const suggestionItem = document.createElement("p");
                suggestionItem.textContent = suggestion.title;
                suggestionItem.onclick = () => {
                    document.getElementById("query").value = suggestion.title;
                    searchRecipes();
                    suggestionsList.style.display = "none";
                };
                suggestionsList.appendChild(suggestionItem);
            });
            suggestionsList.style.display = "block";
        })
        .catch(error => console.error("Error fetching suggestions:", error));
}

const homeBtn = document.getElementById("home-btn");

// Add a click event listener
homeBtn.addEventListener("click", function() {
    // Functionality to be executed when the button is clicked
    console.log("Home button clicked");
    
    // Example: Navigating back to the home or main view
    displayHomePage();
});

// Example function for displaying the home page
function displayHomePage() {
    // Code to reset the app view to the main page
    document.getElementById("results").innerHTML = ""; // Clear results
    document.getElementById("query").value = ""; // Clear search input
    document.getElementById("recipe-details").style.display = "none"; // Hide details
}

