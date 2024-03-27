const express = require('express');
const { getReservations } = require('../controllers/reservations');
const router = express.Router();

router.get('/', getReservations);

module.exports = router;