export function fetchCountries(name) {
  const fields = 'name,flags.svg,capital,population,languages';
  const url = `https://restcountries.com/v3.1/name/${name}?fields=${fields}`;

  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    })
    .then(data => {
      if (Array.isArray(data)) {
        return data;
      } else {
        throw new Error('Country not found');
      }
    });
}
