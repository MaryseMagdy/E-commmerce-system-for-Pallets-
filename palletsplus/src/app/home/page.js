// src/app/home/page.js
'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import NavBar from '../../components/Navbar';
import styles from './page.module.css';

const HomePage = () => {
    const router = useRouter();
    const [username, setUsername] = useState('Guest');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const user = params.get('username');
        if (user) {
            setUsername(user);
        }
    }, [router]);

    return (
        <>
            <div className={styles['home-page-container']}>
                <Head>
                    <title>exported project</title>
                </Head>
                <div className={styles['home-page-home-page']}>
                    <img
                        src="/rectangle19147-p9c-1200w.png"
                        alt="Rectangle19147"
                        className={styles['home-page-rectangle19']}
                    />
                    <NavBar />
                    <img
                        src="/rectangle18132-jga.svg"
                        alt="Rectangle18132"
                        className={styles['home-page-rectangle18']}
                    />
                    <span className={styles['home-page-text08']}>
                        <span>
                            Discover the ultimate destination for all your plastic pallet
                            needs. At PalletsPlus, we specialize in providing high-quality
                            plastic pallets tailored to meet your specific requirements.
                            Whether you&apos;re looking for durable pallets for storage,
                            transportation, or logistics, we have you covered.
                        </span>
                    </span>
                    <img
                        src="/rectangle271242-yqxa-800h.png"
                        alt="Rectangle271242"
                        className={styles['home-page-rectangle27']}
                    />
                    <span className={styles['home-page-text10']}>
                        <span>Welcome {username},</span>
                        <br></br>
                        <span>to PalletsPlus</span>
                    </span>
                </div>
            </div>
        </>
    );
};

export default HomePage;
