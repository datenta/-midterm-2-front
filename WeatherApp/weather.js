const apiKey = "1b7b36c82c133440c57e1fa0e4b8e833";
const locationInput = document.getElementById("location-input");
const searchButton = document.getElementById("search-button");
const unitToggle = document.getElementById("unit-toggle");
const forecastContainer = document.getElementById("forecast-container");
let isCelsius = true; 

async function fetchWeather(location) {
  const unit = isCelsius?"metric":"imperial"; 
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=${apiKey}`);
  const data = await response.json();
  displayCurrentWeather(data);
  fetchForecast(data.coord.lat, data.coord.lon);
}

async function fetchForecast(lat,lon) {
  const unit = isCelsius ? "metric":"imperial";
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`);
  const data = await response.json();
  displayForecast(data.list);
}

function displayCurrentWeather(data) {
  document.getElementById("location").textContent = data.name;
  document.getElementById("temp").textContent = `${Math.round(data.main.temp)}°${isCelsius ? "C" : "F"}`;
  document.getElementById("description").textContent = data.weather[0].description;
  document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById("wind-speed").textContent = `Wind: ${data.wind.speed} ${isCelsius ? "kph" : "mph"}`;
  document.getElementById("weatherIcon").src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

function displayForecast(forecast) {
  forecastContainer.innerHTML="";
  for (let i = 0; i < forecast.length; i += 8) { 
    const day = forecast[i];
    const forecastElement = document.createElement("div");
    forecastElement.classList.add("forecast-day");
    forecastElement.innerHTML = `
      <p>${new Date(day.dt_txt).toLocaleDateString("en",{weekday:"short"})}</p>
      <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="weather-icon">
      <p>${Math.round(day.main.temp_max)}° / ${Math.round(day.main.temp_min)}°</p>
    `;
    forecastContainer.appendChild(forecastElement);
  }
}

searchButton.addEventListener("click",()=>{
  const location =locationInput.value;
  if (location) {
    fetchWeather(location);
  }
});


unitToggle.addEventListener("click",()=> {
  isCelsius = !isCelsius; 
  unitToggle.textContent = isCelsius? "°C" : "°F"; 

  const location = document.getElementById("location").textContent;
  if (location!=="City Name") { 
    fetchWeather(location);
  }
});

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(position =>{
    fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
  });
}

async function fetchWeatherByCoords(lat,lon) {
  const unit = isCelsius ?"metric" : "imperial";
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`);
  const data = await response.json();
  displayCurrentWeather(data);
  fetchForecast(lat,lon);
}
