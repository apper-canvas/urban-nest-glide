import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No properties found",
  message = "Try adjusting your filters to see more results.",
  action,
  actionLabel = "Reset Filters",
  icon = "Home"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center min-h-[400px] p-6"
    >
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 mb-6">
          <ApperIcon name={icon} className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-display font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 font-body mb-8 leading-relaxed">
          {message}
        </p>
        {action && (
          <Button onClick={action} variant="primary" size="lg">
            {actionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;