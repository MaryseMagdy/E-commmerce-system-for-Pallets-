'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

const Orders = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userId = sessionStorage.getItem('userId');
            if (userId) {
                const fetchItems = async () => {
                    setLoading(true);

                    try {
                        const response = await fetch(`http://localhost:8003/orders/history/${userId}`);
                        if (!response.ok) throw new Error('Failed to fetch orders');

                        const data = await response.json();
                        console.log('Fetched data:', JSON.stringify(data, null, 2));

                        if (data.status === 'success' && Array.isArray(data.data)) {
                            setItems(data.data);
                        } else {
                            console.error('Unexpected data format:', data);
                        }
                    } catch (error) {
                        console.error('Error fetching orders:', error);
                    } finally {
                        setLoading(false);
                    }
                };
                fetchItems();
            } else {
                console.error('No userId found in session storage');
                setLoading(false);
            }
        }
    }, []);

    console.log('Items:', items);

    if (loading) return <div>Loading...</div>;
    if (!items.length) return <div>No items found.</div>;

    return (
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
                        <title>Order History</title>
                    </Head>
                    <h1 className={styles.profileText}>Order History</h1>
                    <ul className={styles.ordersList}>
                        {items.map((item, index) => (
                            item && item.productId && item.quantity && item.price && item._id ? (
                                <li key={item._id} className={styles.orderItem}>
                                    <span className={styles.itemNumber}>{index + 1}.</span>
                                    <div className={styles.itemDetails}>
                                        <span className={styles.profileLabel}>Product ID:</span>
                                        <span className={styles.profileValue}>{item.productId}</span>
                                        <span className={styles.profileLabel}>Quantity:</span>
                                        <span className={styles.profileValue}>{item.quantity}</span>
                                        <span className={styles.profileLabel}>Price:</span>
                                        <span className={styles.profileValue}>${item.price.toFixed(2)}</span>
                                        <span className={styles.profileLabel}>Order ID:</span>
                                        <span className={styles.profileValue}>{item._id}</span>
                                    </div>
                                </li>
                            ) : (
                                <li key={index} className={styles.orderItem}>
                                    <span className={styles.itemNumber}>{index + 1}.</span>
                                    <div className={styles.itemDetails}>
                                        <span className={styles.profileLabel}>Incomplete item data</span>
                                    </div>
                                </li>
                            )
                        ))}
                    </ul>
                </div>
            </div>
        </div >
    );
};

export default Orders;