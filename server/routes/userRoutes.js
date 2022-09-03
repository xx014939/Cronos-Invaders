const express = require("express");
const User = require('../models/userModel')
const cors = require('cors'); 
const { registerUser } = require("../controllers/userController");
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

// Create User
router.post('/register', registerUser)

module.exports = router;
  