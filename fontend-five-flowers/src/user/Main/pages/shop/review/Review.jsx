import React, { useContext, useState } from 'react';
import { Rate, Input, Space, notification } from 'antd';
import axios from 'axios';
import './Review.scss';
import { CartContext } from '../../../header/components/cart/cartContext/CartProvider';

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

const Review = ({ productId }) => {
  const [reviewValue, setReviewValue] = useState(3);
  const [comment, setComment] = useState('');
  const { isLoggedIn, login } = useContext(CartContext);

  const handleReviewSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!isLoggedIn || !token) {
      notification.error({
        message: 'User not authenticated',
        description: 'You need to be logged in to submit a review.',
      });
      return;
    }

    try {
      // Giả sử token chứa thông tin userId trong payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.userId;

      const response = await axios.post(
        'http://localhost:8080/api/v1/reviews/add',
        {
          comment,
          rating: reviewValue,
          product: { productId: productId },
          user: { id: userId },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        notification.success({
          message: 'Review Submitted',
          description: 'Your review has been submitted successfully.',
        });
        setComment('');
        setReviewValue(3);
      }
    } catch (error) {
      notification.error({
        message: 'Submission Error',
        description: 'There was an error submitting your review. Please try again.',
      });
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="review-container">
      <h2>Leave a Review</h2>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Rate
          allowHalf
          tooltips={desc}
          onChange={setReviewValue}
          value={reviewValue}
        />
        {reviewValue ? <span>{desc[Math.ceil(reviewValue) - 1]}</span> : null}
        <Input.TextArea
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="submit-review-btn" onClick={handleReviewSubmit}>
          Submit Review
        </button>
      </Space>
    </div>
  );
};

export default Review;
