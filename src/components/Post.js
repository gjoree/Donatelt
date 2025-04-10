import React, { useState, useEffect } from 'react'
import axios from 'axios'

import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaUserCircle,
  FaMapMarkerAlt,
} from 'react-icons/fa'

const Post = ({ post, type }) => {
  const [comments, setComments] = useState(post.comments || [])
  const [newComment, setNewComment] = useState('')
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [upvoteCount, setUpvoteCount] = useState(0)
  const user = JSON.parse(localStorage.getItem('user'))

  // Fetch initial upvote state and count
  useEffect(() => {
    const fetchUpvoteData = async () => {
      try {
        const postId =
          type === 'donation' ? post.donation_id : post.receiving_id

        // Get upvotes count
        const countRes = await axios.get(
          `http://localhost:5000/api/upvotes/count/${postId}/${type}`,
        )
        setUpvoteCount(countRes.data.count)

        // Check if user upvoted
        if (user) {
          const checkRes = await axios.get(
            `http://localhost:5000/api/upvotes/check/${user.token}/${postId}/${type}`,
          )
          setIsUpvoted(checkRes.data.upvoted)
        }
      } catch (err) {
        console.error('Error fetching upvotes:', err)
      }
    }

    if (post?.donation_id || post?.receiving_id) {
      fetchUpvoteData()
    }
  }, [post, type, user])

  const handleUpvote = async () => {
    if (!user) {
      alert('Please login to upvote posts')
      return
    }

    try {
      const postId = type === 'donation' ? post.donation_id : post.receiving_id

      // Optimistic update first
      const wasUpvoted = isUpvoted
      setIsUpvoted(!wasUpvoted)
      setUpvoteCount((prev) => (wasUpvoted ? prev - 1 : prev + 1))

      const response = await axios.post(
        'http://localhost:5000/api/upvotes/toggle',
        {
          userId: user.token,
          postId: postId,
          postType: type,
        },
      )

      // Sync with actual response
      if (response.data.upvoted !== !wasUpvoted) {
        setIsUpvoted(response.data.upvoted)
        setUpvoteCount((prev) => (response.data.upvoted ? prev + 1 : prev - 1))
      }
    } catch (err) {
      // Rollback on error
      setIsUpvoted((prev) => !prev)
      setUpvoteCount((prev) => prev + (isUpvoted ? 1 : -1))

      console.error('Error toggling upvote:', err)
      alert('Failed to toggle upvote. Please try again.')
    }
  }

  // Fetch comments when post loads
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/comments/${post.donation_id || post.receiving_id}/${type}`,
        )
        setComments(response.data)
      } catch (err) {
        console.error('Error fetching comments:', err)
      }
    }

    fetchComments()
  }, [post, type])

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    const user = JSON.parse(localStorage.getItem('user'))

    if (!newComment.trim() || !user) {
      alert('Please login to comment')
      return
    }

    try {
      const response = await axios.post('http://localhost:5000/api/comments', {
        content: newComment,
        postId: post.donation_id || post.receiving_id,
        postType: type,
        userId: user.token, // Send user ID from localStorage
      })

      setComments([response.data, ...comments])
      setNewComment('')
    } catch (err) {
      console.error('Error submitting comment:', err)
      alert('Failed to submit comment')
    }
  }

  return (
    <div className='post-background'>
      <div className='post-container'>
        {/* Header */}
        <div className='post-header'>
          <FaUserCircle className='user-avatar' size={40} />
          <div className='user-info'>
            <h3 className='username'>{post.user.username}</h3>
            {/* <p className='timestamp'>{post.created_at}</p> */}
          </div>
        </div>

        {/* Body */}
        <div className='post-body'>
          <h3 className='post-title'>{post.title}</h3>
          <p className='post-description'>{post.description}</p>
        </div>

        {/* Image Display */}
        {post.image && (
          <div className='post-image-container'>
            <img
              src={post.image}
              alt={post.title}
              className='post-image'
              onError={(e) => {
                e.target.style.display = 'none' // Hide if image fails to load
              }}
            />
          </div>
        )}

        {/* Tags */}
        <div className='post-tags'>
          <span className='tag'>
            <FaMapMarkerAlt /> {post.location_specific || post.user.location}
          </span>
          {type === 'donation' && (
            <span className='tag'>Condition: {post.item_condition}</span>
          )}
          {type === 'receiving' && (
            <span className='tag'>Urgency: {post.urgency}</span>
          )}
        </div>

        {/* Actions */}
        <div className='post-actions'>
          <button
            className={`action-button ${isUpvoted ? 'liked' : ''}`}
            onClick={handleUpvote}
          >
            {isUpvoted ? (
              <FaHeart className='heart-icon liked' />
            ) : (
              <FaRegHeart className='heart-icon' />
            )}
            <span>{upvoteCount} Likes</span>
          </button>
          <button className='action-button'>
            <FaComment className='comment-icon' />
            <span>{comments.length} Comments</span>
          </button>
        </div>

        {/* Comments Section */}
        <div className='comments-section'>
          <input
            style={{ width: '93.7%' }}
            type='text'
            placeholder='Write a comment...'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className='comment-input'
          />
          <button onClick={handleCommentSubmit} className='comment-button'>
            Add Comment
          </button>

          {/* Display Comments */}
          <div className='comments-list'>
            {comments.map((comment, index) => (
              <div key={index} className='comment-item'>
                <FaUserCircle className='comment-avatar' size={28} />
                <div className='comment-text'>
                  {' '}
                  {/* CHANGE CLASS TO "comment-text" */}
                  <span className='comment-user'>{comment.username}</span>
                  <p className='comment-message'>{comment.content}</p>{' '}
                  {/* ADDED NEW CLASS */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
