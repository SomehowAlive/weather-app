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
        const C = document.createElement("li");
        C.classList.add("city");
        C.innerText = `${city.name}, ${city.region}, ${city.country}`;
        citiesList.appendChild(C);
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

searchInput.addEventListener("input", (e) => {
    const inputValue = e.currentTarget.value;
    if (inputValue.length >= 3) {
        SearchCities(inputValue).then((res) => addCities(res));
    } else {
        clearSearchResults();
    }
});
