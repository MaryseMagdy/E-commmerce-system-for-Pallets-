'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const Rent = ({ productId }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const router = useRouter();

    const handleOrder = () => {
        // Add the logic to handle the order submission
        console.log(`Ordering product ${productId} from ${startDate} to ${endDate}`);
        // Redirect to a confirmation page or handle the order logic
    };

    const handleCancelClick = () => {
        router.back();
    };

    return (
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
                <div className={styles.rentContent}>
                    <div className={styles.datePicker}>
                        <label>
                            Start Date:
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            End Date:
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className={styles.productImageContainer}>
                        <img src="/path/to/image.jpg" alt="Product Image" className={styles.productImage} />
                        <p className={styles.productName}>Heavy Duty Pallet - 3 skid</p>
                    </div>
                    <div className={styles.actionButtons}>
                        <button className={styles.buttonCancel} onClick={handleCancelClick}>Cancel</button>
                        <button className={styles.button} onClick={handleOrder}>Order</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rent;
