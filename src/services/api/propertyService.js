import { getApperClient } from "@/services/apperClient";

class PropertyService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "zip_code_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "bedrooms_c" } },
          { field: { Name: "bathrooms_c" } },
          { field: { Name: "square_feet_c" } },
          { field: { Name: "property_type_c" } },
          { field: { Name: "listing_type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "amenities_c" } },
          { field: { Name: "year_built_c" } },
          { field: { Name: "parking_c" } },
          { field: { Name: "pet_friendly_c" } },
          { field: { Name: "date_listed_timestamp_c" } },
          { field: { Name: "contact_name_c" } },
          { field: { Name: "contact_phone_c" } },
          { field: { Name: "contact_email_c" } },
          { field: { Name: "latitude_c" } },
          { field: { Name: "longitude_c" } }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords("property_c", params);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch properties");
      }

      return (response.data || []).map(this._transformProperty);
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "zip_code_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "bedrooms_c" } },
          { field: { Name: "bathrooms_c" } },
          { field: { Name: "square_feet_c" } },
          { field: { Name: "property_type_c" } },
          { field: { Name: "listing_type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "amenities_c" } },
          { field: { Name: "year_built_c" } },
          { field: { Name: "parking_c" } },
          { field: { Name: "pet_friendly_c" } },
          { field: { Name: "date_listed_timestamp_c" } },
          { field: { Name: "contact_name_c" } },
          { field: { Name: "contact_phone_c" } },
          { field: { Name: "contact_email_c" } },
          { field: { Name: "latitude_c" } },
          { field: { Name: "longitude_c" } }
        ]
      };

      const response = await apperClient.getRecordById("property_c", parseInt(id), params);

      if (!response.success) {
        throw new Error(response.message || "Property not found");
      }

      if (!response.data) {
        throw new Error("Property not found");
      }

      return this._transformProperty(response.data);
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error);
      throw error;
    }
  }

  async search(filters = {}) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const where = [];
      const whereGroups = [];

      // Search query - search across multiple fields
      if (filters.searchQuery) {
        const query = filters.searchQuery;
        whereGroups.push({
          operator: "OR",
          subGroups: [
            {
              conditions: [
                { fieldName: "title_c", operator: "Contains", values: [query] },
                { fieldName: "city_c", operator: "Contains", values: [query] },
                { fieldName: "address_c", operator: "Contains", values: [query] },
                { fieldName: "state_c", operator: "Contains", values: [query] }
              ],
              operator: "OR"
            }
          ]
        });
      }

      // Price range
      if (filters.priceMin !== undefined && filters.priceMin !== null) {
        where.push({
          FieldName: "price_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.priceMin]
        });
      }

      if (filters.priceMax !== undefined && filters.priceMax !== null) {
        where.push({
          FieldName: "price_c",
          Operator: "LessThanOrEqualTo",
          Values: [filters.priceMax]
        });
      }

      // Bedrooms
      if (filters.bedrooms !== undefined && filters.bedrooms !== null) {
        where.push({
          FieldName: "bedrooms_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bedrooms]
        });
      }

      // Bathrooms
      if (filters.bathrooms !== undefined && filters.bathrooms !== null) {
        where.push({
          FieldName: "bathrooms_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bathrooms]
        });
      }

      // Property types
      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        where.push({
          FieldName: "property_type_c",
          Operator: "ExactMatch",
          Values: filters.propertyTypes,
          Include: true
        });
      }

      // Listing types
      if (filters.listingTypes && filters.listingTypes.length > 0) {
        where.push({
          FieldName: "listing_type_c",
          Operator: "ExactMatch",
          Values: filters.listingTypes,
          Include: true
        });
      }

      // Square feet range
      if (filters.squareFeetMin !== undefined && filters.squareFeetMin !== null) {
        where.push({
          FieldName: "square_feet_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.squareFeetMin]
        });
      }

      if (filters.squareFeetMax !== undefined && filters.squareFeetMax !== null) {
        where.push({
          FieldName: "square_feet_c",
          Operator: "LessThanOrEqualTo",
          Values: [filters.squareFeetMax]
        });
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "zip_code_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "bedrooms_c" } },
          { field: { Name: "bathrooms_c" } },
          { field: { Name: "square_feet_c" } },
          { field: { Name: "property_type_c" } },
          { field: { Name: "listing_type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "amenities_c" } },
          { field: { Name: "year_built_c" } },
          { field: { Name: "parking_c" } },
          { field: { Name: "pet_friendly_c" } },
          { field: { Name: "date_listed_timestamp_c" } },
          { field: { Name: "contact_name_c" } },
          { field: { Name: "contact_phone_c" } },
          { field: { Name: "contact_email_c" } },
          { field: { Name: "latitude_c" } },
          { field: { Name: "longitude_c" } }
        ],
        where: where,
        whereGroups: whereGroups.length > 0 ? whereGroups : undefined,
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords("property_c", params);

      if (!response.success) {
        throw new Error(response.message || "Failed to search properties");
      }

      return (response.data || []).map(this._transformProperty);
    } catch (error) {
      console.error("Error searching properties:", error);
      throw error;
    }
  }

  _transformProperty(property) {
    return {
      Id: property.Id,
      title: property.title_c || "",
      address: property.address_c || "",
      city: property.city_c || "",
      state: property.state_c || "",
      zipCode: property.zip_code_c || "",
      price: property.price_c || 0,
      bedrooms: property.bedrooms_c || 0,
      bathrooms: property.bathrooms_c || 0,
      squareFeet: property.square_feet_c || 0,
      propertyType: property.property_type_c || "",
      listingType: property.listing_type_c || "",
      description: property.description_c || "",
      images: property.images_c ? property.images_c.split('\n').filter(Boolean) : [],
      amenities: property.amenities_c ? property.amenities_c.split('\n').filter(Boolean) : [],
      yearBuilt: property.year_built_c || 0,
      parking: property.parking_c || "",
      petFriendly: property.pet_friendly_c || false,
      dateListedTimestamp: property.date_listed_timestamp_c || 0,
      contactName: property.contact_name_c || "",
      contactPhone: property.contact_phone_c || "",
      contactEmail: property.contact_email_c || "",
      latitude: property.latitude_c || 0,
      longitude: property.longitude_c || 0
    };
  }
}

export default new PropertyService();