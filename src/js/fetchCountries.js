export function fetchCountries(name) {
  const url = `https://restcountries.com/v3.1/name/${name}?fullText=true&fields=name.official,capital,population,flags.svg,languages`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Country not found');
      }
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data)) {
        return data;
      } else {
        return [];
      }
    });
}
