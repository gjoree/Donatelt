import React, { useState } from 'react'
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaUserCircle,
  FaMapMarkerAlt,
} from 'react-icons/fa'

const Post = ({ post, type }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.upvotes || 0)
  const [comments, setComments] = useState(post.comments || [])
  const [newComment, setNewComment] = useState('')

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      setComments([
        ...comments,
        { user: { username: 'You' }, content: newComment },
      ])
      setNewComment('')
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
            <p className='timestamp'>{post.created_at}</p>
          </div>
        </div>

        {/* Body */}
        <div className='post-body'>
          <h3 className='post-title'>{post.title}</h3>
          <p className='post-description'>{post.description}</p>
        </div>

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
            className={`action-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            {isLiked ? (
              <FaHeart className='heart-icon liked' />
            ) : (
              <FaRegHeart className='heart-icon' />
            )}
            <span>{likeCount} Likes</span>
          </button>
          <button className='action-button'>
            <FaComment className='comment-icon' />
            <span>{comments.length} Comments</span>
          </button>
        </div>

        {/* Comments Section */}
        <div className='comments-section'>
          <input
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
                <div className='comment-content'>
                  <span className='comment-user'>{comment.user.username}</span>
                  <p>{comment.content}</p>
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
