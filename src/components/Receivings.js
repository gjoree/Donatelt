import React, { useState, useEffect } from 'react'
import Post from './Post'
import ReceivingForm from './receivingForm'
import axios from 'axios'
import Loader from './Loading'

const Receivings = () => {
  const [showForm, setShowForm] = useState(false)
  const [receivings, setReceivings] = useState([])
  const [loading, setLoading] = useState(true) // Initialize as true
  const user = JSON.parse(localStorage.getItem('user'))

  const fetchReceivings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/receivings')
      setReceivings(response.data)
    } catch (err) {
      console.error('Error fetching Receivings:', err)
      alert('Failed to load receivings.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId, type) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      await axios.delete(`http://localhost:5000/api/${type}s/${postId}`)
      setReceivings((prev) =>
        prev.filter(
          (p) =>
            (type === 'donation' ? p.donation_id : p.receiving_id) !== postId,
        ),
      )
    } catch (err) {
      console.error('Error deleting post:', err)
      alert('Failed to delete post.')
    }
  }

  const handleSubmitNewPost = async (postData) => {
    setShowForm(false)
    try {
      const formData = new FormData()
      formData.append('title', postData.title)
      formData.append('description', postData.description)
      formData.append('image', postData.image) // should be a File object
      formData.append('urgency', postData.urgency)
      formData.append('location_specific', postData.location_specific)
      formData.append('contact_number', postData.contact_number)
      formData.append('user_id', user.token)

      const response = await axios.post(
        'http://localhost:5000/api/receivings',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )

      // Refresh posts after successful submission
      fetchReceivings()

      const newPost = {
        ...response.data,
        user: { username: user.username, location: user.location },
        comments: [],
        upvotes: 0,
      }

      setReceivings([newPost, ...receivings])
    } catch (err) {
      console.error('Error submitting Receiving:', err)
      alert('Failed to submit receiving.')
    }
  }

  useEffect(() => {
    if (user) {
      fetchReceivings()
    }
  }, [user])

  return (
    <div className='page-content'>
      {user ? (
        <>
          <div
            style={{
              justifyContent: 'space-between',
            }}
          >
            <h1>Receiving Posts</h1>
            <button
              onClick={() => setShowForm((prev) => !prev)}
              style={{
                backgroundColor: '#6200ea',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontWeight: '700',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '325px',
                fontSize: '15px',
              }}
            >
              Create Receiving Post
            </button>
          </div>

          {showForm && (
            <ReceivingForm
              onCancel={() => setShowForm(false)}
              onSubmit={handleSubmitNewPost}
            />
          )}

          {loading ? (
            <Loader /> // Show loader while loading
          ) : (
            <div className='posts-container'>
              {receivings.map((post) => (
                <Post
                  key={post.receiving_id}
                  post={post}
                  type='receiving'
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <h1>Receivings</h1>
          <p>Look through the posts of people needing helping out!</p>
        </>
      )}
    </div>
  )
}

export default Receivings
