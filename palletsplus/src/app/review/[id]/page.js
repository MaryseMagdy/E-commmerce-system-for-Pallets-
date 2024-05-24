'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from './page.module.css';
import ReviewModal from './ReviewModal'; // Ensure the correct path

const Reviews = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentReview, setCurrentReview] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const fetchUser = async (userId) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8001/user/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const data = await response.json();
            setUser(data.user);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user:', error);
            setLoading(false);
        }
    };

    const fetchReview = async (productId) => {
        try {
            const response = await fetch(`http://localhost:8000/product/${productId}/reviews`);
            if (!response.ok) {
                throw new Error('Failed to fetch Review');
            }
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Error fetching Review:', error);
        }
    };

    const fetchProduct = async (productId) => {
        try {
            const response = await fetch(`http://localhost:8000/product/${productId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch product');
            }
            const product = await response.json();
            sessionStorage.setItem('productId', product._id);
            setProduct(product);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    useEffect(() => {
        const productId = sessionStorage.getItem('productId');
        if (productId) {
            fetchProduct(productId);
            fetchReview(productId);
        } else {
            console.error("No productId in session storage");
        }
        const userId = sessionStorage.getItem('userId');
        if (userId) {
            fetchUser(userId);
        } else {
            console.error('No userId found in session storage');
            setLoading(false);
        }
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentReview({});
        setIsEditing(false);
    };

    const handleSaveReview = async (review) => {
        const productId = sessionStorage.getItem('productId');
        const userId = sessionStorage.getItem('userId');
        if (!productId || !userId) {
            console.error('No productId or userId found in session storage');
            return;
        }

        const url = isEditing
            ? `http://localhost:8000/product/${productId}/reviews/${currentReview.reviewId}`
            : `http://localhost:8000/product/${productId}/reviews`;

        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...review, userId }),
            });

            const result = await response.json();
            if (result.success) {
                if (isEditing) {
                    setReviews((prevReviews) =>
                        prevReviews.map((r) =>
                            r.reviewId === currentReview.reviewId ? { ...r, ...review } : r
                        )
                    );
                    console.log('Review updated successfully');
                } else {
                    setReviews((prevReviews) => [...prevReviews, result.review]);
                    console.log('Review added successfully');
                }
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error('Error saving review:', error);
        }

        handleCloseModal();
    };

    return (
        <>
            <div className={styles.containerBase}>
                <div className={styles.container}>
                    <Head>
                        <title>Product Reviews</title>
                    </Head>
                    <div className={styles.navBar}>
                        <a href="/home" className={styles.navBrand}>PalletsPlus</a>
                        <div className={styles.navLinks}>
                            <a href="/products" className={styles.navText}>Products</a>
                            <a href={`/profile/${sessionStorage.getItem('userId')}`} className={styles.navText}>Profile</a>
                            <a href="/cart" className={styles.navText}>Your Cart</a>
                        </div>
                    </div>
                    <h1 className={styles.heading}>Reviews</h1>
                    <div className={styles.reviewsContent}>
                        <div className={styles.productSection}>
                            <div className={styles.reviewsProductDescription}>
                                <div className={styles.reviewsGroup6}>
                                    <img src={product ? product.image : 'Loading...'} alt="Product Image" className={styles.reviewsRectangle25} />
                                </div>
                                <span className={styles.reviewsText}>
                                    {/* <span>Reviews</span> */}
                                </span>
                            </div>
                            <div className={styles.reviewsProductDetails}>
                                <span>Price: {product ? product.price : 'Loading...'}</span>
                                <span>Rating: {product ? product.rating : 'Loading...'}</span>
                                <span>Availability: {product ? product.availability : 'Loading...'}</span>
                                <span>Color: {product ? product.color : 'Loading...'}</span>
                                <span>Material: {product ? product.material : 'Loading...'}</span>
                            </div>

                            <div className={styles.reviewsTitle}>
                                <span className={styles.reviewsText02}>
                                    <span>{product ? product.description : 'Loading...'}</span>
                                </span>
                            </div>
                        </div>
                        <div className={styles.reviewsSection}>
                            <div className={styles.reviewsList}>
                                <button className={styles.buttonAdd} onClick={() => { setIsEditing(false); setShowModal(true); }} >Add Review</button>
                                {reviews.length > 0 ? (
                                    reviews.map((review, index) => (
                                        <div key={index} className={styles.reviewCard}>
                                            <p><strong>Username: </strong> {user.username}</p>
                                            <p><strong>Review: </strong>{review.content}</p>
                                            <p><strong>Rating: </strong> {review.rating}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No reviews yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ReviewModal
                showModal={showModal}
                review={isEditing ? currentReview : null}
                handleClose={handleCloseModal}
                handleSave={handleSaveReview}
            />
        </>
    );
};

export default Reviews;
