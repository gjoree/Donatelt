const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/auth')
const donationsRouter = require('./routes/donations')
const receivingRouter = require('./routes/receivings')
const commentsRouter = require('./routes/comments')
const upvoteRouter = require('./routes/upvotes')
const latestPostRouter = require('./routes/posts')
const userRouter = require('./routes/users')

const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/donations', donationsRouter)
app.use('/api/receivings', receivingRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/upvotes', upvoteRouter)
app.use('/api/posts', latestPostRouter)
app.use('/api/users', userRouter)

// Start server
const PORT = 5050
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
