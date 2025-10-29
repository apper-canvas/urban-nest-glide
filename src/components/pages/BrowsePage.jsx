import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import propertyService from "@/services/api/propertyService";
import favoritesService from "@/services/api/favoritesService";
import SearchBar from "@/components/molecules/SearchBar";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";

const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [filters, setFilters] = useState({
    priceMin: null,
    priceMax: null,
    bedrooms: null,
    bathrooms: null,
    propertyTypes: [],
    listingTypes: [],
    squareFeetMin: null,
    squareFeetMax: null,
    searchQuery: searchParams.get("q") || ""
  });

  useEffect(() => {
    loadProperties();
    loadFavorites();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.search(filters);
      setProperties(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const ids = favoritesService.getFavoriteIds();
    setFavoriteIds(ids);
  };

  const handleSearch = (query) => {
    const updated = { ...filters, searchQuery: query };
    setFilters(updated);
    applyFilters(updated);
    
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = async (filterValues) => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.search(filterValues);
      setProperties(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to apply filters");
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
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
    setFilters(resetFilters);
    setSearchParams({});
    applyFilters(resetFilters);
  };

  const handleToggleFavorite = (propertyId) => {
    const isFavorite = favoriteIds.includes(propertyId);
    
    try {
      if (isFavorite) {
        favoritesService.removeFavorite(propertyId);
        toast.info("Property removed from favorites");
      } else {
        favoritesService.addFavorite(propertyId);
        toast.success("Property added to favorites");
      }
      
      loadFavorites();
      window.dispatchEvent(new Event("favoritesUpdated"));
    } catch (err) {
      toast.error("Failed to update favorites");
    }
  };

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadProperties} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
          Find Your Dream Home
        </h1>
        <p className="text-gray-600 font-body">
          Browse through our collection of premium properties
        </p>
      </div>

      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600 font-body">
          <span className="font-semibold text-primary">{properties.length}</span> properties found
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 hidden lg:block">
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />
        </div>

        <div className="lg:col-span-3">
          <PropertyGrid
            properties={properties}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;