const express = require("express");
const User = require('../models/userModel')
const cors = require('cors'); 
const { registerUser, getUser, getUserById, updateUser } = require("../controllers/userController");
const router = express.Router();
// const {protect} = require('../middleware/authMiddleware')

// Getting all
router.get('/all', cors(), async (req, res) => {
    try {
      const users = await User.find()
      res.json(users)
      console.log(users)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
})

// Getting One
router.post('/wallet', getUser)

// Updating One
router.patch('/wallet', updateUser)

// Deleting One
router.delete('/:id', getUserById, async (req, res) => {
  try {
    await res.user.remove()
    res.json({ message: 'Deleted User' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// Create User
router.post('/register', registerUser)

module.exports = router;
  