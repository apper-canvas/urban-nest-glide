import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

function StarRating({ rating = 0, onChange, readonly = false, size = 24 }) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (!readonly && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayRating;
        
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={`
              transition-all duration-200
              ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
              ${!readonly && hoverRating >= star ? 'star-hover' : ''}
              focus:outline-none focus:ring-2 focus:ring-secondary/50 rounded
            `}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          >
            <ApperIcon
              name="Star"
              size={size}
              className={`
                transition-colors duration-200
                ${isFilled 
                  ? 'text-secondary fill-secondary star-filled' 
                  : 'text-gray-300 star-empty'
                }
              `}
            />
          </button>
        );
      })}
      
      {readonly && rating > 0 && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default StarRating;