const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getRoomMessages } = require('../controllers/messageController');

router.get('/:roomId', auth, getRoomMessages);

module.exports = router;
