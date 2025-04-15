const express = require('express')
const db = require('../db') // your MySQL connection
const router = express.Router()

// Add comment
router.post('/', async (req, res) => {
  const { content, postId, postType, userId } = req.body

  try {
    // Simple validation
    if (!content || !postId || !postType || !userId) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Insert comment
    const [result] = await db.query(
      `INSERT INTO Comments (content, user_id, ${postType}_id)
       VALUES (?, ?, ?)`,
      [content, userId, postId],
    )

    // Get full comment data
    const [comment] = await db.query(
      `
      SELECT c.*, u.username 
      FROM Comments c
      JOIN Users u ON c.user_id = u.user_id
      WHERE c.comment_id = ?
    `,
      [result.insertId],
    )

    res.status(201).json(comment[0])
  } catch (err) {
    console.error('Error adding comment:', err)
    res.status(500).json({ error: 'Failed to add comment' })
  }
})

// Get comments for a post
router.get('/:postId/:postType', async (req, res) => {
  try {
    const [comments] = await db.query(
      `
      SELECT c.*, u.username
      FROM Comments c
      JOIN Users u ON c.user_id = u.user_id
      WHERE ${req.params.postType}_id = ?
      ORDER BY c.created_at DESC
    `,
      [req.params.postId],
    )

    res.json(comments)
  } catch (err) {
    console.error('Error fetching comments:', err)
    res.status(500).json({ error: 'Failed to fetch comments' })
  }
})

//Delete a comment
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    await db.query('DELETE FROM Comments WHERE comment_id = ?', [id])
    res.status(200).json({ message: 'Comment deleted' })
  } catch (err) {
    console.error('Delete comment error:', err)
    res.status(500).json({ error: 'Failed to delete comment' })
  }
})

module.exports = router
