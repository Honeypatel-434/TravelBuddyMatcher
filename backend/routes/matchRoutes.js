const router = require('express').Router();
const matchCtrl = require('../controllers/matchController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, matchCtrl.getMatches);

module.exports = router;
