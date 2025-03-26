import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaUserCircle, FaMapMarkerAlt } from 'react-icons/fa';

const Post = ({ post, type }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.upvotes || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, { user: { username: 'You' }, content: newComment }]);
      setNewComment('');
    }
  };

  return (
    <div className="bg-gray-100 py-6 flex justify-center">
      <div className="max-w-lg w-full p-4 border rounded-2xl shadow-lg bg-white">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <FaUserCircle className="text-gray-500" size={40} />
          <div>
            <h3 className="font-semibold">{post.user.username}</h3>
            <p className="text-gray-500 text-sm">{post.created_at}</p>
          </div>
        </div>

        {/* Body */}
        <div className="mb-3">
          <h3 className="font-bold text-lg">{post.title}</h3>
          <p className="text-gray-700">{post.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
          <span className="bg-gray-200 px-2 py-1 rounded-md flex items-center gap-1">
            <FaMapMarkerAlt /> {post.location_specific || post.user.location}
          </span>
          {type === 'donation' && (
            <span className="bg-gray-200 px-2 py-1 rounded-md">Condition: {post.item_condition}</span>
          )}
          {type === 'receiving' && (
            <span className="bg-gray-200 px-2 py-1 rounded-md">Urgency: {post.urgency}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 border-t pt-2">
          <button className={`flex items-center gap-2 text-[#6200ea] ${isLiked ? 'font-bold' : ''}`} onClick={handleLike}>
            {isLiked ? <FaHeart color="#ff6b6b" /> : <FaRegHeart />}
            <span>{likeCount} Likes</span>
          </button>
          <button className="flex items-center gap-2 text-[#6200ea]">
            <FaComment />
            <span>{comments.length} Comments</span>
          </button>
        </div>

        {/* Comments Section */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-[#6200ea]"
          />
          <button onClick={handleCommentSubmit} className="mt-2 bg-[#6200ea] text-white w-full py-2 rounded-md">
            Add Comment
          </button>

          {/* Display Comments */}
          <div className="mt-3">
            {comments.map((comment, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded-md mb-2 flex items-center gap-2">
                <FaUserCircle className="text-gray-500" size={28} />
                <div>
                  <span className="font-semibold">{comment.user.username}</span>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
