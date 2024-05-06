const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    stateCode: {
        type: String,
        required: true,
        unique: true
    },
    funfacts: [{
        type: String
    }],
    capital: String,
    nickname: String,
    population: Number,
    admission: Date
});

const State = mongoose.model('State', stateSchema);

module.exports = State;
