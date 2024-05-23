'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([])

    const fetchWishlist = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8001/user/wishlist/${userId}`)
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            setWishlist(data.wishlist)
            console.log(data.wishlist)
        } catch (error) {
            console.error('There was an error fetching the wishlist!', error)
        }
    }

    const removeFromWishlist = async (userId, productId) => {
        try {
            console.log(userId);
            console.log(wishlist);
            const response = await fetch('http://localhost:8001/user/wishlist/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, productId })
            })
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const result = await response.json()
            if (result.success) {
                setWishlist(wishlist.filter(item => item._id !== productId))
            }
        } catch (error) {
            console.error('There was an error removing the item from the wishlist!', error)
        }
    }

    useEffect(() => {
        const userId = sessionStorage.getItem('userId')
        if (userId) {
            fetchWishlist(userId)
        } else {
            console.error('No user ID found in session storage!')
        }
    }, [])

    return (
        <>
            <div className="containerBase">
                <Head>
                    <title>Wishlist</title>
                </Head>
                <div className="container">
                    <div className="navBar">
                        <div className="navBrand">PalletsPlus</div>
                        <div className="navLinks">
                            <Link href="/profile" legacyBehavior>
                                <a className="navText">Profile</a>
                            </Link>
                            <Link href="/products" legacyBehavior>
                                <a className="navText">Products</a>
                            </Link>
                            <Link href="/cart" legacyBehavior>
                                <a className="navText">Your Cart</a>
                            </Link>
                        </div>
                    </div>
                    <div className="profileContainer">
                        <div className="profileProfile">
                            <div className="header">
                                <h2 className="profileText">Wishlisted Products</h2>
                            </div>
                            <div className="addressContainer">
                                {wishlist.map((item, index) => (
                                    <div className="addressItem" key={index}>
                                        <h3>{item.name}</h3>
                                        <p>{item.description}</p>
                                        <p>${item.price}</p>
                                        <button className="buttonAction">Add to Cart</button>
                                        <button
                                            className="buttonDelete"
                                            onClick={() => removeFromWishlist(sessionStorage.getItem('userId'), item._id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
        .containerBase {
          background-image: url("/tq_az7ku4h-wq-asb8-1500w.png");
          background-size: cover;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
        }

        .container {
          margin: 0 auto;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .navBar {
          background: linear-gradient(180deg, rgba(0, 115, 251, 1) 19%, rgba(255, 255, 255, 1) 74%);
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 122.7%;
          padding: 1rem 2rem;
          border-radius: 10px;
          margin-bottom: -15px;
        }

        .navBrand {
          font-weight: bold;
          font-size: 32px;
          color: #0073fb;
        }

        .navLinks {
          display: flex;
          gap: 1.5rem;
        }

        .navText {
          color: rgba(0, 0, 0, 0.7);
          font-size: 24px;
          font-family: Poppins, sans-serif;
          font-weight: bold;
          text-decoration: none;
        }

        .profileContainer {
          background-color: #fff;
          padding: 40px;
          border-radius: 10px;
          width: 120%;
          height: 100%;
        }

        .profileProfile {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 20px;
        }

        .profileText {
          margin-top: 20px;
          color: rgba(118, 118, 118, 1);
          font-size: 42px;
          text-align: center;
          font-family: Poppins, sans-serif;
          font-weight: 400;
        }

        .addressContainer {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 20px;
        }

        .addressItem {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .buttonAction, .buttonChange, .buttonDelete {
          color: #007bff;
          border: 2px solid #007bff;
          background-color: white;
          padding: 10px 20px;
          font-size: 16px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-top: 10px;
        }

        .buttonDelete {
          color: #e63946;
          border-color: #e63946;
        }

        .buttonAction:hover, .buttonChange:hover {
          background-color: #007bff;
          color: white;
        }

        .buttonDelete:hover {
          background-color: #e63946;
          color: white;
        }
      `}</style>
        </>
    )
}

export default Wishlist
