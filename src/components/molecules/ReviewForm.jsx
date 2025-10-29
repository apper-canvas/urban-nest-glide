import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import StarRating from '@/components/molecules/StarRating';
import reviewService from '@/services/api/reviewService';

function ReviewForm({ propertyId, existingReview, onSuccess, onCancel }) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(existingReview?.comment?.length || 0);

  const MAX_CHARS = 500;
  const isEdit = !!existingReview;

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
      setCharCount(existingReview.comment.length);
    }
  }, [existingReview]);

  const handleCommentChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setComment(value);
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a review');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Review must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEdit) {
        await reviewService.update(existingReview.Id, { rating, comment });
        toast.success('Review updated successfully');
      } else {
        await reviewService.create({
          propertyId,
          rating,
          comment,
          userName: 'Current User',
          userAvatar: 'CU',
          userId: 999
        });
        toast.success('Review submitted successfully');
      }

      if (onSuccess) {
        onSuccess();
      }

      // Reset form if not editing
      if (!isEdit) {
        setRating(0);
        setComment('');
        setCharCount(0);
      }
    } catch (error) {
      console.info(`apper_info: Got an error in reviewService.${isEdit ? 'update' : 'create'}. The error is: ${error.message}`);
      toast.error(error.message || `Failed to ${isEdit ? 'update' : 'submit'} review`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      setRating(0);
      setComment('');
      setCharCount(0);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-lg border border-gray-200 p-6 space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating
        </label>
        <StarRating rating={rating} onChange={setRating} size={32} />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={handleCommentChange}
          placeholder="Share your experience with this property..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            Minimum 10 characters
          </span>
          <span className={`text-xs ${charCount > MAX_CHARS * 0.9 ? 'text-warning' : 'text-gray-500'}`}>
            {charCount}/{MAX_CHARS}
          </span>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancelClick}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || rating === 0 || !comment.trim()}
        >
          {isSubmitting ? 'Submitting...' : isEdit ? 'Update Review' : 'Submit Review'}
        </Button>
      </div>
    </motion.form>
  );
}

export default ReviewForm;