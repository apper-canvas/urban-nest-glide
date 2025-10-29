import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import StarRating from '@/components/molecules/StarRating';

function ReviewCard({ review, currentUserId, onEdit, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isOwnReview = review.userId === currentUserId;

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(review.Id);
    }
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(review);
    }
  };

  const formattedDate = format(new Date(review.date), 'MMM dd, yyyy');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 hover:shadow-card transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
            {review.userAvatar}
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900">{review.userName}</h4>
            <div className="flex items-center gap-3 mt-1">
              <StarRating rating={review.rating} readonly size={16} />
              <span className="text-sm text-gray-500">{formattedDate}</span>
            </div>
          </div>
        </div>

        {isOwnReview && !showDeleteConfirm && (
          <div className="flex gap-2">
            <button
              onClick={handleEditClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Edit review"
            >
              <ApperIcon name="Pencil" size={16} className="text-gray-600" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Delete review"
            >
              <ApperIcon name="Trash2" size={16} className="text-red-600" />
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-700 leading-relaxed">{review.comment}</p>

      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3"
        >
          <div className="flex items-start gap-3">
            <ApperIcon name="AlertCircle" size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Delete Review</p>
              <p className="text-sm text-red-700 mt-1">
                Are you sure you want to delete this review? This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelDelete}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 border-red-600"
            >
              Delete
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default ReviewCard;