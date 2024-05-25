import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AddToFavoritesPopup = ({ isOpen, onClose, productId }) => {
    const [requestSent, setRequestSent] = useState(false);

    useEffect(() => {
        if (isOpen && !requestSent) {
            const userId = sessionStorage.getItem('userId') || ''; // Retrieve userId from sessionStorage or set it to an empty string
            handleAddToFavorites(userId, productId);
        }
    }, [isOpen, productId, requestSent]);

    const handleAddToFavorites = async (userId, productId) => {
        console.log('Sending request to add to favorites with:', { userId, productId });
        try {
            const response = await fetch('http://localhost:8001/user/add-to-favourites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, productId }),
            });

            const result = await response.json();
            console.log('Response from server:', result);

            if (response.ok) {
                toast.success('Product added to favorites successfully!');
                onClose();
            } else {
                toast.error(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error adding to favorites:', error);
            toast.error('An error occurred while adding to favorites.');
        } finally {
            setRequestSent(true);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setRequestSent(false);
        }
    }, [isOpen]);

    return null;
};

export default AddToFavoritesPopup;
