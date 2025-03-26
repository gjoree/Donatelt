import React from 'react'
import Post from './Post'

const Donations = () => {
  const donationExample = {
    user: { username: 'Alex', location: 'New York' },
    title: 'Winter Coat',
    description: 'Gently used winter coat, size M. Pickup only.',
    image_url: '/coat.jpg',
    location_specific: 'Downtown',
    item_condition: 'Used',
    upvotes: 5,
    comments: [
      { user: { username: 'Jamie' }, content: 'Is this still available?' },
    ],
    created_at: '2 hours ago',
  }

  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <div className='page-content'>
      {user ? (
        <>
          <h1>Donations Posts</h1>
          <Post post={donationExample} type='donation' />
          <Post post={donationExample} type='donation' />
          <Post post={donationExample} type='donation' />
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
