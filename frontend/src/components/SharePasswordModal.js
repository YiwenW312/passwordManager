import React, { useState } from 'react';
import '../styles/SharePasswordModal.css';

const SharePasswordModal = ({ close, currentUser }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShare = async e => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please login again.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/sharerequests/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fromUserId: currentUser.userId,
          toUsername: username,
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to send share request.');
      }

      alert('Share request sent successfully.');
      handleModalClose();
    } catch (error) {
      console.error('Send failed:', error);
      setError(error.message);
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setUsername('');
    setError('');
    setIsSubmitting(false);
    close();
  };

  return (
    <div className='share-password-modal'>
      <div className='modal-content'>
        <span className='close' onClick={handleModalClose}>
          &times;
        </span>
        <h2>Share Password</h2>
        {error && <p className='error-message'>{error}</p>}
        <form onSubmit={handleShare}>
          <input
            type='text'
            placeholder='Enter username to share with'
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Sharing...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SharePasswordModal;

