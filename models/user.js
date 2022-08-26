const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        unique: [true, 'username already exists.']
    },
})

userSchema.post('save', async (user) => {
    user.__v = undefined;
})

const User = mongoose.model('User', userSchema)

module.exports = User 
