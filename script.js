const filter = document.querySelector("#search");
const countriesWrapper = document.querySelector(".countries-wrapper");
let countries = [];

const populate = (countriesArr) => {
  console.log(countriesArr);
  let size = countriesArr.length;
  console.log(size);
  if (!size || size > 20) {
    return;
  }
  const children = [];
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
  });
  countriesWrapper.replaceChildren(...children);
};

const errorMessage = () => {
  console.log("called");
  const children = document.createElement("h3");
  children.classList.add("span-all");
  children.textContent = "No countries found";
  countriesWrapper.replaceChildren(children);
};

const getCountryList = (e) => {
  let name = e.target.value;
  if (name !== "") {
    fetch(`https://restcountries.com/v3.1/name/${name}`)
      .then((response) => response.json())
      .then((data) => {
        countries = data;
        return countries;
      })
      .catch((error) => {
        console.log("here");
        console.log(error);
        errorMessage();
        return;
      });
  }
};

filter.addEventListener("input", getCountryList);
