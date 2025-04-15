import React, { useState, useEffect } from 'react'
import Post from './Post'
import DonationForm from './donationForm'
import axios from 'axios'
import Loader from './Loading'

const Donations = () => {
  const [showForm, setShowForm] = useState(false)
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user'))

  const fetchDonations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/donations')
      setDonations(response.data)
    } catch (err) {
      console.error('Error fetching donations:', err)
      alert('Failed to load donations.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId, type) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      await axios.delete(`http://localhost:5000/api/${type}s/${postId}`)
      setDonations((prev) =>
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
      formData.append('image', postData.image)
      formData.append('item_condition', postData.item_condition)
      formData.append('location_specific', postData.location_specific)
      formData.append('contact_number', postData.contact_number)
      formData.append('user_id', user.token)

      const response = await axios.post(
        'http://localhost:5000/api/donations',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )

      // Refresh posts after successful submission
      fetchDonations()

      const newPost = {
        ...response.data,
        user: { username: user.username, location: user.location },
        comments: [],
        upvotes: 0,
      }

      setDonations([newPost, ...donations])
    } catch (err) {
      console.error('Error submitting donation:', err)
      alert('Failed to submit donation.')
    }
  }

  useEffect(() => {
    if (user) {
      fetchDonations()
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
            <h1>Donations Posts</h1>
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
              Create Donation Post
            </button>
          </div>

          {showForm && (
            <DonationForm
              onCancel={() => setShowForm(false)}
              onSubmit={handleSubmitNewPost}
            />
          )}

          {/* Posts or loading */}
          {loading ? (
            <Loader />
          ) : (
            <div className='posts-container'>
              {donations.map((post) => (
                <Post
                  key={post.donation_id}
                  post={post}
                  type='donation'
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <h1>Donations Place</h1>
          <p>Please Sign up or Login to create or browse donation offerings.</p>
        </>
      )}
    </div>
  )
}

export default Donations
