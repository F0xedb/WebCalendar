const express = require('express');
const router = express.Router();
const eventController = require('../controllers/calendar');

router.get('/', eventController.getAll);
router.post('/create', eventController.create);
router.get('/:eventId', eventController.getById);
router.post('/update', eventController.update);
router.post('/delete', eventController.delete);

module.exports = router;