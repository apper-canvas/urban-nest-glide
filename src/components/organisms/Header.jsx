import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/layouts/Root";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import favoritesService from "@/services/api/favoritesService";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const Header = () => {
  const navigate = useNavigate();
const [favoriteCount, setFavoriteCount] = useState(0);
  const { logout } = useAuth();
  const { user, isAuthenticated } = useSelector((state) => state.user);

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

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <ApperIcon name="Building2" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-gray-900 group-hover:text-primary transition-colors">
                Urban Nest
              </h1>
              <p className="text-xs font-body text-gray-500">Find Your Dream Home</p>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium font-body text-gray-700 hover:text-primary hover:bg-primary/5 transition-all"
            >
              <ApperIcon name="Search" size={18} />
              <span>Browse</span>
            </Link>
            
            <Link
              to="/saved"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium font-body text-gray-700 hover:text-primary hover:bg-primary/5 transition-all relative"
            >
              <ApperIcon name="Heart" size={18} />
              <span>Saved</span>
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-600">
                  {user?.firstName || user?.emailAddress}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="LogOut" size={16} />
                  Logout
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
);
};

export default Header;