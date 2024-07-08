import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ReviewsList.scss'; // Import CSS

const defaultAvatarUrl = "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"; // URL của hình ảnh mặc định

const ReviewsList = ({ productId }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (productId) {
            axios.get(`/api/v1/reviews/product/${productId}`)
                .then(response => {
                    const reviewData = response.data.map(review => ({
                        ...review,
                        userName: review.user.userName,
                        productName: review.product.productName,
                        createdAt: review.createdAt
                    }));
                    setReviews(reviewData);
                })
                .catch(error => {
                    console.error("There was an error fetching the reviews!", error);
                });
        }
    }, [productId]);

    const formatDate = (dateArray) => {
      if (Array.isArray(dateArray)) {
          const [year, month, day] = dateArray;
          return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
      return 'Invalid Date';
  };

    const ReviewItem = ({ review }) => {
        return (
            <div className="review-item">
                <div className="review-header">
                    <div className="review-user">
                        <img src={defaultAvatarUrl} alt="User Avatar" className="review-avatar" />
                        <div className="review-user-info">
                            <span className="review-username">{review.userName}</span>
                            <span className="review-date">{formatDate(review.createdAt)}</span>
                        </div>
                    </div>
                    <div className="review-rating">
                        <span className="stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    </div>
                </div>
                <div className="review-content">
                    <p>{review.comment}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="reviews-list">
            {reviews.map(review => (
                <ReviewItem key={review.reviewId} review={review} />
            ))}
        </div>
    );
};

export default ReviewsList;
