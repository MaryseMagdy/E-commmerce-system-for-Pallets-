'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './page.module.css';

const generateRandomCardId = () => {
    return Math.random().toString(36).substr(2, 9);
};

const CardModal = ({ showModal, card, handleClose, handleSave }) => {
    const [inputValue, setInputValue] = useState({
        last4: '',
        brand: '',
        exp_month: '',
        exp_year: '',
        funding: '',
        country: ''
    });

    useEffect(() => {
        if (card) {
            setInputValue({
                last4: card.last4,
                brand: card.brand,
                exp_month: card.exp_month,
                exp_year: card.exp_year,
                funding: card.funding,
                country: card.country
            });
        }
    }, [card]);

    if (!showModal) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = () => {
        handleSave({ ...inputValue, cardId: generateRandomCardId() });
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={handleClose}>&times;</span>
                <h2>{card ? 'Edit Card' : 'Add Card'}</h2>
                <input
                    name="last4"
                    type="text"
                    value={inputValue.last4}
                    onChange={handleChange}
                    placeholder="Last 4 Digits"
                />
                <input
                    name="brand"
                    type="text"
                    value={inputValue.brand}
                    onChange={handleChange}
                    placeholder="Brand"
                />
                <input
                    name="exp_month"
                    type="number"
                    value={inputValue.exp_month}
                    onChange={handleChange}
                    placeholder="Expiry Month"
                />
                <input
                    name="exp_year"
                    type="number"
                    value={inputValue.exp_year}
                    onChange={handleChange}
                    placeholder="Expiry Year"
                />
                <input
                    name="funding"
                    type="text"
                    value={inputValue.funding}
                    onChange={handleChange}
                    placeholder="Funding"
                />
                <input
                    name="country"
                    type="text"
                    value={inputValue.country}
                    onChange={handleChange}
                    placeholder="Country"
                />
                <button className={styles.buttonAction} onClick={handleSaveClick}>{card ? 'Save' : 'Add'}</button>
            </div>
        </div>
    );
};

const NoCardsPage = ({ onAddCard }) => (
    <div className={styles.noCardsContainer}>
        <Head>
            <title>No Cards Found</title>
        </Head>
        <div className={styles.noCardsContent}>
            <h1>No Cards Found</h1>
            <p>You don't have any cards saved. Click the button below to add a new card.</p>
            <button className={styles.buttonAction} onClick={onAddCard}>Add Card</button>
        </div>
    </div>
);

const CardsPage = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentCard, setCurrentCard] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const fetchCards = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8001/user/${userId}/cards`);
            if (!response.ok) {
                throw new Error('Failed to fetch cards');
            }
            const data = await response.json();
            setCards(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cards:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
            fetchCards(userId);
        } else {
            console.error('No userId found in session storage');
            setLoading(false);
        }
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentCard({});
        setIsEditing(false);
    };

    const handleSave = async (card) => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            toast.error('No user ID found in session storage');
            return;
        }

        const url = isEditing
            ? `http://localhost:8001/user/${userId}/cards/${currentCard.cardId}`
            : `http://localhost:8001/user/${userId}/cards`;

        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(card),
            });

            const result = await response.json();
            if (result.success) {
                if (isEditing) {
                    setCards((prevCards) =>
                        prevCards.map((c) =>
                            c.cardId === currentCard.cardId ? { ...c, ...card } : c
                        )
                    );
                    toast.success('Card updated successfully');
                } else {
                    setCards((prevCards) => [...prevCards, card]); // Use the local card object instead of result.card
                    toast.success('Card added successfully');
                }
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error saving card:', error);
            toast.error('Error saving card');
        }

        handleCloseModal();
    };

    const handleDeleteCard = async (cardId) => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            toast.error('No user ID found in session storage');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8001/user/${userId}/cards/${cardId}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            if (result.success) {
                setCards((prevCards) => prevCards.filter((card) => card.cardId !== cardId));
                toast.success('Card deleted successfully');
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error deleting card:', error);
            toast.error('Error deleting card');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (cards.length === 0) {
        return <NoCardsPage onAddCard={() => { setIsEditing(false); setShowModal(true); }} />;
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
                            <title>Saved Cards</title>
                        </Head>
                        <div className={styles.profileProfile}>
                            <div className={styles.header}>
                                <h3>Saved Cards</h3>
                                <button className={styles.buttonAction} onClick={() => { setIsEditing(false); setShowModal(true); }}>Add Card</button>
                            </div>
                            <div className={styles.cardContainer}>
                                {cards.map((card) => (
                                    <div key={card.cardId} className={styles.cardItem}>
                                        <p>Brand: {card.brand}</p>
                                        <p>Last 4 Digits: {card.last4}</p>
                                        <p>Expiry: {card.exp_month}/{card.exp_year}</p>
                                        <p>Funding: {card.funding}</p>
                                        <p>Country: {card.country}</p>
                                        <button className={styles.buttonChange} onClick={() => { setCurrentCard(card); setIsEditing(true); setShowModal(true); }}>Edit</button>
                                        <button className={styles.buttonDelete} onClick={() => handleDeleteCard(card.cardId)}>Delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CardModal
                showModal={showModal}
                card={isEditing ? currentCard : null}
                handleClose={handleCloseModal}
                handleSave={handleSave}
            />
            <ToastContainer />
        </>
    );
};

export default CardsPage;
