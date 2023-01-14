const filter = document.querySelector("#search");
const countriesWrapper = document.querySelector(".countries-wrapper");

const populate = (countriesArr) => {
  console.log(countriesArr);
  let size = countriesArr.length;
  console.log(size);
  const children = [];
  if (size > 20) {
    const h3 = document.createElement("h3");
    h3.classList.add("span-all");
    h3.textContent = "Too many countries to show";
    children.push(h3);
  } else {
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
    });
  }

  countriesWrapper.replaceChildren(...children);
};

const errorMessage = () => {
  const children = document.createElement("h3");
  children.classList.add("span-all");
  children.textContent = "No countries found";
  countriesWrapper.replaceChildren(children);
};

const getCountryList = (e) => {
  let name = e.target.value;
  if (name !== "") {
    fetch(`https://restcountries.com/v3.1/name/${name}`)
      .then((response) => {
        if (response.ok) return response.json();
        return Promise.reject(response); //Fetch promises only reject with a TypeError when a network error occurs. Since 4xx and 5xx responses aren't network errors, there's nothing to catch. You'll need to throw an error yourself
      })
      .then((data) => {
        populate(data);
      })
      .catch((error) => {
        console.log(error.status, error.statusText);
        errorMessage();
        return;
      });
  }
};

filter.addEventListener("input", getCountryList);
