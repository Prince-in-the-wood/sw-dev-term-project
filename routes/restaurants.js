const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

const reservationRouter = require("./reservations");
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
} = require("../controllers/restaurants");

router.use("/:restaurantId/reservations", reservationRouter);

router
  .route("/")
  .get(getRestaurants)
  .post(protect, authorize("admin"), createRestaurant);
router.route("/:id").get(getRestaurant);

module.exports = router;
