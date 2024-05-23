'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import './page.module.css';


const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchUser = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8001/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const data = await response.json();
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      fetchUser(userId);
    } else {
      console.error('No userId found in session storage');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data found</div>;
  }

  return (
    <>
      <div className="profile-container">
        <Head>
          <title>Profile</title>
        </Head>
        <div className="profile-profile">
          <img
            src="/rectangle196107-63aj-1200w.png"
            alt="Rectangle196107"
            className="profile-rectangle19"
          />
          <span className="profile-text">
            <span>Good Afternoon {user.firstName}!</span>
          </span>
          <div className="profile-info">
            {[
              { label: 'First Name', value: user.firstName },
              { label: 'Last Name', value: user.lastName },
              { label: 'Email', value: user.email },
              { label: 'Username', value: user.username },
              { label: 'Phone Number', value: user.phoneNum },
              { label: 'Company', value: user.company }
            ].map((field, index) => (
              <div key={index} className="profile-field">
                <label className="profile-label">
                  {field.label}:
                </label>
                <span className="profile-value">{field.value}</span>
              </div>
            ))}
          </div>
          {message && <p className="profile-message">{message}</p>}
          <span className="profile-text14">
            <span>Logout</span>
          </span>
          <div className="profile-nav-bar">
            <img
              src="/line64123-wr9m.svg"
              alt="Line64123"
              className="profile-line6"
            />
            <span className="profile-text16">
              <span>Profile</span>
            </span>
            <span className="profile-text18">
              <span>Products</span>
            </span>
            <img
              src="/line74123-h7lkh.svg"
              alt="Line74123"
              className="profile-line7"
            />
            <span className="profile-text20">
              <span>Your Cart</span>
            </span>
            <img
              src="/mdicart4124-5d1h.svg"
              alt="mdicart4124"
              className="profile-mdicart"
            />
            <span className="profile-text22">
              <span>PalletsPlus</span>
            </span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .profile-container {
          width: 100%;
          display: flex;
          overflow: auto;
          min-height: 100vh;
          align-items: center;
          flex-direction: column;
          background-color: black;
        }
        .profile-profile {
          width: 100%;
          height: 832px;
          display: flex;
          overflow: hidden;
          position: relative;
          align-items: flex-start;
          flex-shrink: 0;
          background-size: cover;
          background-image: url('/tq_vc0gs8d-jk-25js-1500w.png');
        }
        .profile-rectangle19 {
          top: 36px;
          left: 55px;
          width: 1170px;
          height: 797px;
          position: absolute;
          border-radius: 50px 50px 0 0;
        }
        .profile-text {
          top: 186px;
          left: 408px;
          color: rgba(118, 118, 118, 1);
          width: 487px;
          height: auto;
          position: absolute;
          font-size: 42px;
          font-style: Regular;
          text-align: center;
          font-family: Poppins;
          font-weight: 400;
          line-height: 36px;
          font-stretch: normal;
          text-decoration: none;
        }
        .profile-info {
          top: 250px;
          left: 300px;
          position: absolute;
          display: flex;
          flex-direction: column;
        }
        .profile-field {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .profile-label {
          margin-right: 10px;
          color: rgba(63, 63, 63, 0.6000000238418579);
          font-size: 22px;
          font-family: Poppins;
          font-weight: 400;
        }
        .profile-value {
          color: rgba(0, 0, 0, 0.8);
          font-size: 22px;
          font-family: Poppins;
          font-weight: 400;
        }
        .profile-text14 {
          top: 708px;
          left: 595px;
          color: rgba(255, 0, 0, 0.4699999988079071);
          width: 143px;
          height: auto;
          position: absolute;
          font-size: 32px;
          font-style: SemiBold;
          text-align: left;
          font-family: Poppins;
          font-weight: 600;
          line-height: 36px;
          font-stretch: normal;
          text-decoration: none;
        }
        .profile-nav-bar {
          top: 36px;
          left: 55px;
          width: 1170px;
          height: 81.0992431640625px;
          display: flex;
          position: absolute;
          background: linear-gradient(
            180deg,
            rgba(0, 115, 251, 1) 19%,
            rgba(255, 255, 255, 1) 74%
          );
          align-items: flex-start;
          flex-shrink: 1;
        }
        .profile-line6 {
          top: 30px;
          left: 981.9775390625px;
          width: 18px;
          height: 1px;
          position: absolute;
        }
        .profile-text16 {
          top: 25px;
          left: 917px;
          color: rgba(0, 0, 0, 0.46000000834465027);
          width: 64px;
          height: auto;
          position: absolute;
          font-size: 18px;
          font-style: Bold;
          text-align: left;
          font-family: Poppins;
          font-weight: 700;
          line-height: normal;
          font-stretch: normal;
          text-decoration: none;
        }
        .profile-text18 {
          top: 25px;
          left: 816px;
          color: rgba(0, 0, 0, 0.46000000834465027);
          width: 80px;
          height: auto;
          position: absolute;
          font-size: 18px;
          font-style: Regular;
          text-align: left;
          font-family: Poppins;
          font-weight: 400;
          line-height: normal;
          font-stretch: normal;
          text-decoration: none.
        }
        .profile-line7 {
          top: 30px;
          left: 904.5205078125px;
          width: 18px;
          height: 1px;
          position: absolute.
        }
        .profile-text16 {
          top: 25px;
          left: 917px;
          color: rgba(0, 0, 0, 0.46000000834465027);
          width: 64px;
          height: auto;
          position: absolute;
          font-size: 18px;
          font-style: Bold;
          text-align: left;
          font-family: Poppins;
          font-weight: 700;
          line-height: normal;
          font-stretch: normal;
          text-decoration: none;
        }
        .profile-text18 {
          top: 25px;
          left: 816px;
          color: rgba(0, 0, 0, 0.46000000834465027);
          width: 80px;
          height: auto;
          position: absolute;
          font-size: 18px;
          font-style: Regular;
          text-align: left;
          font-family: Poppins;
          font-weight: 400;
          line-height: normal;
          font-stretch: normal;
          text-decoration: none.
        }
        .profile-line7 {
          top: 30px;
          left: 904.5205078125px;
          width: 18px;
          height: 1px;
          position: absolute.
        }
        .profile-text20 {
          top: 25px;
          left: 1020.212158203125px;
          color: rgba(0, 0, 0, 0.46000000834465027);
          width: 92px;
          height: auto;
          position: absolute;
          font-size: 18px;
          font-style: Regular;
          text-align: left;
          font-family: Poppins;
          font-weight: 400;
          line-height: normal;
          font-stretch: normal;
          text-decoration: none;
        }
        .profile-mdicart {
          top: 28px;
          left: 993.0439453125px;
          width: 21px;
          height: 20px;
          position: absolute;
        }
        .profile-text22 {
          top: 22px;
          color: rgba(16, 44, 191, 1);
          width: 286px;
          height: auto;
          position: absolute;
          font-size: 38px;
          font-style: SemiBold;
          text-align: center;
          font-family: Poppins;
          font-weight: 600;
          line-height: 17px;
          font-stretch: normal;
          text-decoration: none;
        }
      `}</style>
    </>
  );
};

export default Profile;