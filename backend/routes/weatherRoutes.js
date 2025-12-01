const router = require('express').Router();
const weatherCtrl = require('../controllers/weatherController');

router.get('/', weatherCtrl.getWeather);

module.exports = router;

