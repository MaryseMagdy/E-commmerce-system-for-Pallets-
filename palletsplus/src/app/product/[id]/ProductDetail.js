// src/app/product/[productId]/ProductDetail.js
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ProductDetail.module.css';
import CustomizeProduct from './CustomizeProduct';
import ShareModal from './ShareModal';

const ProductDetail = ({ productId }) => {
    const [product, setProduct] = useState(null);
    const [activeSection, setActiveSection] = useState('details');
    const [showCustomizeForm, setShowCustomizeForm] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const router = useRouter();
    localStorage.setItem('productId', productId);

    const fetchProduct = async () => {
        try {
            // Fetch product details from backend API
            const response = await fetch(`http://localhost:8000/product/${productId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch product');
            }
            const data = await response.json();
            sessionStorage.setItem('productId', data._id)
            console.log(data._id, "1")
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
        router.push(`/rent?productId=${productId}`);
    };

    const handleCloseCustomizeForm = () => {
        setShowCustomizeForm(false);
        setRefresh((prev) => !prev); // Trigger a refresh
    };

    const handleShareClick = () => {
        setIsShareModalOpen(true); // Open ShareModal
    };

    const handleCloseShareModal = () => {
        setIsShareModalOpen(false); // Close ShareModal
    };
    const handleReviewsClick = () => {
        router.push(`/review/${productId}`);
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
                                    <div className={styles.descriptionHeader}>
                                        <h3 className={styles.sectionTitle}>Description</h3>
                                        <button className={styles.shareButton} onClick={handleReviewsClick}>Reviews</button>
                                        <button className={styles.shareButton} onClick={handleShareClick}>Share</button>
                                    </div>
                                    <p className={styles.productDescription}>{product.description}</p>
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
                                    <button className={styles.button}>Add To Cart</button>
                                    <button className={styles.buttonCancel} onClick={handleCancelClick}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </>
                )
                }
            </div >
            <ShareModal isOpen={isShareModalOpen} onClose={handleCloseShareModal} currentUrl={window.location.href} /> {/* Render ShareModal */}
        </div >
    );
};

export default ProductDetail;