const filter = document.querySelector("#search");
const countriesWrapper = document.querySelector(".countries-wrapper");
const back = document.querySelector(".back-btn");
const modal = document.querySelector(".modal");
const API_KEY = "29494cc03bb2a1a93840b6bf9121f3aa";

const populate = (countriesArr) => {
  // console.log(countriesArr);
  // let size = countriesArr.length;
  // console.log(size);
  const children = [];
  // if (size > 20) {
  //   const h3 = document.createElement("h3");
  //   h3.classList.add("span-all");
  //   h3.textContent = "Too many countries to show";
  //   children.push(h3);
  // } else {
  const h3 = document.createElement("h3");
  h3.classList.add("span-all");
  h3.textContent = "Countries Found";
  children.push(h3);
  countriesArr.forEach((country) => {
    const div = document.createElement("div");
    div.classList.add("grid-item");
    div.innerHTML = `<img
      class="img"
      src="${country.flags.svg}"
      alt=""
      />
      <h4 class="country-name">${country.name.common}</h4>
      <button class="btn">View</button>`;
    children.push(div);
    const btn = div.lastChild;
    btn.addEventListener("click", weatherData(country));
  });
  // }

  countriesWrapper.replaceChildren(...children);
};

const errorMessage = () => {
  const children = document.createElement("h3");
  children.classList.add("span-all");
  children.textContent = "No countries found";
  countriesWrapper.replaceChildren(children);
};

const showModal = (country, data) => {
  const info = document.querySelector(".info");
  info.innerHTML = `<img src="${country.flags.svg}" alt="" />
            <h1>${country.name.common}</h1>
            <h3>Official Name: ${country.name.official}</h3>
            <p>Capital: ${country.capital[0]}</p>
            <p>Region: ${country.region}</p>
            <p>Area: ${country.area.toLocaleString()} km<sup>2</sup></p>
            <p>Population: ${country.population.toLocaleString()}</p>
            <p>Languages: ${Object.values(country.languages).join(", ")}</p>`;
  modal.classList.remove("show-toggle");
  const weather = document.querySelector(".weather");
  weather.innerHTML = `<h1>Weather in ${country.capital[0]} today</h1>
            <div class="main">
              <h2 class="temp">${data.temperature}<sup>o</sup>C</h2>
              <div class="weather-main">
                <img
                  class="icon"
                  src="${data.weather_icon_url}"
                  alt=""
                />
                <h3>${data.weather_main}</h3>
              </div>
            </div>
            <div class="sub">
              <p>Feels like ${data.feels_like}<sup>o</sup>C</p>
              <p>${data.weather_desc}</p>
              <p>Humidity: ${data.humidity}</p>
            </div>`;
  document.body.scrollTop = document.documentElement.scrollTop = 0;
};

const weatherData = function (country) {
  return function curried_func(e) {
    const capital = country.capital[0];
    getWeather(capital)
      .then((data) => {
        const weather = data.weather[0];
        const weather_main = weather.main;
        const weather_desc = weather.description;
        const weather_icon_url = `http://openweathermap.org/img/wn/${weather.icon}@2x.png`;
        const temperature = Math.round((data.main.temp - 273.15) * 100) / 100;
        const feels_like =
          Math.round((data.main.feels_like - 273.15) * 100) / 100;
        const humidity = data.main.humidity;
        const weatherData = {
          weather_main,
          weather_desc,
          weather_icon_url,
          temperature,
          feels_like,
          humidity,
        };
        showModal(country, weatherData);
      })
      .catch((error) => console.log(error));
  };
};

// API CALLS

const getCountryList = async (e) => {
  let name = e.target.value;
  if (name === "") countriesWrapper.replaceChildren([]);
  if (name !== "") {
    fetch(`https://restcountries.com/v3.1/name/${name}`)
      .then((response) => {
        if (response.ok) return response.json();
        return Promise.reject(response); //Fetch promises only reject with a TypeError when a network error occurs. Since 4xx and 5xx responses aren't network errors, there's nothing to catch. You'll need to throw an error yourself
      })
      .then((data) => populate(data))
      .catch((error) => {
        console.log(error.status, error.statusText);
        errorMessage();
        return;
      });
  }
};

const getWeather = (capital) => {
  const api_key = API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`;
  return fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  });
};

// EVENT LISTENERS

filter.addEventListener("input", getCountryList);
back.addEventListener("click", () => {
  console.log("back");
  modal.classList.add("show-toggle");
});
