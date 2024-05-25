'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8001/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          username,
          password,
          phoneNum,
        }),
      });
      const data = await response.json();
      setMessage(data.message);
      if (data.success) {
        router.push('/check-email'); // Redirect to Check Email page
      }
    } catch (error) {
      setMessage('Error during registration. Please try again.');
      console.error('Error during registration:', error);
    }
  };
  const handleResendVerification = async () => {
    try {
      const response = await fetch('http://localhost:8001/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          username,
          password,
          phoneNum,
        }),
      });
      const data = await response.json();
      setMessage(data.message);
      if (data.success) {
        router.push('/check-email'); // Redirect to Check Email page
      }
    } catch (error) {
      setMessage('Error resending verification. Please try again.');
      console.error('Error resending verification:', error);
    }
  };

  return (
    <div className={styles['register-page-container']} style={{ marginTop: '-5rem' }}>
      <span className={styles['register-page-text']}>
        <span>PalletsPlus</span>
      </span>
      <div className={styles['register-page-register-page']}>
        <span className={styles['register-page-text02']}>
          <span>Create an account</span>
        </span>
        <form onSubmit={handleRegister} className={styles['register-form']}>
          <label className={styles['register-page-text04']} htmlFor="firstName">
            First Name:
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={styles['register-page-input']}
            required
          />
          <label className={styles['register-page-text06']} htmlFor="lastName">
            Last Name:
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={styles['register-page-input']}
            required
          />
          <label className={styles['register-page-text04']} htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles['register-page-input']}
            required
          />
          <label className={styles['register-page-text06']} htmlFor="username">
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles['register-page-input']}
            required
          />
          <label className={styles['register-page-text08']} htmlFor="password">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles['register-page-input']}
            required
          />
          <label className={styles['register-page-text08']} htmlFor="phoneNum">
            Phone Number:
          </label>
          <input
            type="text"
            id="phoneNum"
            value={phoneNum}
            onChange={(e) => setPhoneNum(e.target.value)}
            className={styles['register-page-input']}
            required
          />
          <div className={styles['register-page-buttons']}>
            <button type="submit" className={styles['register-page-button']}>
              Register
            </button>
            <button
              type="button"
              className={`${styles['register-page-button']} ${styles['resend-verification-button']}`}
              onClick={handleResendVerification}
            >
              Resend Verification
            </button>
          </div>
        </form>
        <span className={styles['register-page-text12']}>
          <span className={styles['register-page-text13']}>
            Already have an account
          </span>
          <span className={styles['register-page-text14']}>
            <span dangerouslySetInnerHTML={{ __html: ' ' }} />
          </span>
          <a href="/login">Login</a>
        </span>
      </div >
    </div >
  );
};

export default RegisterPage;