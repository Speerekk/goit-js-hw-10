import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

searchBox.addEventListener('input', debounce(handleSearch, DEBOUNCE_DELAY));

function handleSearch() {
  const searchTerm = searchBox.value.trim();

  if (searchTerm === '') {
    clearResults();
    return;
  }

  fetchCountries(searchTerm)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearResults();
      } else if (countries.length >= 2 && countries.length <= 10) {
        showCountryList(countries);
        clearCountryInfo();
      } else if (countries.length === 1) {
        showCountryInfo(countries[0]);
        clearCountryList();
      } else {
        Notiflix.Notify.failure('Oops, there is no country with that name.');
        clearResults();
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Oops, something went wrong. Please try again later.'
      );
      clearResults();
      console.error(error);
    });
}

function showCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li><img src="${country.flags.svg}" alt="${country.name.official}" class="flag" /> ${country.name.official}</li>`;
    })
    .join('');

  countryList.innerHTML = markup;
}

function showCountryInfo(country) {
  const flag = country.flags?.svg || '';
  const officialName = country.name?.official || '';
  const capital = country.capital || 'N/A';
  const population = country.population?.toLocaleString() || 'N/A';
  const languages = Array.isArray(country.languages)
    ? country.languages.join(', ')
    : 'N/A';

  countryInfo.innerHTML = `
    <div class="country-card">
      <img src="${flag}" alt="${officialName}" class="flag" />
      <h2>${officialName}</h2>
      <p><strong>Capital:</strong> ${capital}</p>
      <p><strong>Population:</strong> ${population}</p>
      <p><strong>Languages:</strong> ${languages}</p>
    </div>
  `;
}

function clearResults() {
  clearCountryList();
  clearCountryInfo();
}

function clearCountryList() {
  countryList.innerHTML = '';
}

function clearCountryInfo() {
  countryInfo.innerHTML = '';
}
