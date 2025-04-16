import React, { useState, useEffect } from 'react'
import axios from 'axios'

import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaUserCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaExclamationTriangle,
  FaInfo,
} from 'react-icons/fa'

const Post = ({ post, type, onDelete }) => {
  const [comments, setComments] = useState(post.comments || [])
  const [newComment, setNewComment] = useState('')
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [upvoteCount, setUpvoteCount] = useState(0)
  const user = JSON.parse(localStorage.getItem('user'))
  const [showOverlay, setShowOverlay] = useState(false)
  const [userInfo, setUserInfo] = useState(null)

  const handleUserHover = async () => {
    try {
      if (!post.user_id) return
      const res = await axios.get(
        `http://localhost:5000/api/users/${post.user_id}`,
      )
      setUserInfo(res.data)
      setShowOverlay(true)
    } catch (err) {
      console.error('Failed to load user info:', err)
    }
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diff = Math.floor((now - date) / 1000)

    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return

    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`)
      setComments((prev) => prev.filter((c) => c.comment_id !== commentId))
    } catch (err) {
      console.error('Failed to delete comment:', err)
      alert('Could not delete comment')
    }
  }

  // Fetch initial upvote state and count
  useEffect(() => {
    const fetchUpvoteData = async () => {
      try {
        const postId =
          type === 'donation' ? post.donation_id : post.receiving_id

        const countRes = await axios.get(
          `http://localhost:5000/api/upvotes/count/${postId}/${type}`,
        )
        setUpvoteCount(countRes.data.count)

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

      if (response.data.upvoted !== !wasUpvoted) {
        setIsUpvoted(response.data.upvoted)
        setUpvoteCount((prev) => (response.data.upvoted ? prev + 1 : prev - 1))
      }
    } catch (err) {
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
        userId: user.token,
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
        <div
          className='post-header'
          style={{ justifyContent: 'space-between', width: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{ position: 'relative', display: 'inline-block' }}
              onMouseEnter={handleUserHover}
              onMouseLeave={() => setShowOverlay(false)}
            >
              <FaUserCircle className='user-avatar' size={40} />

              {showOverlay && userInfo && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    zIndex: 10,
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    width: '220px',
                    fontSize: '14px',
                  }}
                >
                  <strong>{userInfo.username}</strong>
                  <p style={{ margin: '4px 0' }}>📍 {userInfo.location}</p>
                  <p style={{ margin: '4px 0' }}>📧 {userInfo.email}</p>
                  <p style={{ margin: '4px 0' }}>📱 {userInfo.mobile_number}</p>
                  <p
                    style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}
                  >
                    Member since{' '}
                    {new Date(userInfo.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            <div className='user-info'>
              <h3 className='username'>{post.user.username}</h3>
              <p className='timestamp'>{formatTimeAgo(post.created_at)}</p>
            </div>
          </div>
          {user && user.token === post.user_id && (
            <button
              onClick={() =>
                onDelete(post.donation_id || post.receiving_id, type)
              }
              style={{
                background: 'transparent',
                border: 'none',
                color: '#6200ea',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Delete Post 🗑️
            </button>
          )}
        </div>
        <div className='post-body'>
          <h3 className='post-title'>{post.title}</h3>
          <p className='post-description'>{post.description}</p>
        </div>
        {post.image && (
          <div className='post-image-container'>
            <img
              src={post.image}
              alt={post.title}
              className='post-image'
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
        )}
        <div className='post-tags'>
          <span className='tag'>
            <FaMapMarkerAlt /> {post.location_specific || post.user.location}
          </span>
          <span className='tag'>
            <FaPhone /> {post.contact_number}
          </span>
          {type === 'donation' && (
            <span className='tag'>
              <FaInfo /> Condition: {post.item_condition}
            </span>
          )}
          {type === 'receiving' && (
            <span className='tag'>
              <FaExclamationTriangle /> Urgency: {post.urgency}
            </span>
          )}
        </div>
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
          <div className='comments-list'>
            {comments.map((comment, index) => (
              <div
                key={index}
                className='comment-item'
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  <FaUserCircle className='comment-avatar' size={28} />
                  <div className='comment-text'>
                    <span className='comment-user'>{comment.username}</span>
                    <p className='comment-message'>{comment.content}</p>
                  </div>
                </div>
                {user && user.token === comment.user_id && (
                  <button
                    onClick={() => handleDeleteComment(comment.comment_id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ff4d4d',
                      fontSize: '14px',
                      cursor: 'pointer',
                      alignSelf: 'start',
                    }}
                    title='Delete comment'
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
