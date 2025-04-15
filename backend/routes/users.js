const express = require('express')
const db = require('../db')
const router = express.Router()

router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await db.query(
      `SELECT username, email, location, created_at, mobile_number FROM Users WHERE user_id = ?`,
      [id],
    )
    if (rows.length === 0)
      return res.status(404).json({ error: 'User not found' })
    res.json(rows[0])
  } catch (err) {
    console.error('Error fetching user info:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
