const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

var Reservation = new Schema({
    name: {
        type: String
    },
    phone: {
        type: String
    },
    table: {
        type: String
    },
    class: {
        type: String
    },
    date: {
        type: Date
    },
    time: {
        type: String
    }
});

module.exports = mongoose.model('Reservation', Reservation);
