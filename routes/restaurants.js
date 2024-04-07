const express = require('express');
const router = express.Router();

const reservationRouter = require('./reservations');
const { getRestaurants, getRestaurant } = require('../controllers/restaurants');

router.use('/:restaurantId/reservations', reservationRouter);

router.route('/').get(getRestaurants);
router.route('/:id').get(getRestaurant);

module.exports = router;