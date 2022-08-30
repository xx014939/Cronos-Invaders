const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const e = require('cors')

const registerUser = asyncHandler ( async (req, res) => {
    const {wallet_address, username} = req.body

    // Check if user already exists
    const userExists = await User.findOne({wallet_address})

    if (userExists) {
        res.status(400).json({ message: 'User Exists' })
    } else {

        // Create new user object
        const user = new User({
            wallet_address: req.body.wallet_address,
            username: req.body.username
          })
        
        try {
            const newUser = await user.save()
            res.status(201).json({
                __id: user.id, 
                name: user.username,
                walletAddress: user.wallet_address
            })
        } catch (error) {
            res.status(400).json({ message: err.message })
        }
    }
})

module.exports = {
    registerUser
}