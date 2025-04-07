const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../db')
const router = express.Router()

// Sign-up
router.post('/signup', async (req, res) => {
  const { username, email, password, location, phoneNumber } = req.body
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert the new user into the database
    const [result] = await pool.query(
      'INSERT INTO Users (name, email, password, location, mobile_number) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, location, phoneNumber],
    )

    // Fetch the newly inserted user
    const [newUser] = await pool.query(
      'SELECT * FROM Users WHERE user_id = ?',
      [result.insertId],
    )

    // Return the new user
    res.json(newUser[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    // Fetch the user by email
    const [user] = await pool.query('SELECT * FROM Users WHERE email = ?', [
      email,
    ])

    // Check if the user exists
    if (user.length === 0) {
      return res.status(400).json('Invalid credentials')
    }

    // Compare the password
    const validPassword = await bcrypt.compare(password, user[0].password)
    if (!validPassword) {
      return res.status(400).json('Invalid credentials')
    }

    const token = user[0].user_id

    res.json({ token })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
