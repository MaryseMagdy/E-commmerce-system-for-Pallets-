import React, { useState, useEffect } from 'react';
import styles from './CustomizeProduct.module.css';

const CustomizeProduct = ({ productId, onClose }) => {
    const [customizationData, setCustomizationData] = useState({
        width: '',
        height: '',
        material: '',
        color: '',
        quantity: '',
        customized: false,
    });
    const [product, setProduct] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomizationData({ ...customizationData, [name]: value });
    };

    const handleCustomize = async (e) => {
        e.preventDefault();
        const updatedCustomizationData = {
            ...customizationData,
            customized: true,
        };
        try {
            const response = await fetch(`http://localhost:8000/product/${productId}/customize`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCustomizationData),
            });
            console.log('Product ID:', productId);
            console.log('Response:', response);
            const data = await response.json();
            console.log('Custom data fetched:', data); // Log the fetched data for debugging
            if (data.success) {
                console.log('Product customized successfully!');
                onClose(); // Close the customize form and go back to product details
            } else {
                console.log('Customization failed: ' + data.message);
            }
        } catch (error) {
            console.error('Error customizing product:', error);
            alert('An error occurred. Please try again.');
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8000/product/${productId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [productId]);

    return (
        <div className={styles.containerBase}>
            <div className={styles.customizeContainer}>
                <div className={styles.navBarContainer}>
                    <div className={styles.navBar}>
                        <a href="/home" className={styles.navBrand}>PalletsPlus</a>
                        <div className={styles.navLinks}>
                            <a href="/products" className={styles.navText}>Products</a>
                            <a href={`/profile/${sessionStorage.getItem('userId')}`} className={styles.navText}>Profile</a>
                            <a href="/cart" className={styles.navText}>Your Cart</a>
                        </div>
                    </div>
                </div>
                <div className={styles.customizeTitleContainer}>
                    <h1 className={styles.customizeTitle}>Customize Pallet</h1>
                </div>
                <div className={styles.customizeContent}>
                    {product && (
                        <div className={styles.productImageContainer}>
                            <img src={product.image} alt={product.name} className={styles.productImage} />
                            <p className={styles.productName}>{product.name}</p>
                        </div>
                    )}
                    <form className={styles.customizeForm} onSubmit={handleCustomize}>
                        <div className={styles.customizeFields}>
                            <label>
                                Width:
                                <input
                                    type="text"
                                    name="width"
                                    value={customizationData.width}
                                    onChange={handleChange}
                                    placeholder="Enter width"
                                    required
                                />
                            </label>
                            <label>
                                Height:
                                <input
                                    type="text"
                                    name="height"
                                    value={customizationData.height}
                                    onChange={handleChange}
                                    placeholder="Enter height"
                                    required
                                />
                            </label>
                            <label>
                                Material:
                                <input
                                    type="text"
                                    name="material"
                                    value={customizationData.material}
                                    onChange={handleChange}
                                    placeholder="Enter material"
                                    required
                                />
                            </label>
                            <label>
                                Color:
                                <select
                                    name="color"
                                    value={customizationData.color}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a color</option>
                                    <option value="Blue">Blue</option>
                                    <option value="Red">Red</option>
                                    <option value="Green">Green</option>
                                    <option value="Yellow">Yellow</option>
                                    <option value="Black">Black</option>
                                </select>
                            </label>
                            <label>
                                Quantity:
                                <input
                                    type="number"
                                    name="quantity"
                                    value={customizationData.quantity}
                                    onChange={handleChange}
                                    placeholder="Enter quantity"
                                    required
                                />
                            </label>
                        </div>
                        <div className={styles.customizeButtons}>
                            <button type="submit" className={styles.button}>Customize</button>
                            <button type="button" className={styles.buttonCancel} onClick={onClose}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    );
};

export default CustomizeProduct;
