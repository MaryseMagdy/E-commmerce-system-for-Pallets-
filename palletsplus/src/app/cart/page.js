'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './page.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const YourCart = () => {
  const [items, setItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    console.log(userId);

    if (!userId) {
      console.error('User ID is not defined');
      return;
    }

    async function fetchCartItems() {
      try {
        const response = await fetch(`http://localhost:8004/carts/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch cart items');
        }
        const data = await response.json();

        // Fetch product details for each cart item
        const itemsWithDetails = await Promise.all(
          data.map(async (item) => {
            const productResponse = await fetch(`http://localhost:8000/product/${item.productId}`);
            if (!productResponse.ok) {
              throw new Error('Failed to fetch product details');
            }
            const productData = await productResponse.json();
            return { ...item, ...productData };
          })
        );
        setItems(itemsWithDetails);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    }

    fetchCartItems();
  }, []);

  const handleIncreaseQuantity = async (productId) => {
    const userId = sessionStorage.getItem('userId');
    try {
      const response = await fetch(`http://localhost:8004/carts/increase/${userId}/${productId}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to increase quantity');
      }
      const updatedItem = await response.json();
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity: updatedItem.quantity } : item
        )
      );
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    const userId = sessionStorage.getItem('userId');
    console.log(productId);
    const item = items.find((item) => item.productId === productId);
    console.log(item);
    if (item.quantity <= 1) {
      try {
        const response = await fetch(`http://localhost:8004/carts/remove/${userId}/${productId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to remove item');
        }
        setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
      } catch (error) {
        console.error('Error removing item:', error);
      }
    } else {
      try {
        const response = await fetch(`http://localhost:8004/carts/decrease/${userId}/${productId}`, {
          method: 'PUT',
        });
        if (!response.ok) {
          throw new Error('Failed to decrease quantity');
        }
        const updatedItem = await response.json();
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.productId === productId ? { ...item, quantity: updatedItem.quantity } : item
          )
        );
      } catch (error) {
        console.error('Error decreasing quantity:', error);
      }
    }
  };

  const handleApplyCoupon = () => {
    let discountValue = 0;
    if (couponCode === '30%OFF') {
      discountValue = 0.3; // 30% discount
    } else if (couponCode === '20%OFF') {
      discountValue = 0.2; // 20% discount
    } else if (couponCode === '10%OFF') {
      discountValue = 0.1; // 10% discount
    } else {
      setDiscount(0);
      alert('Invalid coupon code');
      return;
    }

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setDiscount(subtotal * discountValue);
  };

  const handleCheckout = async () => {
    try {
      const userId = sessionStorage.getItem('userId') || ''; // Retrieve userId from sessionStorage
      const response = await fetch(`http://localhost:8002?user_id=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to initiate checkout');
      }
      const checkoutSession = await response.json();
      if (checkoutSession && checkoutSession.url) {
        window.location.href = checkoutSession.url; // Redirect to the Stripe checkout session
      }
    } catch (error) {
      console.error('Error initiating checkout:', error);
      toast.error('An error occurred while initiating checkout.');
    }
  };

  const handleSuccess = async (sessionId, userId) => {
    try {
      const response = await fetch(`http://localhost:8002/success?session_id=${sessionId}&user_id=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to process payment success');
      }
      const result = await response.json();
      if (result.message === 'Payment success and card details processed') {
        toast.success('Payment was successful!');
        router.push('/home');
      } else {
        toast.error('An error occurred while processing payment success.');
      }
    } catch (error) {
      console.error('Error processing payment success:', error);
      toast.error('An error occurred while processing payment success.');
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal - discount + 24.99; // Assuming $24.99 is the fixed tax amount

  return (
    <>
      <div className={styles['your-cart-container']}>
        <Head>
          <title>Your Cart</title>
        </Head>
        <div className={styles['your-cart-nav-bar']}>
          <span className={styles['your-cart-brand']}>PalletsPlus</span>
          <div className={styles['your-cart-links']}>
            <Link href="/products" className={styles['your-cart-link']}>Products</Link>
            <Link href={`/profile/${sessionStorage.getItem('userId')}`} className={styles['your-cart-link']}>Profile</Link>
            <Link href="/cart" className={styles['your-cart-link-active']}>Your Cart</Link>
            <img src="/mdicart4120-v5fc.svg" alt="Cart Icon" className={styles['your-cart-mdicart']} />
          </div>
        </div>
        <div className={styles['your-cart-content']}>
          <h2 className={styles['your-cart-title']}>Shopping Cart</h2>
          <div className={styles['your-cart-header']}>
            <span className={styles['your-cart-subtitle']}>Summary</span>
            <div className={styles['your-cart-discount']}>
              Enter Discount Code:
              <input
                type="text"
                placeholder="Enter Code"
                className={styles['your-cart-input']}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button onClick={handleApplyCoupon} className={styles['your-cart-apply-button']}>
                Apply
              </button>
            </div>
          </div>
          <div className={styles['your-cart-items']}>
            {items.length > 0 ? (
              items.map((item, index) => (
                <div key={index} className={styles['your-cart-item']}>
                  <img src={item.image} alt={item.name} className={styles['your-cart-item-image']} />
                  <div className={styles['your-cart-item-details']}>
                    <span className={styles['your-cart-item-name']}>{item.name}</span>
                    <span className={styles['your-cart-item-description']}>{item.description}</span>
                    <span className={styles['your-cart-item-price']}>${item.price}</span>
                  </div>
                  <div className={styles['your-cart-item-quantity-container']}>
                    <button
                      onClick={() => handleDecreaseQuantity(item.productId)}
                      className={styles['quantity-button']}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      readOnly
                      className={styles['your-cart-item-quantity']}
                    />
                    <button
                      onClick={() => handleIncreaseQuantity(item.productId)}
                      className={styles['quantity-button']}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <span className={styles['your-cart-empty']}>Your cart is empty</span>
            )}
          </div>
          <div className={styles['your-cart-summary']}>
            <div className={styles['your-cart-summary-item']}>
              <span className={styles['your-cart-summary-label']}>SUBTOTAL:</span>
              <span className={styles['your-cart-summary-value']}>
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className={styles['your-cart-summary-item']}>
              <span className={styles['your-cart-summary-label']}>DISCOUNT:</span>
              <span className={styles['your-cart-summary-value']}>${discount.toFixed(2)}</span>
            </div>
            <div className={styles['your-cart-summary-item']}>
              <span className={styles['your-cart-summary-label']}>SHIPPING:</span>
              <span className={styles['your-cart-summary-value']}>FREE</span>
            </div>

            <div className={styles['your-cart-summary-item']}>
              <span className={styles['your-cart-summary-label']}>TOTAL:</span>
              <span className={styles['your-cart-summary-value']}>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
          <div className={styles['your-cart-actions']}>
            <button className={styles['your-cart-checkout-button']} onClick={handleCheckout}>CHECK OUT</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default YourCart;