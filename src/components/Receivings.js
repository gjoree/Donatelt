import React from 'react'
import Post from './Post'

const Receivings = () => {
  const receivingExample = {
    user: { username: 'Taylor', location: 'Chicago' },
    title: 'Need Baby Stroller',
    description: 'Looking for a stroller in good condition.',
    image_url: null, // No image
    urgency: 'High',
    upvotes: 2,
    comments: [],
    created_at: '1 day ago',
  }

  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <div className='page-content'>
      {user ? (
        <>
          <h1>Receivings Posts</h1>
          <Post post={receivingExample} type='receiving' />
          <Post post={receivingExample} type='receiving' />
          <Post post={receivingExample} type='receiving' />
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
