import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FavoriteButton = ({ isFavorite, onToggle, className }) => {
  return (
    <motion.button
      whileTap={{ scale: [1, 0.8, 1.1, 1] }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        "p-2 rounded-full transition-all duration-200",
        "bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg hover:scale-110",
        "focus:outline-none focus:ring-2 focus:ring-accent/50",
        className
      )}
    >
      <ApperIcon 
        name="Heart" 
        size={20}
        className={cn(
          "transition-colors duration-200",
          isFavorite ? "fill-accent text-accent" : "text-gray-600"
        )}
      />
    </motion.button>
  );
};

export default FavoriteButton;