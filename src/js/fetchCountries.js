export function fetchCountries(name) {
  const fields = 'name,flags,capital,population,languages';
  const encodedName = encodeURIComponent(name); // кодируем имя страны, чтобы использовать в URL
  const url = `https://restcountries.com/v3.1/name/${encodedName}?fields=${fields}`;

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
    })
    .catch(error => {
      console.error(error);
      throw new Error('Error fetching country data');
    });
}
