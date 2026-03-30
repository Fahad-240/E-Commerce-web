import React, { useEffect, useState } from "react";
import api from "../Component/api";
import { FaStar, FaPaperPlane } from "react-icons/fa";
import "./Reviews.css";

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInlineForm, setShowInlineForm] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/${productId}`, { withCredentials: true });
      setReviews(res.data.reviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return alert("Please select a rating and write a comment!");

    setLoading(true);
    try {
      await api.post(
        "/review",
        { product_id: productId, rating, comment },
        { withCredentials: true }
      );
      setRating(0);
      setComment("");
      setShowInlineForm(false);
      fetchReviews();
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  return (
    <div className="reviews-section-container">
      <div className="reviews-header-inline">
        <h3>Customer Experiences ({reviews.length})</h3>
        <button
          className="toggle-review-btn"
          onClick={() => setShowInlineForm(!showInlineForm)}
        >
          {showInlineForm ? "Cancel Review" : "Write a Review"}
        </button>
      </div>

      {/* Inline Review Form */}
      {showInlineForm && (
        <div className="inline-review-form-wrapper">
          <form onSubmit={handleSubmit} className="premium-inline-form">
            <div className="rating-selector-block">
              <span>Your Rating:</span>
              <div className="interactive-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={(hover || rating) >= star ? "star-active" : "star-inactive"}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  />
                ))}
              </div>
            </div>

            <textarea
              placeholder="Share your experience with this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
            />

            <button type="submit" className="submit-review-inline-btn" disabled={loading}>
              {loading ? "Submitting..." : <>Submit Review <FaPaperPlane /></>}
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="premium-reviews-grid">
        {reviews.length === 0 ? (
          <div className="no-reviews-box">
            <p>No reviews yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.review_id} className="premium-review-card">
              <div className="rev-card-header">
                <div className="rev-user-info">
                  <div className="user-initials">
                    {rev.first_name?.[0]}{rev.last_name?.[0]}
                  </div>
                  <div>
                    <h4 className="rev-user-name">{rev.first_name} {rev.last_name}</h4>
                    <span className="rev-date">{new Date(rev.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="rev-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={star <= rev.rating ? "star-gold" : "star-muted"}
                    />
                  ))}
                </div>
              </div>
              <p className="rev-comment">{rev.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
