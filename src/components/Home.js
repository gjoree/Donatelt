import React from 'react';

const Home = () => {

 const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="page-content">
      {user ? (
        <>
          <h1>Welcome to Donatelt</h1>
           <p> Donatelt is a community-driven platform connecting those who want to give with those in need.
             Browse available donations or explore requests from individuals and organizations seeking support. 
             Whether you're donating or receiving, our goal is to make giving easy, transparent, and impactful. 
             Join us in building a more generous world! 
           </p>
        </>
            ) : (
              <><h1>Welcome to Donatelt</h1>
              <p>Please Login or Sign Up to continue!</p></>
            )}
    </div>
  );
};

export default Home;