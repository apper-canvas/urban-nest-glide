const STORAGE_KEY = "urbanNestFavorites";

class FavoritesService {
  getFavorites() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading favorites:", error);
      return [];
    }
  }

  isFavorite(propertyId) {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav.propertyId === propertyId);
  }

  addFavorite(propertyId) {
    try {
      const favorites = this.getFavorites();
      if (!this.isFavorite(propertyId)) {
        const newFavorite = {
          propertyId: propertyId,
          savedTimestamp: Date.now()
        };
        favorites.push(newFavorite);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      }
      return favorites;
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  }

  removeFavorite(propertyId) {
    try {
      let favorites = this.getFavorites();
      favorites = favorites.filter(fav => fav.propertyId !== propertyId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      return favorites;
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw error;
    }
  }

  getFavoriteIds() {
    return this.getFavorites().map(fav => fav.propertyId);
  }

  clearFavorites() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing favorites:", error);
      throw error;
    }
  }
}

export default new FavoritesService();