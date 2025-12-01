const router = require('express').Router();
const notify = require('../controllers/notificationController');

router.post('/', notify.sendGeneric);
router.post('/message', notify.notifyMessage);
router.post('/match', notify.notifyMatch);

module.exports = router;

