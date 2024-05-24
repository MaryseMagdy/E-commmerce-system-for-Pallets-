'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './page.module.css';

const YourCart = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch('http://localhost:8000/cart'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCartItems(data.items || []); // Ensure data.items is defined
        calculateSubtotal(data.items || []);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setCartItems([]); // Set to empty array in case of error
      }
    };

    fetchCartItems();
  }, []);

  const calculateSubtotal = (items) => {
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setSubtotal(subtotal);
  };

  return (
    <>
      <div className={styles.yourCartContainer}>
        <Head>
          <title>Your Cart</title>
        </Head>
        <div className={styles.yourCartYourCart}>
          <img
            src="/rectangle201612-gdba-1200w.png"
            alt="Rectangle201612"
            className={styles.yourCartRectangle20}
          />
          <div className={styles.yourCartGroup55}>
            <span className={styles.yourCartText}>1. Shopping Cart</span>
            <span className={styles.yourCartText01}>2. Shipping Details</span>
            <span className={styles.yourCartText02}>3. Payment Options</span>
            <img
              src="/line171638-ka8.svg"
              alt="Line171638"
              className={styles.yourCartLine17}
            />
            <img
              src="/line181639-sn7e.svg"
              alt="Line181639"
              className={styles.yourCartLine18}
            />
          </div>
          <img
            src="/line191640-a15m.svg"
            alt="Line191640"
            className={styles.yourCartLine19}
          />
          <img
            src="/line211641-sul4.svg"
            alt="Line211641"
            className={styles.yourCartLine21}
          />
          <img
            src="/line201642-bmrk.svg"
            alt="Line201642"
            className={styles.yourCartLine20}
          />
          <img
            src="/line221643-7bse.svg"
            alt="Line221643"
            className={styles.yourCartLine22}
          />
          <span className={styles.yourCartText03}>
            <span>Shopping Cart</span>
          </span>
          <span className={styles.yourCartText05}>
            <span>Summary</span>
          </span>
          <span className={styles.yourCartText07}>
            <span>
              Enter Discount Code:
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
          </span>
          <div className={styles.yourCartFrame34}>
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div key={index} className={styles.yourCartGroup30}>
                  <span className={styles.yourCartText09}>
                    <span>{item.name}</span>
                  </span>
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.yourCartRectangle30}
                  />
                  <span className={styles.yourCartText11}>
                    <span>{item.description}</span>
                  </span>
                  <span className={styles.yourCartText13}>
                    <span>${item.price}</span>
                  </span>
                </div>
              ))
            ) : (
              <p>No items in cart.</p>
            )}
          </div>
          <span className={styles.yourCartText27}>
            <span>SUBTOTAL:</span>
          </span>
          <span className={styles.yourCartText29}>
            <span>TOTAL:</span>
          </span>
          <span className={styles.yourCartText31}>
            <span>SHIPPING:</span>
          </span>
          <span className={styles.yourCartText33}>
            <span>TAXES:</span>
          </span>
          <span className={styles.yourCartText35}>
            <span>${subtotal.toFixed(2)}</span>
          </span>
          <span className={styles.yourCartText37}>
            <span>${(subtotal + 24.99).toFixed(2)}</span>
          </span>
          <span className={styles.yourCartText39}>
            <span>$24.99</span>
          </span>
          <span className={styles.yourCartText41}>
            <span>FREE</span>
          </span>
          <div className={styles.yourCartNavBar}>
            <img
              src="/line64119-an1p.svg"
              alt="Line64119"
              className={styles.yourCartLine6}
            />
            <Link href="/profile" legacyBehavior>
              <a className={styles.yourCartLink}>Profile</a>
            </Link>
            <Link href="/products" legacyBehavior>
              <a className={styles.yourCartLink1}>Products</a>
            </Link>
            <img
              src="/line74119-hpuo.svg"
              alt="Line74119"
              className={styles.yourCartLine7}
            />
            <Link href="/cart" legacyBehavior>
              <a className={styles.yourCartLink2}>Your Cart</a>
            </Link>
            <img
              src="/mdicart4120-v8px.svg"
              alt="mdicart4120"
              className={styles.yourCartMdicart}
            />
            <span className={styles.yourCartText49}>
              <span>PalletsPlus</span>
            </span>
          </div>
          <input
            type="text"
            placeholder="Enter Discount Code"
            className={styles.yourCartTextinput}
          />
          <button type="button" className={styles.yourCartButton}>
            <span className={styles.yourCartText51}>
              <span>Check Out</span>
              <Link href="/checkout" legacyBehavior>
                <a> </a>
              </Link>
              <br />
            </span>
          </button>
        </div>
        <button type="button" className={styles.yourCartButton1}>
          <span className={styles.yourCartText54}>
            <span>Cancel</span>
            <br />
          </span>
        </button>
      </div>
    </>
  );
}

export default YourCart;
