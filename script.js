const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';
let lastCity = 'Dhaka';
let map, marker;

$(document).ready(() => {
  $('#get-weather').click(() => {
    const city = $('#city-input').val().trim();
    if (city) {
      lastCity = city;
      fetchWeather(city);
    } else {
      alert('Enter a city');
    }
  });

  fetchWeather(lastCity);
  setInterval(() => fetchWeather(lastCity), 30000);
});

function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) return alert('City not found!');
      showWeather(data);
      updateMap(data.coord.lat, data.coord.lon, data.name);
    });
}

function showWeather(data) {
  const temp = data.main.temp;
  const feels = data.main.feels_like;
  const weather = data.weather[0].main.toLowerCase();
  const desc = data.weather[0].description;
  const icon = data.weather[0].icon;

  $('#city-name').text(data.name);
  $('#time-date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
  $('#temperature').html(`🌡 Temperature: ${Math.round(temp)}°C`);
  $('#feels-like').html(`🔥 Feels Like: ${Math.round(feels)}°C`);
  $('#weather-description').text(`☁️ ${desc}`);
  $('#wind-speed').text(`💨 Wind: ${data.wind.speed} m/s`);
  $('#weather-icon').attr('src', `http://openweathermap.org/img/wn/${icon}@2x.png`);
  $('#clothing-suggestion').text(getClothingSuggestion(temp, data.wind.speed));
  $('#spotify-link').attr('href', getSpotifyLink(weather)).removeClass('hidden');
  $('#weather-info').removeClass('hidden');
  applyTheme(weather);
}

function getClothingSuggestion(temp, wind) {
  if (temp < 5) return "🧥 It's freezing! Wear heavy coat, gloves & scarf.";
  if (temp < 15) return "🌬 It's cold & windy — Don't forget your hoodie!";
  if (temp < 25) return "🌤 Mild weather. T-shirt with light jacket is fine.";
  return "☀️ It's hot! Stay cool with light clothes & sunglasses.";
}

function getSpotifyLink(condition) {
  if (condition.includes('rain')) return 'https://open.spotify.com/playlist/37i9dQZF1DXbvABJXBIyiY'; // Lo-fi
  if (condition.includes('snow')) return 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO'; // Chill instrumental
  if (condition.includes('clear') || condition.includes('sun')) return 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC'; // Happy pop
  return 'https://open.spotify.com/playlist/37i9dQZF1DWUvHZA1zLcjW'; // Default chill
}

function applyTheme(weather) {
  const hour = moment().hour();
  let bg;

  if (weather.includes('rain')) bg = '#b3e5fc';
  else if (hour >= 6 && hour < 18) bg = '#fffde7';
  else bg = '#263238';

  $('body').css('background', bg);
}

function updateMap(lat, lon, city) {
  if (!map) {
    map = L.map('map').setView([lat, lon], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    marker = L.marker([lat, lon]).addTo(map).bindPopup(`${city}`).openPopup();
  } else {
    map.setView([lat, lon], 8);
    marker.setLatLng([lat, lon]).setPopupContent(`${city}`).openPopup();
  }
}
