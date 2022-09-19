const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    wallet_address: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    stat_upgrade: {
        type: String,
        required: true
    },
    wallet_balance: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('User', userSchema)