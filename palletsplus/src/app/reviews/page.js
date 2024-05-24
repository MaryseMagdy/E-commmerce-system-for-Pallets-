'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import styles from './page.module.css' // Assuming the CSS module is available

const UserReviews = () => {
    const [reviews, setReviews] = useState([])
    const [editingReview, setEditingReview] = useState(null)
    const [editContent, setEditContent] = useState('')
    const [editRating, setEditRating] = useState('')
    const [modalIsOpen, setModalIsOpen] = useState(false)

    const fetchReviews = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8001/user/reviews/${userId}`)
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            setReviews(data.reviews)
            console.log(data.reviews)
        } catch (error) {
            console.error('There was an error fetching the reviews!', error)
        }
    }

    const removeReview = async (userId, reviewId) => {
        try {
            const response = await fetch(`http://localhost:8001/user/reviews/${userId}/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const result = await response.json()
            if (result.success) {
                setReviews(reviews.filter(review => review._id !== reviewId))
            }
        } catch (error) {
            console.error('There was an error removing the review!', error)
        }
    }

    const updateReview = async (userId, reviewId, content, rating) => {
        try {
            const response = await fetch(`http://localhost:8001/user/reviews/${userId}/${reviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content, rating })
            })
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const result = await response.json()
            if (result.success) {
                const updatedReviews = reviews.map(review => {
                    if (review._id === reviewId) {
                        return { ...review, content, rating }
                    }
                    return review
                })
                setReviews(updatedReviews)
                closeModal()
            }
        } catch (error) {
            console.error('There was an error updating the review!', error)
        }
    }

    const openModal = (review) => {
        setEditingReview(review)
        setEditContent(review.content)
        setEditRating(review.rating)
        setModalIsOpen(true)
    }

    const closeModal = () => {
        setEditingReview(null)
        setEditContent('')
        setEditRating('')
        setModalIsOpen(false)
    }

    useEffect(() => {
        const userId = sessionStorage.getItem('userId')
        if (userId) {
            fetchReviews(userId)
        } else {
            console.error('No user ID found in session storage!')
        }
    }, [])

    return (
        <>
            <div className={styles.containerBase}>
                <Head>
                    <title>User Reviews</title>
                </Head>
                <div className={styles.container}>
                    <div className={styles.navBar}>
                        <div className={styles.navBrand}>PalletsPlus</div>
                        <div className={styles.navLinks}>
                            <Link href={`/profile/${sessionStorage.getItem('userId')}`} legacyBehavior>
                                <a className={styles.navText}>Profile</a>
                            </Link>
                            <Link href="/products" legacyBehavior>
                                <a className={styles.navText}>Products</a>
                            </Link>
                            <Link href="/cart" legacyBehavior>
                                <a className={styles.navText}>Your Cart</a>
                            </Link>
                        </div>
                    </div>
                    <div className={styles.profileContainer}>
                        <div className={styles.profileProfile}>
                            <div className={styles.header}>
                                <h2 className={styles.profileText}>My Reviews</h2>
                            </div>
                            <div className={styles.reviewsContainer}>
                                {reviews.map((review) => (
                                    <div className={styles.reviewItem} key={review._id}>
                                        <p>{review.content}</p>
                                        <p>Rating: {review.rating}</p>
                                        <button
                                            className={styles.buttonDelete}
                                            onClick={() => removeReview(sessionStorage.getItem('userId'), review._id)}
                                        >
                                            Remove
                                        </button>
                                        <button
                                            className={styles.buttonEdit}
                                            onClick={() => openModal(review)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {modalIsOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.close} onClick={closeModal}>&times;</span>
                        <h2>Edit Review</h2>
                        <textarea
                            className={styles.formControl}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder="Content"
                        />
                        <input
                            type="number"
                            className={styles.formControl}
                            value={editRating}
                            onChange={(e) => setEditRating(e.target.value)}
                            placeholder="Rating"
                        />
                        <button
                            className={styles.buttonAction}
                            onClick={() =>
                                updateReview(
                                    sessionStorage.getItem('userId'),
                                    editingReview._id,
                                    editContent,
                                    editRating
                                )
                            }
                        >
                            Save changes
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default UserReviews
