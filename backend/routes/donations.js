const express = require('express')
const router = express.Router()
const multer = require('multer')
const db = require('../db') // your MySQL connection

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/', upload.single('image'), (req, res) => {
  const {
    user_id,
    title,
    description,
    contact_number,
    item_condition,
    location_specific,
  } = req.body

  const image = req.file ? req.file.buffer : null

  const sql = `
    INSERT INTO Donations 
    (user_id, title, description, image, contact_number, item_condition, location_specific)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `

  db.query(
    sql,
    [
      user_id,
      title,
      description,
      image,
      contact_number,
      item_condition,
      location_specific,
    ],
    (err, result) => {
      if (err) {
        console.error('Insert error:', err)
        return res.status(500).json({ error: 'Database error' })
      }
      res
        .status(201)
        .json({ message: 'Donation created', donation_id: result.insertId })
    },
  )
})

router.get('/', async (req, res) => {
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

    const formatted = rows.map((row) => {
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

    res.json(formatted)
  } catch (err) {
    console.error('Error fetching donations:', err)
    res.status(500).send('Server error')
  }
})

module.exports = router
