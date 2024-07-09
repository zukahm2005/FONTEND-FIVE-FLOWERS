import React from "react";
import { Route, Routes } from "react-router-dom";
import GetAllCommentReview from "./getAllComentReview/GetAllComentReview";
import GetAllReviewedProducts from "./getAllProductReview/GetAllReviewedProducts";

const CommentReviewAdmin = () => {
  return (
    <div className="comment-review-admin-container">
      <Routes>
        <Route index element={<GetAllReviewedProducts />} />
        <Route path=":productId" element={<GetAllCommentReview />} />
      </Routes>
    </div>
  );
};

export default CommentReviewAdmin;
