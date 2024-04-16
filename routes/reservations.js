const express = require("express");
const {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
} = require("../controllers/reservations");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, getReservations)
  .post(protect, authorize("user"), createReservation);
router
  .route("/:id")
  .get(protect, getReservation)
  .put(protect, authorize("admin", "user"), updateReservation)
  .delete(protect, authorize("admin", "user"), deleteReservation);

module.exports = router;
