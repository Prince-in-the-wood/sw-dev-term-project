const Reservation = require("../models/Reservation");
const Restaurant = require("../models/Restaurant");

exports.getReservations = async (req, res, next) => {
  let query;

  if (req.user.role !== "admin") {
    if (req.params.restaurantId) {
      query = Reservation.find({
        user: req.user.id,
        restaurant: req.params.restaurantId,
      }).populate({
        path: "restaurant",
        select: "name province telNo",
      });
    } else {
      query = Reservation.find({ user: req.user.id }).populate({
        path: "restaurant",
        select: "name province telNo",
      });
    }
  } else {
    if (req.params.restaurantId) {
      query = Reservation.find({
        restaurant: req.params.restaurantId,
      }).populate({
        path: "restaurant",
        select: "name province telNo",
      });
    } else {
      query = Reservation.find().populate({
        path: "restaurant",
        select: "name province telNo",
      });
    }
  }

  try {
    const reservations = await query;

    res
      .status(200)
      .json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, msg: "Error occurred during get reservations" });
  }
};

exports.getReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate({
      path: "restaurant",
      select: "name province telNo",
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        msg: `No reservation with the id of ${req.params.id}`,
      });
    }

    if (
      req.user.role !== "admin" &&
      req.user.id !== reservation.user.toString()
    ) {
      return res.status(401).json({
        success: false,
        msg: `No reservation with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, msg: "Error occured during get a reservations" });
  }
};

exports.addReservation = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.body.restaurant);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: `No restaurant with the id of ${req.body.restaurant}`,
      });
    }

    req.body.user = req.user.id;
    if (req.body.noOfTable < 1) {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} cannot create a reservation with non-positive number of tables`,
      });
    }
    if (req.body.noOfTable > 3) {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} cannot create a reservation with more than 3 tables`,
      });
    }

    const maxCapacity = restaurant.maxCapacity;
    let query = Reservation.find({
      restaurant: req.body.restaurant,
      reserveDate: req.body.reserveDate,
    }).populate({
      path: "restaurant",
      select: "name province telNo",
    });
    const otherReservedTables = await query;
    let noOfOtherReservedTables = 0;
    for (let i = 0; i < otherReservedTables.length; i++) {
      noOfOtherReservedTables += otherReservedTables[i].noOfTable;
    }
    if (noOfOtherReservedTables + parseInt(req.body.noOfTable) > maxCapacity) {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} cannot create a reservation exceeding the max capacity of the restaurant`,
      });
    }

    const reservation = await Reservation.create(req.body);
    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create Reservation" });
  }
};
