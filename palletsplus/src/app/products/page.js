'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import styles from './page.module.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');


    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8000/product/');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            const filteredProducts = data.filter(product => !product.customized);
            setProducts(filteredProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Error fetching products');
        }
    };

    const fetchWishlist = async () => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8001/user/wishlist/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch wishlist');
            }
            const data = await response.json();
            setWishlist(data.wishlist);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            toast.error('Error fetching wishlist');
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchWishlist();
    }, []);

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        const searchProducts = async () => {
            if (searchQuery.length < 1) {
                fetchProducts();
                return;
            }
            try {
                const response = await fetch('http://localhost:8000/product/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: searchQuery }),
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error searching products:', error);
                toast.error('Error searching products');
            }
        };

        const delayDebounceFn = setTimeout(() => {
            searchProducts();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const toggleWishlist = async (productId) => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            toast.error('User not logged in');
            return;
        }

        const isInWishlist = wishlist.some(product => product._id === productId);
        const endpoint = isInWishlist ? 'remove' : 'add';

        try {
            const response = await fetch(`http://localhost:8001/user/wishlist/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, productId }),
            });
            if (!response.ok) {
                throw new Error(`Failed to ${isInWishlist ? 'remove' : 'add'} product to wishlist`);
            }
            const data = await response.json();
            if (data.success) {
                toast.success(`Product ${isInWishlist ? 'removed from' : 'added to'} wishlist`);
                window.location.reload(); // Refresh the page
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(`Error ${isInWishlist ? 'removing' : 'adding'} product to wishlist:`, error);
            toast.error(`Error ${isInWishlist ? 'removing' : 'adding'} product to wishlist`);
        }
    }
    const isProductInWishlist = (productId) => {
        return wishlist.some(product => product._id === productId);
    };

    return (
        <>
            <div className={styles.background}>
                <img src="/tq_az7ku4h-wq-asb8-1500w.png" alt="Pallets Plus" className={styles.backgroundImage} />
            </div>
            <Head>
                <title>Our Products</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.navBar}>
                    <a href="/home" className={styles.navBrand}>PalletsPlus</a>
                    <div className={styles.navLinks}>
                        <a href="/products" className={styles.navText}>Products</a>
                        <a href={`/profile/${sessionStorage.getItem('userId')}`} className={styles.navText}>Profile</a>
                        <a href="/cart" className={styles.navText}>Your Cart</a>
                    </div>
                </div>
                <div className={styles.productsContainer}>
                    <h1 className={styles.heading}>Our Products:</h1>
                    <form className={styles.searchForm}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                            placeholder="Search products by name"
                        />
                    </form>
                    <div className={styles.productsList}>
                        {products.length === 0 && searchQuery && (
                            <div className={styles.noProducts}>No products found</div>
                        )}
                        {products.map((product, index) => (
                            <div className={styles.productItem} key={index}>
                                <Link href={`/product/${product._id}`} passHref>
                                    <img src={product.image} alt={product.name} className={styles.productImage} />
                                </Link>
                                <div className={styles.productInfo}>
                                    <span className={`${styles.productName} ${styles.blueText}`}>{product.name}</span>
                                    <span className={styles.productDetails}>{product.details}</span>
                                </div>
                                <FontAwesomeIcon
                                    icon={faStar}
                                    className={`${styles.wishlistIcon} ${isProductInWishlist(product._id) ? styles.gold : ''}`}
                                    onClick={() => toggleWishlist(product._id)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Products;
