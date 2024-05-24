'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Head from 'next/head'

const HomePage = (props) => {
    const [featuredProducts, setFeaturedProducts] = useState([])

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/product/')
                setFeaturedProducts(response.data)
            } catch (error) {
                console.error('Error fetching featured products:', error)
            }
        }

        fetchFeaturedProducts()
    }, [])

    return (
        <>
            <div className="home-page-container">
                <Head>
                    <title>PalletsPlus</title>
                </Head>
                <div className="home-page-nav-bar">
                    <span className="home-page-brand">PalletsPlus</span>
                    <div className="home-page-links">
                        <Link href="/products" legacyBehavior>
                            <a className="home-page-link">Products</a>
                        </Link>
                        <Link href="/profile" legacyBehavior>
                            <a className="home-page-link">Profile</a>
                        </Link>
                        <Link href="/cart" legacyBehavior>
                            <a className="home-page-link">Your Cart</a>
                        </Link>
                    </div>
                </div>
                <div className="home-page-content">
                    <h2 className="home-page-section-title">Featured Products</h2>
                    <div className="home-page-featured-products">
                        {featuredProducts.slice(0, 2).map((product) => (
                            <div key={product.id} className="home-page-product">
                                <img
                                    alt={product.name}
                                    src={product.image}
                                    className="home-page-product-image"
                                />
                                <span className="home-page-product-name">{product.name}</span>
                            </div>
                        ))}
                    </div>
                    <h2 className="home-page-section-title">Categories</h2>
                    <div className="home-page-categories">
                        <Link href="/products" legacyBehavior>
                            <a className="home-page-category-link">
                                <button className="home-page-category">
                                    <span>Wood Pallets</span>
                                </button>
                            </a>
                        </Link>
                        <Link href="/products" legacyBehavior>
                            <a className="home-page-category-link">
                                <button className="home-page-category">
                                    <span>Stainless Pallets</span>
                                </button>
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
            <style jsx>
                {`
                    .home-page-container {
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        background-color: var(--dl-color-theme-neutral-light);
                        min-height: 100vh;
                        padding: var(--dl-space-space-threeunits);
                    }
                    .home-page-nav-bar {
                        width: 100%;
                        max-width: var(--dl-size-size-maxwidth);
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: var(--dl-space-space-oneandhalfunits);
                        background: var(--dl-color-theme-accent1);
                        border-radius: var(--dl-radius-radius-radius8);
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        margin-bottom: var(--dl-space-space-twounits);
                    }
                    .home-page-brand {
                        font-size: var(--dl-size-size-large);
                        font-weight: bold;
                        color: var(--dl-color-theme-primary1);
                        font-family: 'Poppins', sans-serif;
                    }
                    .home-page-links {
                        display: flex;
                        gap: var(--dl-space-space-twounits);
                    }
                    .home-page-link {
                        color: var(--dl-color-theme-neutral-dark);
                        font-size: var(--dl-space-space-unit);
                        text-decoration: none;
                        font-family: 'Poppins', sans-serif;
                    }
                    .home-page-content {
                        width: 100%;
                        max-width: var(--dl-size-size-maxwidth);
                        background: white;
                        border-radius: var(--dl-radius-radius-radius8);
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        padding: var(--dl-space-space-twounits);
                        text-align: center;
                    }
                    .home-page-section-title {
                        font-size: var(--dl-space-space-fourunits);
                        color: var(--dl-color-theme-primary2);
                        margin-bottom: var(--dl-space-space-unit);
                        font-family: 'Poppins', sans-serif;
                    }
                    .home-page-featured-products {
                        display: flex;
                        justify-content: center;
                        gap: var(--dl-space-space-twounits);
                        margin-bottom: var(--dl-space-space-fourunits);
                    }
                    .home-page-product {
                        width: 200px;
                        text-align: center;
                        background: white;
                        padding: var(--dl-space-space-unit);
                        border-radius: var(--dl-radius-radius-cardradius);
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .home-page-product-image {
                        width: 100%;
                        height: 150px;
                        object-fit: cover;
                        border-radius: var(--dl-radius-radius-imageradius);
                        margin-bottom: var(--dl-space-space-halfunit);
                    }
                    .home-page-product-name {
                        font-size: var(--dl-space-space-unit);
                        color: var(--dl-color-theme-neutral-dark);
                        font-family: 'Poppins', sans-serif;
                    }
                    .home-page-categories {
                        display: flex;
                        justify-content: center;
                        gap: var(--dl-space-space-fourunits);
                    }
                    .home-page-category-link {
                        text-decoration: none;
                        color: inherit;
                    }
                    .home-page-category {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        background: white;
                        padding: var(--dl-space-space-unit);
                        border-radius: var(--dl-radius-radius-cardradius);
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        border: none;
                        cursor: pointer;
                        transition: background-color 0.3s ease, color 0.3s ease;
                    }
                    .home-page-category:hover {
                        background-color: var(--dl-color-theme-accent2);
                        color: var(--dl-color-theme-primary1);
                    }
                `}
            </style>
        </>
    )
}

export default HomePage
