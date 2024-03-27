const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    district: {
        type: String,
        required: [true, 'Please add a district']
    },
    province: {
        type: String,
        required: [true, 'Please add a province']
    },
    postalcode: {
        type: String,
        required: [true, 'Please add a postal code'],
        maxlength: [5, 'Postal code cannot be moore than 5 digits']
    },
    telNo: {
        type: String,
        required: [true, 'Please add a phone number'],
    },
    openTime: {
        type: Date,
        required: [true, 'Please add open time'],
    },
    closeTime: {
        type: Date,
        required: [true, 'Please add close time'],
    },
    maxCapacity: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        }
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);