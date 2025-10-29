import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import favoritesService from "@/services/api/favoritesService";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setFavoriteCount(favoritesService.getFavorites().length);
    };

    updateCount();
    window.addEventListener("favoritesUpdated", updateCount);
    
    return () => {
      window.removeEventListener("favoritesUpdated", updateCount);
    };
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <ApperIcon name="Home" size={24} className="text-white" />
            </div>
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Urban Nest
            </span>
          </Link>

          <nav className="flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary font-body font-medium transition-colors duration-200 hidden sm:block"
            >
              Browse Properties
            </Link>
            
            <button
              onClick={() => navigate("/saved")}
              className="relative flex items-center gap-2 text-gray-700 hover:text-primary font-body font-medium transition-all duration-200 group"
            >
              <div className="relative">
                <ApperIcon 
                  name="Heart" 
                  size={24} 
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                {favoriteCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Badge variant="accent" className="min-w-[20px] h-5 flex items-center justify-center">
                      {favoriteCount}
                    </Badge>
                  </motion.div>
                )}
              </div>
              <span className="hidden sm:inline">Saved</span>
            </button>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;