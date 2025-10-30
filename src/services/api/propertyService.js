import propertiesData from "../mockData/properties.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PropertyService {
  async getAll() {
    await delay(300);
    return [...propertiesData];
  }

  async getById(id) {
    await delay(200);
    const property = propertiesData.find(p => p.Id === parseInt(id));
    if (!property) {
      throw new Error("Property not found");
    }
    return { ...property };
  }

  async search(filters = {}) {
    await delay(300);
    let results = [...propertiesData];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      results = results.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query) ||
        p.address.toLowerCase().includes(query) ||
        p.state.toLowerCase().includes(query)
      );
    }

    if (filters.priceMin !== undefined && filters.priceMin !== null) {
      results = results.filter(p => p.price >= filters.priceMin);
    }

    if (filters.priceMax !== undefined && filters.priceMax !== null) {
      results = results.filter(p => p.price <= filters.priceMax);
    }

    if (filters.bedrooms !== undefined && filters.bedrooms !== null) {
      results = results.filter(p => p.bedrooms >= filters.bedrooms);
    }

    if (filters.bathrooms !== undefined && filters.bathrooms !== null) {
      results = results.filter(p => p.bathrooms >= filters.bathrooms);
    }

    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      results = results.filter(p => filters.propertyTypes.includes(p.propertyType));
    }

    if (filters.listingTypes && filters.listingTypes.length > 0) {
      results = results.filter(p => filters.listingTypes.includes(p.listingType));
    }

    if (filters.squareFeetMin !== undefined && filters.squareFeetMin !== null) {
      results = results.filter(p => p.squareFeet >= filters.squareFeetMin);
    }

    if (filters.squareFeetMax !== undefined && filters.squareFeetMax !== null) {
      results = results.filter(p => p.squareFeet <= filters.squareFeetMax);
    }

    return results;
  }
}

export default new PropertyService();