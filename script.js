const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const BASE_URL = "http://api.weatherapi.com/v1";
const API_KEY = "0d80ef40036046a98c2151921230908";
const citiesList = document.querySelector(".cities-list");
const searchInput = document.querySelector("#search-inp");
const hourlyCards = document.querySelector(".hourly-cards");

function hourCard(hourlydata, idx) {
    const card = document.createElement("div");
    const hour = document.createElement("p");
    const cardRow2 = document.createElement("div");
    const hourlyCondIcon = new Image();
    const temp = document.createElement("p");

    card.classList.add("hourly-card");
    hour.classList.add("hourly-text");
    cardRow2.classList.add("hourly-card-row2");
    hourlyCondIcon.classList.add("hourly-condition-icon");
    temp.classList.add("hourly-temp");

    hour.innerText = hourlydata.time.split(" ")[1];
    hourlyCondIcon.src = hourlydata.condition.icon;
    temp.innerText = hourlydata.temp_c + "°C";

    card.style.animationDelay = (idx + 1) / 22 + "s";

    card.appendChild(hour);
    cardRow2.appendChild(hourlyCondIcon);
    card.appendChild(cardRow2);
    card.appendChild(temp);

    return card;
}

function updateWeatherDom(weatherResults) {
    const today = new Date();
    const { current, forecast, location } = weatherResults;
    const { feelslike_c, temp_c, condition } = current;
    const { icon, text } = condition;
    const { name, region, country } = location;
    const hourlyForecast = forecast.forecastday[0].hour;

    document.querySelector(".current-date").innerText = `${DAYS[today.getDay()]} ${today.getDate()} ${
        MONTHS[today.getMonth()]
    } ${today.getFullYear()}`;
    document.querySelector(".temp").innerText = temp_c;
    document.querySelector(".feels-like").innerText = feelslike_c;
    document.querySelector(".condition-icon").src = icon;
    document.querySelector(".current-text").innerText = text;
    document.querySelector(".current-city").innerText = `${name}, ${region}, ${country}`;

    hourlyCards.childNodes.forEach((child) => child.remove());

    hourlyForecast.forEach((hourData, idx) => {
        const hourlyCard = hourCard(hourData, idx);
        hourlyCards.appendChild(hourlyCard);
    });
}

async function changeBackground(keyword) {
    const res = await fetch("https://source.unsplash.com/random/1920x1080?" + keyword);
    const url = res.url;
    document.body.style.background = `linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.2)), url('${url}')`;
}

function clearSearchResults() {
    const toDelete = citiesList.children;
    if (toDelete.length)
        Array.from(toDelete).forEach((element) => {
            element.remove();
        });
}

function AddNotFoundCity() {
    clearSearchResults();
    const notFound = document.createElement("li");
    notFound.classList.add("city", "error");
    notFound.innerText = "Sorry, We Couldn't find any location that matches the name you typed !";
    citiesList.appendChild(notFound);
}

function addCities(cities) {
    clearSearchResults();
    console.log(cities);
    cities.forEach((city) => {
        const Unique = `${city.name}, ${city.region}, ${city.country}`;
        const cityNode = document.createElement("li");
        cityNode.classList.add("city");
        cityNode.innerText = Unique;
        cityNode.setAttribute("id", Unique);
        cityNode.onclick = (e) => {
            GetWeather(Unique).then((res) => {
                changeBackground(res.current.condition.text);
                updateWeatherDom(res);
            });
            clearSearchResults();
            searchInput.value = "";
        };
        citiesList.appendChild(cityNode);
    });
}

async function SearchCities(keyword) {
    const res = await fetch(
        BASE_URL +
            "/search.json?" +
            new URLSearchParams({
                key: API_KEY,
                q: keyword,
            })
    );

    const json = await res.json();
    return json;
}

async function GetWeather(city) {
    const res = await fetch(
        BASE_URL +
            "/forecast.json?" +
            new URLSearchParams({
                key: API_KEY,
                q: city,
            })
    );
    const json = await res.json();
    return json;
}

searchInput.addEventListener("input", (e) => {
    const inputValue = e.currentTarget.value;
    if (inputValue.length >= 3) {
        SearchCities(inputValue).then((res) => {
            if (res.length) addCities(res);
            else AddNotFoundCity();
        });
    } else {
        clearSearchResults();
    }
});
