'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ProductDetail.module.css';
import CustomizeProduct from './CustomizeProduct'; // Import the CustomizeProduct component

const ProductDetail = ({ productId }) => {
    const [product, setProduct] = useState(null);
    const [activeSection, setActiveSection] = useState('details');  // Set default tab to 'details'
    const [showCustomizeForm, setShowCustomizeForm] = useState(false); // Add state for showing the customize form
    const [refresh, setRefresh] = useState(false); // State to trigger a refresh
    const router = useRouter();

    const fetchProduct = async () => {
        try {
            // Fetch product details from backend API
            const response = await fetch(`http://localhost:8000/product/${productId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch product');
            }
            const data = await response.json();
            console.log("Product data fetched:", data); // Log the fetched data for debugging
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    useEffect(() => {
        if (productId) {
            console.log("Fetching product with ID:", productId); // Log the product ID for debugging
            fetchProduct();
        }
    }, [productId, refresh]); // Add refresh to the dependency array

    if (!product) {
        return <div>Loading...</div>;
    }

    const handleSectionClick = (section) => {
        setActiveSection(section);
    };

    const handleCancelClick = () => {
        router.push('/products');
    };

    const handleCustomizeClick = () => {
        setShowCustomizeForm(true);
    };

    const handleRentClick = () => {
        router.push(`/rent`);
    };

    const handleCloseCustomizeForm = () => {
        setShowCustomizeForm(false);
        setRefresh((prev) => !prev); // Trigger a refresh
    };

    return (
        <div className={styles.containerBase}>
            <div className={styles.container}>
                {showCustomizeForm ? (
                    <CustomizeProduct productId={productId} onClose={handleCloseCustomizeForm} />
                ) : (
                    <>
                        <div className={styles.navBar}>
                            <a href="/home" className={styles.navBrand}>PalletsPlus</a>
                            <div className={styles.navLinks}>
                                <a href="/products" className={styles.navText}>Products</a>
                                <a href="/profile" className={styles.navText}>Profile</a>
                                <a href="/cart" className={styles.navText}>Your Cart</a>
                            </div>
                        </div>
                        <h1 className={styles.heading}>{product.name}</h1>
                        <div className={styles.productDetail}>
                            <img src={product.image} alt={product.name} className={styles.productImage} />
                            <div className={styles.productInfo}>
                                <div className={styles.description}>
                                    <h3 className={styles.sectionTitle}>Description</h3>
                                    <p style={{ color: 'gray', fontSize: '1.4vw' }}>{product.description}</p>
                                    <div className={styles.sizesAndWeight}>
                                        <div
                                            className={`${styles.sectionTab} ${activeSection === 'details' ? styles.activeTab : ''}`}
                                            onClick={() => handleSectionClick('details')}
                                        >
                                            Details
                                        </div>
                                        <div
                                            className={`${styles.sectionTab} ${activeSection === 'sizes' ? styles.activeTab : ''}`}
                                            onClick={() => handleSectionClick('sizes')}
                                        >
                                            Sizes
                                        </div>
                                    </div>
                                    <div className={styles.sectionContent}>
                                        {activeSection === 'details' ? (
                                            <ul className={styles.list}>
                                                <li><strong>Price:</strong> $ {product.price}</li>
                                                <li><strong>Rating:</strong> {product.rating} / 5</li>
                                                <li><strong>Availability:</strong> {product.availability ? 'Available' : 'Not available'}</li>
                                                <li><strong>Color:</strong> {product.color}</li>
                                                <li><strong>Material:</strong> {product.material}</li>
                                            </ul>
                                        ) : (
                                            <ul className={styles.list}>
                                                <li><strong>Size:</strong> {product.size} cm</li>
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.actionButtons}>
                                    <button className={styles.button} onClick={handleCustomizeClick}>Customize</button>
                                    <button className={styles.button} onClick={handleRentClick}>Rent</button>
                                    <button className={styles.button}>Order</button>
                                    <button className={styles.buttonCancel} onClick={handleCancelClick}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
