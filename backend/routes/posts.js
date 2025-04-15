const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/latest', async (req, res) => {
  try {
    const [rows] = await db.query(`
        SELECT 
          d.*, 
          u.username AS username, 
          u.location AS location
        FROM Donations d
        JOIN Users u ON d.user_id = u.user_id
        ORDER BY d.created_at DESC
      `)

    const formattedDonation = rows.map((row) => {
      const { username, location, image, ...rest } = row

      return {
        ...rest,
        image: image
          ? `data:image/jpeg;base64,${image.toString('base64')}`
          : null,
        user: {
          username,
          location,
        },
      }
    })

    const [receivingRows] = await db.query(`
        SELECT 
          r.*, 
          u.username AS username, 
          u.location AS location
      FROM Receivings r
      JOIN Users u ON r.user_id = u.user_id
      ORDER BY r.created_at DESC
      LIMIT 1
    `)

    const formattedReceiving = receivingRows.map((row) => {
      const { username, location, image, ...rest } = row

      return {
        ...rest,
        image: image
          ? `data:image/jpeg;base64,${image.toString('base64')}`
          : null,
        user: {
          username,
          location,
        },
      }
    })

    res.json({
      donation: formattedDonation[0] || null,
      receiving: formattedReceiving[0] || null,
    })
  } catch (err) {
    console.error('Error fetching latest posts:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
