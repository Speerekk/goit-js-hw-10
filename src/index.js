import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const flagsContainer = document.querySelector('.flags');

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
  clearFlags();

  countries.forEach(country => {
    const listItem = document.createElement('li');
    listItem.textContent = country.name?.official || '';
    countryList.appendChild(listItem);

    const flagImage = new Image();
    flagImage.src = country.flags?.svg || '';
    flagImage.alt = country.name?.official || '';
    flagImage.classList.add('flag');
    flagImage.style.width = '15px';
    flagImage.style.height = '10px';
    listItem.insertBefore(flagImage, listItem.firstChild);
  });
}

function clearFlags() {
  flagsContainer.innerHTML = '';
}

function showCountryInfo(country) {
  const { flags, name, capital, population, languages } = country;
  const flag = flags?.svg || '';
  const officialName = name?.official || '';
  const capitalText = capital || 'N/A';
  const populationText = population?.toLocaleString() || 'N/A';

  countryInfo.innerHTML = `
    <div class="country-card">
      <img src="${flag}" alt="${officialName}" class="flag" />
      <h2>${officialName}</h2>
      <p><strong>Capital:</strong> ${capitalText}</p>
      <p><strong>Population:</strong> ${populationText}</p>
      <p><strong>Languages:</strong> ${Object.values(languages)}</p>
    </div>
  `;
}

function clearResults() {
  clearCountryList();
  clearCountryInfo();
  clearFlags();
}

function clearCountryList() {
  countryList.innerHTML = '';
}

function clearCountryInfo() {
  countryInfo.innerHTML = '';
}
