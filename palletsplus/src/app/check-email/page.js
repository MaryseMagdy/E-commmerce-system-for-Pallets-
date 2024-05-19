'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css'; // Import CSS module for styling

const CheckEmail = () => {
    const router = useRouter();

    return (
        <div className={styles.checkEmailContainer}>
            <div className={styles.content}>
                <h1 className={styles.title}>Registration Successful!</h1>
                <p className={styles.message}>Please check your email for a verification link to activate your account.</p>
                <button className={styles.button} onClick={() => router.push('/login')}>Go to Login</button>
            </div>
        </div>
    );
};

export default CheckEmail;
