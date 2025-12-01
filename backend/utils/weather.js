const fetch = require('node-fetch');

const OPEN_KEY = process.env.OPENWEATHER_KEY;

async function getWeatherByCity(city) {
  if (!OPEN_KEY) throw new Error('Missing OPENWEATHER_KEY');
  const q = encodeURIComponent(city);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&units=metric&appid=${OPEN_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather fetch failed');
  const data = await res.json();
  return normalizeWeather(data);
}

async function getWeatherByCoords(lat, lon) {
  if (!OPEN_KEY) throw new Error('Missing OPENWEATHER_KEY');
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=metric&appid=${OPEN_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather fetch failed');
  const data = await res.json();
  return normalizeWeather(data);
}

async function geocodeCity(city, country) {
  if (!OPEN_KEY) throw new Error('Missing OPENWEATHER_KEY');
  const q = country ? `${city},${country}` : city;
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=1&appid=${OPEN_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocode failed');
  const arr = await res.json();
  if (!Array.isArray(arr) || arr.length === 0) throw new Error('Geocode no results');
  return { lat: arr[0].lat, lon: arr[0].lon };
}

async function getWeatherSmart(city, country) {
  try {
    const { lat, lon } = await geocodeCity(city, country);
    return await getWeatherByCoords(lat, lon);
  } catch (_) {
    return await getWeatherByCity(city);
  }
}

function normalizeWeather(data) {
  return {
    temp: data.main?.temp,
    feels_like: data.main?.feels_like,
    condition: data.weather?.[0]?.main,
    raw: data,
  };
}

module.exports = { getWeatherByCity, getWeatherByCoords, geocodeCity, getWeatherSmart };
