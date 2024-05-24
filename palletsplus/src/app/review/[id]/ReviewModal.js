import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

const ReviewModal = ({ showModal, review, handleClose, handleSave }) => {
    const [inputValue, setInputValue] = useState({
        content: '',
        rating: '',
    });

    useEffect(() => {
        if (review) {
            setInputValue({
                content: review.content,
                rating: review.rating,
            });
        }
    }, [review]);

    if (!showModal) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = () => {
        const username = sessionStorage.getItem('username'); // Get the username from session storage
        handleSave({ ...inputValue, username });
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={handleClose}>&times;</span>
                <h2>{review ? 'Edit Review' : 'Add Review'}</h2>
                <textarea
                    name="content"
                    value={inputValue.content}
                    onChange={handleChange}
                    placeholder="Write your review"
                    className={styles.textArea}
                />
                <input
                    name="rating"
                    type="number"
                    value={inputValue.rating}
                    onChange={handleChange}
                    placeholder="Rating (1-5)"
                    className={styles.input}
                />
                <button className={styles.buttonAction} onClick={handleSaveClick}>{review ? 'Save' : 'Add'}</button>
            </div>
        </div>
    );
};

export default ReviewModal;
