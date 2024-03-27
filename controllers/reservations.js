exports.getReservations = (req, res, next) => {
    res.status(200).json({ success: true, msg: "Show all reservations" });
};
