const express = require('express')
const router = express.Router()
const multer = require('multer')
const db = require('../db')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/', upload.single('image'), (req, res) => {
  const {
    user_id,
    title,
    description,
    contact_number,
    urgency,
    location_specific,
  } = req.body

  const image = req.file ? req.file.buffer : null

  const sql = `
    INSERT INTO Receivings 
    (user_id, title, description, image, contact_number, urgency, location_specific)
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
      urgency,
      location_specific,
    ],
    (err, result) => {
      if (err) {
        console.error('Insert error:', err)
        return res.status(500).json({ error: 'Database error' })
      }
      res
        .status(201)
        .json({ message: 'Receiving created', donation_id: result.insertId })
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
        FROM Receivings d
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
    console.error('Error fetching receivings:', err)
    res.status(500).send('Server error')
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    await db.query('DELETE FROM Receivings WHERE receiving_id = ?', [id])
    res.status(200).json({ message: 'Receiving deleted' })
  } catch (err) {
    console.error('Delete receiving error:', err)
    res.status(500).json({ error: 'Failed to delete receiving' })
  }
})

module.exports = router
