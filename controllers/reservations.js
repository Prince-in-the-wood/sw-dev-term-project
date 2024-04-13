const Reservation = require('../models/Reservation');

exports.getReservations = async (req, res, next) => {
    let query;

    if (req.user.role !== 'admin') {
        if (req.params.restaurantId) {
            query = Reservation.find({ user: req.user.id, restaurant: req.params.restaurantId }).populate({
                path: 'restaurant',
                select: 'name province telNo'
            });
        } else {
            query = Reservation.find({ user: req.user.id }).populate({
                path: 'restaurant',
                select: 'name province telNo'
            });
        }

    } else {
        if (req.params.restaurantId) {
            query = Reservation.find({ restaurant: req.params.restaurantId }).populate({
                path: 'restaurant',
                select: 'name province telNo'
            });

        } else {
            query = Reservation.find().populate({
                path: 'restaurant',
                select: 'name province telNo'
            });
        }
    }

    try {
        const reservations = await query;

        res.status(200).json({ success: true, count: reservations.length, data: reservations });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error occurred during get reservations' });
    }

};

exports.getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path: 'restaurant',
            select: 'name province telNo'
        });

        if (!reservation) {
            return res.status(404).json({ success: false, msg: `No reservation with the id of ${req.params.id}` });
        }

        if (req.user.role !== 'admin' && req.user.id !== reservation.user.toString()) {
            return res.status(401).json({ success: false, msg: `No reservation with the id of ${req.params.id}` });
        }

        res.status(200).json({ success: true, data: reservation });

    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error occured during get a reservations' });
    }
}