const express = require('express')
const db = require('../db')
const router = express.Router()

// Toggle upvote
router.post('/toggle', async (req, res) => {
  const { userId, postId, postType } = req.body

  try {
    if (!userId || !postId || !postType) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const column = postType === 'donation' ? 'donation_id' : 'receiving_id'

    const [existing] = await db.query(
      `SELECT * FROM Upvotes 
         WHERE user_id = ? 
         AND (donation_id = ? OR receiving_id = ?)`,
      [userId, postId, postId],
    )

    if (existing.length > 0) {
      await db.query(
        `DELETE FROM Upvotes 
           WHERE upvote_id = ?`,
        [existing[0].upvote_id],
      )
      return res.json({ upvoted: false })
    } else {
      await db.query(
        `INSERT INTO Upvotes (user_id, ${column})
           VALUES (?, ?)`,
        [userId, postId],
      )
      return res.json({ upvoted: true })
    }
  } catch (err) {
    console.error('Error toggling upvote:', err)
    res.status(500).json({ error: 'Failed to toggle upvote' })
  }
})

// Get upvotes count for a post
router.get('/count/:postId/:postType', async (req, res) => {
  try {
    const column =
      req.params.postType === 'donation' ? 'donation_id' : 'receiving_id'

    const [result] = await db.query(
      `SELECT COUNT(*) AS count FROM Upvotes 
       WHERE ${column} = ?`,
      [req.params.postId],
    )

    res.json({ count: result[0].count })
  } catch (err) {
    console.error('Error getting upvotes count:', err)
    res.status(500).json({ error: 'Failed to get upvotes count' })
  }
})

// Check if user upvoted a post
router.get('/check/:userId/:postId/:postType', async (req, res) => {
  try {
    const column =
      req.params.postType === 'donation' ? 'donation_id' : 'receiving_id'

    const [result] = await db.query(
      `SELECT * FROM Upvotes 
       WHERE user_id = ? AND ${column} = ?`,
      [req.params.userId, req.params.postId],
    )

    res.json({ upvoted: result.length > 0 })
  } catch (err) {
    console.error('Error checking upvote:', err)
    res.status(500).json({ erSror: 'Failed to check upvote' })
  }
})

module.exports = router
