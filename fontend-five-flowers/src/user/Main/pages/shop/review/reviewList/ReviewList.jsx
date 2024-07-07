import React, { useState, useContext } from 'react';
import { Rate, Input, Button, Space, notification } from 'antd';
import axios from 'axios';
import './Review.scss'; // Import file SCSS
import { AuthContext } from '../../context/AuthContext'; // Import context xác thực

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

const Review = ({ productId }) => {
  const { token } = useContext(AuthContext); // Lấy token từ context xác thực
  const [reviewValue, setReviewValue] = useState(3);
  const [comment, setComment] = useState('');

  const handleReviewSubmit = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/reviews/add',
        {
          productId,
          rating: reviewValue,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        }
      );
      if (response.status === 200) {
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
