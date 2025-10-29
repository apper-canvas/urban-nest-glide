import { getApperClient } from "@/services/apperClient";

class ReviewService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "property_id_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "user_name_c" } },
          { field: { Name: "user_avatar_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "comment_c" } },
          { field: { Name: "date_c" } }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords("review_c", params);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch reviews");
      }

      return (response.data || []).map(this._transformReview);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  }

  async getByPropertyId(propertyId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "property_id_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "user_name_c" } },
          { field: { Name: "user_avatar_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "comment_c" } },
          { field: { Name: "date_c" } }
        ],
        where: [
          {
            FieldName: "property_id_c",
            Operator: "EqualTo",
            Values: [parseInt(propertyId)]
          }
        ],
        orderBy: [{ fieldName: "date_c", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords("review_c", params);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch reviews");
      }

      return (response.data || []).map(this._transformReview);
    } catch (error) {
      console.error(`Error fetching reviews for property ${propertyId}:`, error);
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
          { field: { Name: "property_id_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "user_name_c" } },
          { field: { Name: "user_avatar_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "comment_c" } },
          { field: { Name: "date_c" } }
        ]
      };

      const response = await apperClient.getRecordById("review_c", parseInt(id), params);

      if (!response.success) {
        throw new Error(response.message || "Review not found");
      }

      if (!response.data) {
        throw new Error("Review not found");
      }

      return this._transformReview(response.data);
    } catch (error) {
      console.error(`Error fetching review ${id}:`, error);
      throw error;
    }
  }

  async create(reviewData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Validate required fields
      if (!reviewData.propertyId || !reviewData.rating || !reviewData.comment) {
        throw new Error("Missing required fields");
      }

      if (reviewData.rating < 1 || reviewData.rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }

      const params = {
        records: [
          {
            property_id_c: parseInt(reviewData.propertyId),
            user_id_c: reviewData.userId || 999,
            user_name_c: reviewData.userName || "Anonymous User",
            user_avatar_c: reviewData.userAvatar || "AU",
            rating_c: parseInt(reviewData.rating),
            comment_c: reviewData.comment.trim(),
            date_c: new Date().toISOString()
          }
        ]
      };

      const response = await apperClient.createRecord("review_c", params);

      if (!response.success) {
        throw new Error(response.message || "Failed to create review");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} reviews:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(error.message || error);
              });
            }
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }

        if (successful.length > 0) {
          return this._transformReview(successful[0].data);
        }
      }

      throw new Error("Failed to create review");
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
        throw new Error("Rating must be between 1 and 5");
      }

      const record = {
        Id: parseInt(id)
      };

      if (updateData.rating) {
        record.rating_c = parseInt(updateData.rating);
      }

      if (updateData.comment) {
        record.comment_c = updateData.comment.trim();
      }

      const params = {
        records: [record]
      };

      const response = await apperClient.updateRecord("review_c", params);

      if (!response.success) {
        throw new Error(response.message || "Failed to update review");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} reviews:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(error.message || error);
              });
            }
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }

        if (successful.length > 0) {
          return this._transformReview(successful[0].data);
        }
      }

      throw new Error("Failed to update review");
    } catch (error) {
      console.error(`Error updating review ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("review_c", params);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete review");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} reviews:`, failed);
          failed.forEach(record => {
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting review ${id}:`, error);
      throw error;
    }
  }

  async getAverageRating(propertyId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [{ field: { Name: "rating_c" } }],
        where: [
          {
            FieldName: "property_id_c",
            Operator: "EqualTo",
            Values: [parseInt(propertyId)]
          }
        ],
        aggregators: [
          {
            id: "avgRating",
            fields: [{ field: { Name: "rating_c" }, Function: "Count" }],
            where: []
          }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords("review_c", params);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch average rating");
      }

      const reviews = response.data || [];
      const count = reviews.length;

      if (count === 0) {
        return { average: 0, count: 0 };
      }

      const sum = reviews.reduce((acc, review) => acc + (review.rating_c || 0), 0);
      const average = sum / count;

      return {
        average: Math.round(average * 10) / 10,
        count: count
      };
    } catch (error) {
      console.error(`Error fetching average rating for property ${propertyId}:`, error);
      throw error;
    }
  }

  async getUserReviews(userId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "property_id_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "user_name_c" } },
          { field: { Name: "user_avatar_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "comment_c" } },
          { field: { Name: "date_c" } }
        ],
        where: [
          {
            FieldName: "user_id_c",
            Operator: "EqualTo",
            Values: [parseInt(userId)]
          }
        ],
        orderBy: [{ fieldName: "date_c", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords("review_c", params);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch user reviews");
      }

      return (response.data || []).map(this._transformReview);
    } catch (error) {
      console.error(`Error fetching reviews for user ${userId}:`, error);
      throw error;
    }
  }

  _transformReview(review) {
    return {
      Id: review.Id,
      propertyId: review.property_id_c?.Id || review.property_id_c,
      userId: review.user_id_c || 0,
      userName: review.user_name_c || "Anonymous",
      userAvatar: review.user_avatar_c || "A",
      rating: review.rating_c || 0,
      comment: review.comment_c || "",
      date: review.date_c || new Date().toISOString()
    };
  }
}

export default new ReviewService();

export default new ReviewService();