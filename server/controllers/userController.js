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
            username: req.body.username,
            stat_upgrade: req.body.stat_upgrade,
            wallet_balance: req.body.wallet_balance
          })
        
        try {
            const newUser = await user.save()
            res.status(201).json({
                __id: user.id, 
                name: user.username,
                walletAddress: user.wallet_address,
                stat_upgrade: user.stat_upgrade,
                wallet_balance: user.wallet_balance
            })
        } catch (error) {
            res.status(400).json({ message: err.message })
        }
    }
})

const getUser = asyncHandler(async (req, res) => {
    const {wallet_address} = req.body
    // Check if user already exists
    let user = await User.findOne({wallet_address})
    if (user) {
        res.json({
            message: 'User Successfully Found',
            address: wallet_address,
            stat_upgrade: user.stat_upgrade,
            wallet_balance: user.wallet_balance
        })
    } else {
        return res.status(400).json({ message: err.message })
    }
  })

const updateUser = asyncHandler(async (req,res) => {
  const {wallet_address, wallet_balance} = req.body
  // Check if user already exists
  let user = await User.findOne({wallet_address})
  if (user) {
    user.wallet_balance = wallet_balance
    res.json({
      message: 'User Successfully Updated',
      address: wallet_address,
      stat_upgrade: user.stat_upgrade,
      wallet_balance: user.wallet_balance
    })
  } else {
      return res.status(400).json({ message: err.message })
  }
})

  const getUserById = asyncHandler(async (req, res, next) => {
    let user
    try {
      user = await User.findById(req.params.id)
      if (user == null) {
        return res.status(404).json({ message: 'Cannot find user' })
      }
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  
    res.user = user
    next()
  })

module.exports = {
    registerUser,
    getUser,
    getUserById,
    updateUser
}