const { format } = require('date-fns');
const mongoose = require('mongoose')

const getFormattedDate = function (it) {
    return format(it, 'eee LLL dd yyyy');
};
const exerciseSchema = mongoose.Schema({
    description: {
        type: String,
        required: [true, 'description field is required.']
    },
    duration: {
        type: Number,
        required: [true, 'duration field is required']
    },
    date: {
        type: Date,
        default: Date.now(),
        required: false,
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    }
})


const Exercise = mongoose.model('Exercise', exerciseSchema)

module.exports = Exercise;
