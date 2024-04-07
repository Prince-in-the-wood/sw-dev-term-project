const express = require('express');
const { getReservations } = require('../controllers/reservations');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/').get(protect, getReservations);

module.exports = router;