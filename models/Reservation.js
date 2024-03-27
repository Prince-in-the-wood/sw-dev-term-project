const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
    reserveDate: {
        type: Date,
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    noOfTabel: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: "{VALUE} is not an integer value",
        },
    },
});

module.exports = mongoose.model('Reservation', ReservationSchema);