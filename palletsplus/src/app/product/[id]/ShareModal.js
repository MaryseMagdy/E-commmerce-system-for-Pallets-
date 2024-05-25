import React from 'react';

const styles = {
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
    },
    socialButtons: {
        marginBottom: '20px',
    },
    socialButton: {
        display: 'block',
        margin: '10px 0',
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    socialButtonHover: {
        backgroundColor: '#0056b3',
    },
    copyButton: {
        display: 'block',
        margin: '10px 0',
        padding: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    copyButtonHover: {
        backgroundColor: '#218838',
    },
    closeButton: {
        display: 'block',
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    closeButtonHover: {
        backgroundColor: '#5a6268',
    },
};

const ShareModal = ({ isOpen, onClose, currentUrl }) => {
    if (!isOpen) return null;

    const socialMediaSharingMessage = `Check out this product on PalletsPlus:   ${currentUrl}`;
    const socialMediaSharingUrls = [
        { name: 'Facebook', url: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(currentUrl) },
        { name: 'Twitter', url: 'https://twitter.com/share?url=' + encodeURIComponent(currentUrl) + '&text=' + encodeURIComponent(socialMediaSharingMessage) },
        { name: 'LinkedIn', url: 'https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(currentUrl) + '&title=' + encodeURIComponent(socialMediaSharingMessage) },
    ];

    const handleCopyLink = () => {
        navigator.clipboard.writeText(currentUrl).then(
            () => {
                alert('URL copied to clipboard! You can now share this link.');
                onClose();
            },
            (error) => {
                console.error('Failed to copy URL:', error);
                alert('An error occurred while copying the URL. Please try again.');
            }
        );
    };

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <h2>Share this product</h2>
                <div style={styles.socialButtons}>
                    {socialMediaSharingUrls.map((platform) => (
                        <button
                            key={platform.name}
                            onClick={() => window.open(platform.url, 'Share', 'width=550,height=400,menubar=no,location=no,resizable=no,scrollbars=no,status=no,toolbar=no')}
                            style={styles.socialButton}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.socialButtonHover.backgroundColor)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.socialButton.backgroundColor)}
                        >
                            Share on {platform.name}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleCopyLink}
                    style={styles.copyButton}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.copyButtonHover.backgroundColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.copyButton.backgroundColor)}
                >
                    Copy Link
                </button>
                <button
                    onClick={onClose}
                    style={styles.closeButton}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.closeButtonHover.backgroundColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.closeButton.backgroundColor)}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ShareModal;