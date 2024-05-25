'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ProductDetail.module.css';
import CustomizeProduct from './CustomizeProduct';
import ShareModal from './ShareModal';
import AddToFavoritesPopup from './AddToFavouritePopUp';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetail = ({ productId }) => {
    const [product, setProduct] = useState(null);
    const [activeSection, setActiveSection] = useState('details');
    const [showCustomizeForm, setShowCustomizeForm] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const router = useRouter();

    const fetchProduct = async () => {
        try {
            const response = await fetch(`http://localhost:8000/product/${productId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch product');
            }
            const data = await response.json();
            sessionStorage.setItem('productId', data._id);
            console.log("Product data fetched:", data);
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    useEffect(() => {
        if (productId) {
            console.log("Fetching product with ID:", productId);
            fetchProduct();
        }
    }, [productId, refresh]);

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
        setRefresh((prev) => !prev);
    };

    const handleShareClick = () => {
        setIsShareModalOpen(true);
    };

    const handleCloseShareModal = () => {
        setIsShareModalOpen(false);
    };

    const handleReviewsClick = () => {
        router.push(`/review/${productId}`);
    };
    const handleAddToCart = async () => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            console.error('User ID is not defined');
            return;
        }

        const addToCartDto = {
            userId,
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: 1, // Default quantity can be 1, you can change as per your requirement
        };
        try {
            const response = await fetch('http://localhost:8004/carts/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(addToCartDto),
            });
            console.log("meee", addToCartDto)

            if (!response.ok) {
                throw new Error('Failed to add item to cart');
            }

            const result = await response.json();
            console.log('Item added to cart:', result);

            if (result.success) {
                toast.success('Item added to cart successfully!');
            } else {
                toast.error(result.message || 'Failed to add item to cart.');
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
            toast.error('An error occurred while adding item to cart.');
        }
    };
    const handleAddToFavoriteClick = () => {
        setIsPopupOpen(true);
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
                                <a href={`/profile/${sessionStorage.getItem('userId)')}`} className={styles.navText}>Profile</a>
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
                                        <button className={styles.shareButton} onClick={handleAddToFavoriteClick}>
                                            Add to Favorites
                                        </button>
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
                                    <button className={styles.button} onClick={handleAddToCart}>Add To Cart</button>
                                    <button className={styles.buttonCancel} onClick={handleCancelClick}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <ShareModal isOpen={isShareModalOpen} onClose={handleCloseShareModal} currentUrl={window.location.href} />
            <AddToFavoritesPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                productId={productId}
            />
        </div>

    );
};

export default ProductDetail;
