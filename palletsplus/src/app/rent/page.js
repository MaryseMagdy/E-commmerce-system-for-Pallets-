// src/app/rent/page.js
'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Head from 'next/head';
import styles from './page.module.css';

const RentPage = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [product, setProduct] = useState(null);
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');
    const router = useRouter();

    const fetchProduct = async () => {
        try {
            const response = await fetch(`http://localhost:8000/product/${productId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch product');
            }
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const handleCancel = () => {
        router.push(`/product/${productId}`);
    };

    const handleOrder = async () => {
        try {
            const response = await fetch(`http://localhost:8000/product/rent/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rentStartDate: startDate,
                    rentEndDate: endDate,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to place rent order');
            }
            const data = await response.json();
            console.log('Rent order placed:', data);
            // Optionally redirect or update UI after order is placed
            router.push('/products'); // Redirect to products page after placing order
        } catch (error) {
            console.error('Error placing rent order:', error);
        }
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>Set Rent Dates - PalletsPlus</title>
            </Head>
            <div className={styles.background}></div>
            <div className={styles.containerBase}>
                <div className={styles.container}>
                    <div className={styles.navBar}>
                        <a href="/home" className={styles.navBrand}>PalletsPlus</a>
                        <div className={styles.navLinks}>
                            <a href="/products" className={styles.navText}>Products</a>
                            <a href="/profile" className={styles.navText}>Profile</a>
                            <a href="/cart" className={styles.navText}>Your Cart</a>
                        </div>
                    </div>
                    <h1 className={styles.heading}>Set Rent Dates</h1>
                    <div className={styles.content}>
                        <div className={styles.productInfo}>
                            <img src={product.image} alt={product.name} className={styles.productImage} />
                            <span className={styles.productName}>{product.name}</span>
                        </div>
                        <div className={styles.datePickerContainer}>
                            <div className={styles.dateInputWrapper}>
                                <label className={styles.dateLabel}>Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className={`${styles.dateInput} ${styles.largeDateInput}`}
                                    placeholder="Start Date"
                                />
                            </div>
                            <div className={styles.dateInputWrapper}>
                                <label className={styles.dateLabel}>End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className={`${styles.dateInput} ${styles.largeDateInput}`}
                                    placeholder="End Date"
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        <button className={styles.cancelButton} onClick={handleCancel}>CANCEL</button>
                        <button className={styles.orderButton} onClick={handleOrder}>RENT</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RentPage;
