import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const FilterSidebar = ({ filters, onFiltersChange, onReset }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      priceMin: null,
      priceMax: null,
      bedrooms: null,
      bathrooms: null,
      propertyTypes: [],
      listingTypes: [],
      squareFeetMin: null,
      squareFeetMax: null,
      searchQuery: ""
    };
    setLocalFilters(resetFilters);
    onReset();
  };

  const toggleArrayFilter = (key, value) => {
    const current = localFilters[key] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    handleChange(key, updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg shadow-card p-6 sticky top-20 max-h-[calc(100vh-96px)] overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-gray-900">Filters</h2>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <ApperIcon name="RotateCw" size={16} className="mr-1" />
          Reset
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Min</label>
              <Input
                type="number"
                placeholder="Any"
                value={localFilters.priceMin || ""}
                onChange={(e) => handleChange("priceMin", e.target.value ? parseInt(e.target.value) : null)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Max</label>
              <Input
                type="number"
                placeholder="Any"
                value={localFilters.priceMax || ""}
                onChange={(e) => handleChange("priceMax", e.target.value ? parseInt(e.target.value) : null)}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Bedrooms
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => handleChange("bedrooms", localFilters.bedrooms === num ? null : num)}
                className={`py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  localFilters.bedrooms === num
                    ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {num}+
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Bathrooms
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => handleChange("bathrooms", localFilters.bathrooms === num ? null : num)}
                className={`py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  localFilters.bathrooms === num
                    ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {num}+
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Property Type
          </label>
          <div className="space-y-2">
            {["Single Family", "Condo", "Townhouse"].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(localFilters.propertyTypes || []).includes(type)}
                  onChange={() => toggleArrayFilter("propertyTypes", type)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-accent cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Square Feet
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Min</label>
              <Input
                type="number"
                placeholder="Any"
                value={localFilters.squareFeetMin || ""}
                onChange={(e) => handleChange("squareFeetMin", e.target.value ? parseInt(e.target.value) : null)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Max</label>
              <Input
                type="number"
                placeholder="Any"
                value={localFilters.squareFeetMax || ""}
                onChange={(e) => handleChange("squareFeetMax", e.target.value ? parseInt(e.target.value) : null)}
              />
            </div>
          </div>
        </div>

        <Button variant="primary" className="w-full" onClick={handleApply}>
          <ApperIcon name="Filter" size={18} className="mr-2" />
          Apply Filters
        </Button>
      </div>
    </motion.div>
  );
};

export default FilterSidebar;