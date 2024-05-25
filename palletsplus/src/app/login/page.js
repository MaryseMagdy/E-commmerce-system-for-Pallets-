'use client';
import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './page.module.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [resetPIN, setResetPIN] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8001/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('Server response:', data); // Log the entire server response

      setMessage(data.message);
      if (data.success) {
        if (data.user && data.user.id) {
          sessionStorage.setItem('userId', data.user.id);
          console.log(data.user.id, "User ID set in session storage");
          localStorage.setItem('token', data.access_token);
          router.push(`/home`);
        } else {
          console.error('No userId found in server response');
          setMessage('Login successful, but no user ID found.');
        }
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      setMessage('Error during login. Please try again.');
      console.error('Error during login:', error);
    }
  };

  const handleResetPasswordRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8001/user/forget-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setResetMessage(data.message);
    } catch (error) {
      setResetMessage('Error sending reset password email. Please try again.');
      console.error('Error during reset password:', error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8001/user/forget-password/${resetPIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await response.json();
      setResetMessage(data.message);
      if (data.success) {
        toast.success('Password reset successfully');
        setIsModalOpen(false);
        setResetPIN('');
        setNewPassword('');
      }
    } catch (error) {
      setResetMessage('Error resetting password. Please try again.');
      console.error('Error during reset password:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsResettingPassword(false);
    setEmail('');
    setResetPIN('');
    setNewPassword('');
    setResetMessage('');
  };

  const startResetPassword = () => {
    setIsResettingPassword(true);
  };

  return (
    <>
      <div className={styles['login-page-container']}>
        <Head>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
            rel="stylesheet" integrity="sha384QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
            crossorigin="anonymous" />
        </Head>
        <span className={styles['login-page-text']}>
          <span>PalletsPlus</span>
        </span>
        <div className={styles['login-page-login-page']}>
          <span className={styles['login-page-text02']}>
            <span>Login to existing account</span>
          </span>
          <form onSubmit={handleLogin} className={styles['login-form']}>
            <label className={styles['login-page-text04']} htmlFor="username">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles['login-page-input']}
              required
            />
            <label className={styles['login-page-text06']} htmlFor="password">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles['login-page-input']}
              required
            />
            <button type="submit" className={styles['login-page-button']}>
              Login
            </button>
            {message && <p className={styles['login-error']}>{message}</p>}
          </form>
          <span className={styles['login-page-text12']}>
            <span className={styles['login-page-text13']}>
              Don’t have an account?
            </span>
            <a href="/register"> Register</a>
          </span>
          <span className={styles['login-page-text12']}>
            <a href="#" onClick={openModal}>Forgot your password?</a>
          </span>
        </div>

        {isModalOpen && (
          <div className={styles['modal']}>
            <div className={styles['modal-content']}>
              <span className={styles['close']} onClick={closeModal}>&times;</span>
              {!isResettingPassword ? (
                <form onSubmit={handleResetPasswordRequest} className={styles['reset-form']}>
                  <label className={styles['login-page-text04']} htmlFor="email">
                    Enter your email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles['login-page-input']}
                    required
                  />
                  <button type="submit" className={styles['login-page-button']}>
                    Send Reset PIN
                  </button>
                  {resetMessage && <p className={styles['login-error']}>{resetMessage}</p>}
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className={styles['reset-form']}>
                  <label className={styles['login-page-text04']} htmlFor="pin">
                    Enter reset PIN:
                  </label>
                  <input
                    type="text"
                    id="pin"
                    value={resetPIN}
                    onChange={(e) => setResetPIN(e.target.value)}
                    className={styles['login-page-input']}
                    required
                  />
                  <label className={styles['login-page-text04']} htmlFor="newPassword">
                    Enter new password:
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles['login-page-input']}
                    required
                  />
                  <button type="submit" className={styles['login-page-button']}>
                    Reset Password
                  </button>
                  {resetMessage && <p className={styles['login-error']}>{resetMessage}</p>}
                </form>
              )}
              <button onClick={startResetPassword} className={styles['login-page-button']} style={{ marginTop: '10px' }}>
                Already have a PIN?
              </button>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default LoginPage;
