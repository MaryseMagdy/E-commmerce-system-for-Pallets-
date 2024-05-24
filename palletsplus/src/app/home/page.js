'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './page.module.css'

const HomePage = () => {
    const [username, setUsername] = useState('')
    const router = useRouter()

    const fetchUsername = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8001/user/${userId}`)
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            setUsername(data.username)
        } catch (error) {
            console.error('There was an error fetching the username!', error)
        }
    }

    useEffect(() => {
        const userId = sessionStorage.getItem('userId')
        if (userId) {
            fetchUsername(userId)
        } else {
            console.error('No user ID found in session storage!')
            router.push('/login') // Redirect to login page if no user ID is found
        }
    }, [router])

    return (
        <>
            <div className={styles['home-page-container']}>
                <Head>
                    <title>exported project</title>
                </Head>
                <div className={styles['home-page-home-page']}>
                    <Image
                        src="/rectangle19147-p9c-1200w.png"
                        alt="Rectangle19147"
                        width={1200}
                        height={800}
                        className={styles['home-page-rectangle19']}
                    />
                    <div className={styles['nav-bar']}>
                        <Image
                            src="/rectangle11150-86rg-200h.png"
                            alt="Rectangle11150"
                            width={200}
                            height={100}
                            className={styles['rectangle1']}
                        />
                        <Image
                            src="/line6372-ujr.svg"
                            alt="Line6372"
                            width={200}
                            height={10}
                            className={styles['line6']}
                        />
                        <button className={styles['text']} onClick={() => router.push('/profile')}>
                            Profile
                        </button>
                        <button className={styles['text02']} onClick={() => router.push('/products')}>
                            Products
                        </button>
                        <Image
                            src="/line73713-7v1i.svg"
                            alt="Line73713"
                            width={200}
                            height={10}
                            className={styles['line7']}
                        />
                        <button className={styles['text04']} onClick={() => router.push('/cart')}>
                            Your Cart
                        </button>
                        <Image
                            src="/mdicart377-2y6m.svg"
                            alt="mdicart377"
                            width={50}
                            height={50}
                            className={styles['mdicart']}
                        />
                        <button className={styles['text05']} onClick={() => router.push('/wishlist')}>
                            Wishlist
                        </button>
                        <span className={styles['text06']} onClick={() => router.push('/homehezar')}>
                            <span>PalletsPlus</span>
                        </span>
                    </div>
                    <Image
                        src="/rectangle18132-jga.svg"
                        alt="Rectangle18132"
                        width={800}
                        height={400}
                        className={styles['home-page-rectangle18']}
                    />
                    <span className={styles['home-page-text08']}>
                        <span>
                            Discover the ultimate destination for all your plastic pallet
                            needs. At PalletsPlus, we specialize in providing high-quality
                            plastic pallets tailored to meet your specific requirements.
                            Whether you're looking for durable pallets for storage,
                            transportation, or logistics, we have you covered.
                        </span>
                    </span>
                    <Image
                        src="/rectangle271242-yqxa-800h.png"
                        alt="Rectangle271242"
                        width={800}
                        height={400}
                        className={styles['home-page-rectangle27']}
                    />
                    <span className={styles['home-page-text10']}>
                        <span>Welcome {username},</span>
                        <br />
                        <span>to PalletsPlus</span>
                    </span>
                </div>
            </div>
        </>
    )
}

export default HomePage
