'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import styles from './page.module.css';

const EditFieldModal = ({ showModal, field, value, handleClose, handleSave }) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  if (!showModal) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={handleClose}>&times;</span>
        <h2>Edit {field}</h2>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={() => handleSave(field, inputValue)}>Save</button>
      </div>
    </div>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const router = useRouter();

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

  const handleEditClick = (userFriendlyField, value) => {
    const fieldMap = {
      "First Name": "firstName",
      "Last Name": "lastName",
      "Email": "email",
      "Username": "username",
      "Phone Number": "phoneNum",
      "Company": "company"
    };

    const fieldName = fieldMap[userFriendlyField];

    if (!fieldName) {
      console.error("Invalid field name provided:", userFriendlyField);
      return;
    }

    setCurrentField(fieldName);
    setCurrentValue(value);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`http://localhost:8001/user/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        sessionStorage.removeItem('userId');
        router.push('/home'); // Redirect to home page after logout
      } else {
        setMessage('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      setMessage('Error logging out');
    }
  };

  const handleSave = async (field, value) => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      setMessage('No user ID found in session storage');
      return;
    }

    const userInfoDTO = { [field]: value };

    try {
      const response = await fetch(`http://localhost:8001/user/editUserInfo/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfoDTO),
      });

      const result = await response.json();
      if (result.success) {
        setUser(prevUser => ({
          ...prevUser,
          [field]: value,
        }));
        setMessage('User info updated successfully');
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      setMessage('Error updating user info');
    }

    setShowModal(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data found</div>;
  }

  return (
    <>
      <div className={styles.containerBase}>
        <div className={styles.container}>
          <div className={styles.navBar}>
            <a href="/home" className={styles.navBrand}>PalletsPlus</a>
            <div className={styles.navLinks}>
              <a href="/products" className={styles.navText}>Products</a>
              <a href={`/profile/${sessionStorage.getItem('userId')}`} className={styles.navText}>Profile</a>
              <a href="/cart" className={styles.navText}>Your Cart</a>
            </div>
          </div>
          <div className={styles.profileContainer}>
            <Head>
              <title>Profile</title>
            </Head>
            <div className={styles.profileProfile}>
              <span className={styles.profileText}>
                <span>Good Afternoon {user.firstName}!</span>
              </span>
              <div className={styles.profileInfo}>
                {[
                  { label: 'First Name', value: user.firstName },
                  { label: 'Last Name', value: user.lastName },
                  { label: 'Email', value: user.email },
                  { label: 'Username', value: user.username },
                  { label: 'Phone Number', value: user.phoneNum },
                  { label: 'Company', value: user.company }
                ].map((field, index) => (
                  <div key={index} className={styles.profileField}>
                    <label className={styles.profileLabel}>{field.label}:</label>
                    <span className={styles.profileValue}>{field.value}</span>
                    <button className={styles.buttonChange} onClick={() => handleEditClick(field.label, field.value)}>Change</button>
                  </div>
                ))}
              </div>
              {message && <p className={styles.profileMessage}>{message}</p>}
              <div className={styles.profileButtons}>
                <button className={styles.buttonAction} onClick={() => router.push('/favourites')}>Favourites</button>
                <button className={styles.buttonAction} onClick={() => router.push('/order-history')}>Order History</button>
                <button className={styles.buttonAction} onClick={() => router.push('/manage-payment')}>Manage Payment</button>
                <button className={styles.buttonAction} onClick={() => router.push('/saved-addresses')}>Saved Addresses</button>
                <button className={styles.buttonAction} onClick={() => router.push('/reviews')}>Reviews</button>
                <button className={styles.buttonAction} onClick={() => router.push('/wishlist')}>Wishlist</button>
              </div>
              <button className={styles.buttonLogout} onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
      <EditFieldModal
        showModal={showModal}
        field={currentField}
        value={currentValue}
        handleClose={handleCloseModal}
        handleSave={handleSave}
      />
    </>
  );
};

export default Profile;
