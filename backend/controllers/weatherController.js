const { getWeatherByCity, getWeatherByCoords, getWeatherSmart } = require('../utils/weather');

exports.getWeather = async (req, res, next) => {
  try {
    const city = (req.query.city || '').trim();
    const country = (req.query.country || '').trim();
    const lat = req.query.lat;
    const lon = req.query.lon;

    let data;
    if (lat && lon) {
      data = await getWeatherByCoords(lat, lon);
    } else if (city) {
      data = await getWeatherSmart(city, country || undefined);
    } else {
      return res.status(400).json({ message: 'city or lat/lon required' });
    }
    res.json(data);
  } catch (err) { next(err); }
};
