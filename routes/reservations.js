const express = require('express');
const { getReservations, getReservation } = require('../controllers/reservations');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/').get(protect, getReservations);
router.route('/:id').get(protect, getReservation);

module.exports = router;