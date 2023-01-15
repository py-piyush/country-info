const filter = document.querySelector("#search");
const countriesWrapper = document.querySelector(".countries-wrapper");

let countries = [];

const getCountryList = async () => {
  const data = await fetch("https://restcountries.com/v3.1/all").then(
    (response) => response.json()
  );
  data.forEach((country) => countries.push(country));
};

getCountryList();
const createHTML = (country) => {
  const div = document.createElement("div");
  div.classList.add("grid-item");
  div.innerHTML = `<img
      class="img"
      src="${country.flags.svg}"
      alt=""
      />
      <h4 class="country-name">${country.name.common}</h4>
      <button class="btn">View</button>`;
  countriesWrapper.appendChild(div);
};
countries.forEach((country) => {
  console.log(country);
  createHTML(country);
});

const showCountry = (e) => {
  countriesWrapper.replaceChildren([]);
  const searchVal = e.target.value.toLowerCase();
  countries.forEach((country) => {
    let common = country.name.common.toLowerCase(),
      official = country.name.official.toLowerCase();
    if (common.includes(searchVal) || official.includes(searchVal))
      createHTML(country);
  });
};

filter.addEventListener("input", showCountry);
