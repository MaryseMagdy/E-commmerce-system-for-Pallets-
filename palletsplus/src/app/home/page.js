'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [topOffers, setTopOffers] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/product/');
                const products = response.data;
                const sortedProducts = products.sort((a, b) => b.rating - a.rating);
                setFeaturedProducts(sortedProducts.slice(0, 2));
                setTopOffers(products.filter(product => product.offers !== "0"));
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleCategoryClick = (material) => {
        localStorage.setItem('selectedMaterial', material);
        router.push(`/products?material=${material}`);
    };

    const handleProfileClick = () => {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
            router.push(`/profile/${userId}`);
        } else {
            router.push('/login');
        }
    };

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
                        <a className="home-page-link" onClick={handleProfileClick}>Profile</a>
                        <Link href="/cart" legacyBehavior>
                            <a className="home-page-link">Your Cart</a>
                        </Link>
                        <Link href="/login" legacyBehavior>
                            <a className="home-page-link">Login</a>
                        </Link>
                        <Link href="/wishlist" legacyBehavior>
                            <a className="home-page-link">Wishlist</a>
                        </Link>
                    </div>
                </div>
                <div className="home-page-content">
                    <h2 className="home-page-section-title">Top Offers</h2>
                    <div className="home-page-top-offers">
                        {topOffers.map((product) => (
                            <Link href={`/product/${product._id}`} key={product._id} passHref>
                                <div className="home-page-offer">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="home-page-offer-image"
                                    />
                                    <span className="home-page-offer-name">{product.offers}</span>
                                    <span className="home-page-offer-validity">Valid until: {product.validity || '30/5/2024'}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <h2 className="home-page-section-title">Featured Products</h2>
                    <div className="home-page-featured-products">
                        {featuredProducts.map((product) => (
                            <Link href={`/product/${product._id}`} key={product._id} passHref>
                                <div className="home-page-product">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="home-page-product-image"
                                    />
                                    <span className="home-page-product-name">{product.name}</span>
                                    <span className="home-page-product-price">${product.price.toFixed(2)}</span>
                                    <span className="home-page-product-rating">Rating: {product.rating}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <h2 className="home-page-section-title">Categories</h2>
                    <div className="home-page-categories">
                        <button className="home-page-category" onClick={() => handleCategoryClick('wood')}>
                            <span>Wood Pallets</span>
                        </button>
                        <button className="home-page-category" onClick={() => handleCategoryClick('plastic')}>
                            <span>Plastic Pallets</span>
                        </button>
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
                        background-color: #FBFAF9;
                        min-height: 100vh;
                        padding: 48px;
                        background-image: url('/se-wall.png');
                        background-size: cover;
                        background-position: center;
                        background-repeat: no-repeat;
                    }
                    .home-page-nav-bar {
                        width: 100%;
                        max-width: 1400px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 24px;
                        background: linear-gradient(180deg, rgba(0, 115, 251, 1) 19%, rgba(255, 255, 255, 1) 74%);
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        margin-bottom: -14px;
                    }
                    .home-page-brand {
                        font-size: 44px;
                        font-weight: bold;
                        color: #0073fb;
                        font-family: 'Poppins', sans-serif;
                    }
                    .home-page-links {
                        display: flex;
                        gap: 32px;
                    }
                    .home-page-link {
                        color: rgba(0, 0, 0, 0.7);
                        font-size: 16px;
                        text-decoration: none;
                        font-family: 'Poppins', sans-serif;
                        cursor: pointer;
                    }
                    .home-page-content {
                        width: 100%;
                        max-width: 1400px;
                        background: white;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        padding: 32px;
                        text-align: center;
                    }
                    .home-page-section-title {
                        font-size: 64px;
                        color: #923A06;
                        margin-bottom: 16px;
                        font-family: 'Poppins', sans-serif;
                    }
                    .home-page-featured-products,
                    .home-page-top-offers {
                        display: flex;
                        justify-content: center;
                        gap: 32px;
                        margin-bottom: 64px;
                    }
                    .home-page-product,
                    .home-page-offer {
                        width: 200px;
                        text-align: center;
                        background: white;
                        padding: 16px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .home-page-product-image,
                    .home-page-offer-image {
                        width: 100%;
                        height: 150px;
                        object-fit: cover;
                        border-radius: 8px;
                        margin-bottom: 8px;
                    }
                    .home-page-product-name,
                    .home-page-offer-name,
                    .home-page-product-price,
                    .home-page-product-rating,
                    .home-page-offer-validity {
                        display: block; /* Forces each item to be on a new line */
                        font-family: 'Poppins', sans-serif;
                    }
                    .home-page-product-name,
                    .home-page-offer-name {
                        font-size: 16px;
                        color: #191818;
                    }
                    .home-page-product-price {
                        font-size: 14px;
                        color: #0073fb;
                        margin-top: 4px;
                    }
                    .home-page-product-rating {
                        font-size: 14px;
                        color: #ff9900;
                        margin-top: 4px;
                    }
                    .home-page-offer-validity {
                        font-size: 14px;
                        color: #ff9900;
                        margin-top: 4px;
                    }
                    .home-page-categories {
                        display: flex;
                        justify-content: center;
                        gap: 64px;
                        
                    }
                    .home-page-category-link {
                        text-decoration: none;
                        color: inherit;
                    }
                    .home-page-category {
                        display: flex;
                        font-size: 40px;
                        flex-direction: column;
                        align-items: center;
                        background: white;
                        padding: 16px;
                        border-radius: 100px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        border: none;
                        cursor: pointer;
                        transition: background-color 0.3s ease, color 0.3s ease;
                    }
                    .home-page-category:hover {
                        background-color: #D8BFAF;
                            color: #D1510A;
                    }
                `}
            </style>
        </>
    );
};

export default HomePage;