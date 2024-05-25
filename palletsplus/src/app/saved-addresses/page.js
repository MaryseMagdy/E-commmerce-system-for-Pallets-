'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify
import styles from './page.module.css';

const AddressModal = ({ showModal, address, handleClose, handleSave }) => {
    const [inputValue, setInputValue] = useState(address || { label: '', street: '', city: '', state: '', zip: '' });

    useEffect(() => {
        setInputValue(address || { label: '', street: '', city: '', state: '', zip: '' });
    }, [address]);

    if (!showModal) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={handleClose}>&times;</span>
                <h2>{address ? 'Edit Address' : 'Add Address'}</h2>
                <input
                    name="label"
                    type="text"
                    value={inputValue.label}
                    onChange={handleChange}
                    placeholder="Label"
                />
                <input
                    name="street"
                    type="text"
                    value={inputValue.street}
                    onChange={handleChange}
                    placeholder="Street"
                />
                <input
                    name="city"
                    type="text"
                    value={inputValue.city}
                    onChange={handleChange}
                    placeholder="City"
                />
                <input
                    name="state"
                    type="text"
                    value={inputValue.state}
                    onChange={handleChange}
                    placeholder="State"
                />
                <input
                    name="zip"
                    type="text"
                    value={inputValue.zip}
                    onChange={handleChange}
                    placeholder="ZIP Code"
                />
                <button className={styles.buttonAction} onClick={() => handleSave(inputValue)}>{address ? 'Save' : 'Add'}</button>
            </div>
        </div>
    );
};

const AddressPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentAddress, setCurrentAddress] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const fetchAddresses = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8001/user/addresses/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch addresses');
            }
            const data = await response.json();
            setAddresses(data.addresses);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching addresses:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
            fetchAddresses(userId);
        } else {
            console.error('No userId found in session storage');
            setLoading(false);
        }
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentAddress({});
        setIsEditing(false);
    };

    const handleSave = async (address) => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            toast.error('No user ID found in session storage');
            return;
        }

        const url = isEditing
            ? `http://localhost:8001/user/${userId}/addresses/${currentAddress.index}`
            : `http://localhost:8001/user/${userId}/addAddress`;

        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(address),
            });

            const result = await response.json();
            if (result.success) {
                if (isEditing) {
                    setAddresses((prevAddresses) =>
                        prevAddresses.map((addr, idx) =>
                            idx === currentAddress.index ? address : addr
                        )
                    );
                    toast.success('Address updated successfully');
                } else {
                    setAddresses((prevAddresses) => [...prevAddresses, address]);
                    toast.success('Address added successfully');
                }
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error saving address:', error);
            toast.error('Error saving address');
        }

        handleCloseModal();
    };

    const handleDeleteAddress = async (index) => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            toast.error('No user ID found in session storage');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8001/user/${userId}/addresses/${index}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            if (result.success) {
                setAddresses((prevAddresses) => prevAddresses.filter((_, idx) => idx !== index));
                toast.success('Address deleted successfully');
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            toast.error('Error deleting address');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (addresses.length === 0) {
        return <div>No addresses found</div>;
    }

    return (
        <>
            <div className={styles.containerBase}>
                <div className={styles.container}>
                    <div className={styles.navBar}>
                        <a href="/home" className={styles.navBrand}>PalletsPlus</a>
                        <div className={styles.navLinks}>
                            <a href="/products" className={styles.navText}>Products</a>
                            <a href={`/profile/${sessionStorage.getItem('userId')}`} className={styles.navText}>Profile</a>
                            <a href="/cart" className={styles.navText}>Your Cart</a>
                        </div>
                    </div>
                    <div className={styles.profileContainer}>
                        <Head>
                            <title>Saved Addresses</title>
                        </Head>
                        <div className={styles.profileProfile}>
                            <div className={styles.header}>
                                <h3>Saved Addresses</h3>
                                <button className={styles.buttonAction} onClick={() => { setIsEditing(false); setShowModal(true); }}>Add Address</button>
                            </div>
                            <div className={styles.addressContainer}>
                                {addresses.map((address, index) => (
                                    <div key={index} className={styles.addressItem}>
                                        <p>{address.label}</p>
                                        <p>{address.street}</p>
                                        <p>{address.city}, {address.state} {address.zip}</p>
                                        <button className={styles.buttonChange} onClick={() => { setCurrentAddress({ ...address, index }); setIsEditing(true); setShowModal(true); }}>Edit</button>
                                        <button className={styles.buttonDelete} onClick={() => handleDeleteAddress(index)}>Delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddressModal
                showModal={showModal}
                address={isEditing ? currentAddress : null}
                handleClose={handleCloseModal}
                handleSave={handleSave}
            />
            <ToastContainer />
        </>
    );
};

export default AddressPage;
