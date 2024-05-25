'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const VerifyUser = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyUser = async () => {
            if (token) {
                try {
                    const response = await fetch(`http://localhost:8000/user/verifyUser/${token}`);
                    const data = await response.json();
                    setMessage(data.message);
                    if (data.success) {
                        setTimeout(() => {
                            router.push('/');
                        }, 2000);
                    }
                } catch (error) {
                    setMessage('Verification failed. Please try again.');
                    console.error('Error during verification:', error);
                }
            }
        };

        verifyUser();
    }, [token, router]);

    return (
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <h1>Email Verification</h1>
            <p>{message}</p>
        </div>
    );
};

export default VerifyUser;
