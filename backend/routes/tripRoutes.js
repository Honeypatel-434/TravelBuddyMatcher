const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const tripCtrl = require('../controllers/tripController');

router.post('/', auth, tripCtrl.createTrip);
router.get('/', auth, tripCtrl.getTrips);   // or public if you want
router.put('/:id', auth, tripCtrl.updateTrip);
router.delete('/:id', auth, tripCtrl.deleteTrip);

module.exports = router;
