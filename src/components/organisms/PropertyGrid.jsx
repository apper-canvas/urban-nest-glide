import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import Empty from "@/components/ui/Empty";

const PropertyGrid = ({ properties, favoriteIds, onToggleFavorite, onResetFilters }) => {
  if (properties.length === 0) {
    return (
      <Empty
        title="No properties found"
        message="Try adjusting your filters to see more results."
        action={onResetFilters}
        actionLabel="Reset Filters"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, index) => (
        <motion.div
          key={property.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <PropertyCard
            property={property}
            isFavorite={favoriteIds.includes(property.Id)}
            onToggleFavorite={() => onToggleFavorite(property.Id)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default PropertyGrid;