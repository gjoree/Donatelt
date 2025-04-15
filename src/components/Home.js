import React, { useEffect, useState } from 'react'
import Post from './Post'
import axios from 'axios'

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const [latestDonation, setLatestDonation] = useState(null)
  const [latestReceiving, setLatestReceiving] = useState(null)

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts/latest')
        setLatestDonation(res.data.donation)
        setLatestReceiving(res.data.receiving)
      } catch (err) {
        console.error('Failed to fetch latest posts', err)
      }
    }
    fetchLatest()
  }, [])

  return (
    <div className='page-content'>
      <h1>Welcome to Donatelt</h1>
      {user ? (
        <>
          <p>
            Welcome to Donatelt — a platform for helping others in Slovenia!
            <img
              src='https://flagcdn.com/w40/si.png'
              alt='Slovenian flag'
              style={{
                width: '24px',
                verticalAlign: 'middle',
                marginLeft: '6px',
                transform: 'translate(2px, -2px)',
              }}
            />
            <br />
            <br />
            Donatelt is a community-driven platform connecting those who want to
            give with those in need. Browse available donations or explore
            requests from individuals and organizations seeking support.
          </p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <h2>Latest Donation Post</h2>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {latestDonation && (
                  <Post post={latestDonation} type='donation' />
                )}
              </div>
            </div>

            <div style={{ flex: 1, textAlign: 'center' }}>
              <h2>Latest Receiving Post</h2>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {latestReceiving && (
                  <Post post={latestReceiving} type='receiving' />
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Please Login or Sign Up to continue!</p>
      )}
    </div>
  )
}

export default Home
