const debounce = require('lodash.debounce');
import Notiflix from 'notiflix';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const searchInput = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchInput.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry() {
  const inputValue = searchInput.value.trim();
  if (!inputValue || inputValue === '') {
    return;
  }
  fetchCountries(inputValue)
    .then(countries => searchResolved(countries))
    .catch(error => searchRejected(error));
}

function searchResolved(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length <= 10 && countries.length >= 2) {
    countriesMarkup(countries);
    countryInfo.innerHTML = '';
  } else if (countries.length === 1) {
    countryInfoMarkup(...countries);
    countriesList.innerHTML = '';
  }
}
function searchRejected(error) {
  countriesList.innerHTML = '';
  countryInfo.innerHTML = '';
  Notiflix.Notify.failure('Oops, there is no country with that name');
  console.log(error);
}

function countriesMarkup(countries) {
  const listMarkup = countries
    .map(country => {
      return `<li class="list-wrapper">
    <img src="${country.flags.svg}" alt="${country.name.official}" width="30" height="30" />
    <p>${country.name.official}</p>
    </li>`;
    })
    .join('');

  return (countriesList.innerHTML = listMarkup);
}
function countryInfoMarkup(country) {
  const languagesKey = country.name.official.slice(0, 3).toLowerCase();
  const markup = ` <div class="wrapper">
    <img src="${country.flags.svg}" alt="${country.name.official}" width="30" height="30" />
    <h2>${country.name.official}</h2>
  </div><ul>
  <li><h3>Capital:</h3><p>${country.capital}</p></li>
  <li><h3>Population:</h3><p>${country.population}</p></li>
  <li><h3>Languages</h3><p>${country.languages[languagesKey]}</p></li></ul>`;

  return (countryInfo.innerHTML = markup);
}
