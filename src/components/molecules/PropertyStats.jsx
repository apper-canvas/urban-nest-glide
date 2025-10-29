import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PropertyStats = ({ bedrooms, bathrooms, squareFeet, className, size = "md" }) => {
  const sizes = {
    sm: "text-xs gap-3",
    md: "text-sm gap-4",
    lg: "text-base gap-5",
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  return (
    <div className={cn("flex items-center text-gray-600 font-body", sizes[size], className)}>
      <div className="flex items-center gap-1.5">
        <ApperIcon name="Bed" size={iconSizes[size]} className="text-primary" />
        <span className="font-medium">{bedrooms} bd</span>
      </div>
      <div className="flex items-center gap-1.5">
        <ApperIcon name="Bath" size={iconSizes[size]} className="text-primary" />
        <span className="font-medium">{bathrooms} ba</span>
      </div>
      <div className="flex items-center gap-1.5">
        <ApperIcon name="Maximize2" size={iconSizes[size]} className="text-primary" />
        <span className="font-medium">{squareFeet.toLocaleString()} sqft</span>
      </div>
    </div>
  );
};

export default PropertyStats;