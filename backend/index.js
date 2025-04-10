const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/auth')
const donationsRouter = require('./routes/donations')
const commentsRouter = require('./routes/comments')
const upvoteRouter = require('./routes/upvotes')

const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/donations', donationsRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/upvotes', upvoteRouter)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
