'use client'
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from './page.module.css';

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch products from backend API
                const response = await fetch('http://localhost:8000/getAllProducts');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <>
            <div className={styles.productsContainer}>
                <Head>
                    <title>Our Products</title>
                </Head>
                <div className={styles.products}>
                    <div className={styles.productsList}>
                        {products.map((product, index) => (
                            <div className={styles.productItem} key={index}>
                                <img src={product.image} alt={product.name} className={styles.productImage} />
                                <span className={styles.productName}>{product.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Products;
