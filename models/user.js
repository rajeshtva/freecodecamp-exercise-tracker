const mongoose = require('mongoose');

const exerciseSchema = mongoose.Schema({
    date: Date,
    description: String,
    duration: Number,
})

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        unique: [true, 'username already exists.']
    },

    exercises: [exerciseSchema],
})

const User = mongoose.model('User', userSchema)

module.exports = User 
