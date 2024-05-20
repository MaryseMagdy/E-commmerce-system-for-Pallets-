'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from './page.module.css';

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch products from backend API
                const response = await fetch('http://localhost:8000/product/');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

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
                        <a href="/profile" className={styles.navText}>Profile</a>
                        <a href="/cart" className={styles.navText}>Your Cart</a>
                    </div>
                </div>
                <div className={styles.productsContainer}>
                    <h1 className={styles.heading}>Our Products:</h1>
                    <div className={styles.productsList}>
                        {products.map((product, index) => (
                            <Link href={`/product/${product._id}`} key={index} passHref>
                                <div className={styles.productItem}>
                                    <img src={product.image} alt={product.name} className={styles.productImage} />
                                    <span className={`${styles.productName} ${styles.blueText}`}>{product.name}</span>
                                    <span className={styles.productDetails}>{product.details}</span>
                                    {/* <span className={styles.productId}>ID: {product._id}</span> */}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Products;
