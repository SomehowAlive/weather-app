const BASE_URL = "http://api.weatherapi.com/v1";
const API_KEY = "0d80ef40036046a98c2151921230908";
const citiesList = document.querySelector(".cities-list");
const searchInput = document.querySelector("#search-inp");

function clearSearchResults() {
    const toDelete = citiesList.children;
    if (toDelete.length)
        Array.from(toDelete).forEach((element) => {
            element.remove();
        });
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
            GetWeather(Unique);
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
    console.log(json);
    return json;
}

searchInput.addEventListener("input", (e) => {
    const inputValue = e.currentTarget.value;
    if (inputValue.length >= 3) {
        SearchCities(inputValue).then((res) => addCities(res));
    } else {
        clearSearchResults();
    }
});
