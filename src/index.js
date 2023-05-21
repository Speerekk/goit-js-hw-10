import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchBox = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// Функция для отображения списка стран
function renderCountryList(countries) {
  countryList.innerHTML = '';

  if (countries.length === 0) {
    Notiflix.Notify.info('Oops, there is no country with that name');
    return;
  }

  if (countries.length > 10) {
    Notiflix.Notify.warning(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }

  const listItems = countries
    .map(
      country =>
        `<li><img src="${country.flags.svg}" alt="${country.name.official}">${country.name.official}</li>`
    )
    .join('');

  countryList.innerHTML = listItems;
}

// Функция для отображения информации о стране
function renderCountryInfo(country) {
  const languages = country.languages.map(language => language.name).join(', ');

  countryInfo.innerHTML = `
    <div class="country-card">
      <img src="${country.flags.svg}" alt="${country.name.official}">
      <h2>${country.name.official}</h2>
      <p><strong>Capital:</strong> ${country.capital}</p>
      <p><strong>Population:</strong> ${country.population}</p>
      <p><strong>Languages:</strong> ${languages}</p>
    </div>
  `;
}

// Функция для обработки ввода пользователя
const handleInput = debounce(() => {
  const searchTerm = searchBox.value.trim();

  if (searchTerm === '') {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(searchTerm)
    .then(countries => {
      if (countries.length === 1) {
        renderCountryInfo(countries[0]);
      } else {
        renderCountryList(countries);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, something went wrong. Please try again.');
    });
}, DEBOUNCE_DELAY);

// Назначение обработчика события input
searchBox.addEventListener('input', handleInput);

// const DEBOUNCE_DELAY = 300;
