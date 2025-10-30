import reviewsData from '../mockData/reviews.json';

// Simulate async delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ReviewService {
  constructor() {
    this.reviews = [...reviewsData];
    this.nextId = Math.max(...this.reviews.map(r => r.Id), 0) + 1;
  }

  async getAll() {
    await delay(500);
    return [...this.reviews];
  }

  async getByPropertyId(propertyId) {
    await delay(500);
    const propertyReviews = this.reviews.filter(r => r.propertyId === Number(propertyId));
    return propertyReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getById(id) {
    await delay(500);
    const review = this.reviews.find(r => r.Id === Number(id));
    if (!review) {
      throw new Error('Review not found');
    }
    return { ...review };
  }

  async create(reviewData) {
    await delay(500);
    
    // Validate required fields
    if (!reviewData.propertyId || !reviewData.rating || !reviewData.comment) {
      throw new Error('Missing required fields');
    }

    if (reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const newReview = {
      Id: this.nextId++,
      propertyId: Number(reviewData.propertyId),
      userId: reviewData.userId || Math.floor(Math.random() * 1000) + 200,
      userName: reviewData.userName || 'Anonymous User',
      userAvatar: reviewData.userAvatar || reviewData.userName?.split(' ').map(n => n[0]).join('') || 'AU',
      rating: Number(reviewData.rating),
      comment: reviewData.comment.trim(),
      date: new Date().toISOString()
    };

    this.reviews.push(newReview);
    return { ...newReview };
  }

  async update(id, updateData) {
    await delay(500);
    
    const index = this.reviews.findIndex(r => r.Id === Number(id));
    if (index === -1) {
      throw new Error('Review not found');
    }

    if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    const updatedReview = {
      ...this.reviews[index],
      ...(updateData.rating && { rating: Number(updateData.rating) }),
      ...(updateData.comment && { comment: updateData.comment.trim() }),
      date: new Date().toISOString()
    };

    this.reviews[index] = updatedReview;
    return { ...updatedReview };
  }

  async delete(id) {
    await delay(500);
    
    const index = this.reviews.findIndex(r => r.Id === Number(id));
    if (index === -1) {
      throw new Error('Review not found');
    }

    const deletedReview = { ...this.reviews[index] };
    this.reviews.splice(index, 1);
    return deletedReview;
  }

  async getAverageRating(propertyId) {
    await delay(300);
    const propertyReviews = this.reviews.filter(r => r.propertyId === Number(propertyId));
    
    if (propertyReviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = propertyReviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / propertyReviews.length;
    
    return {
      average: Math.round(average * 10) / 10,
      count: propertyReviews.length
    };
  }

  async getUserReviews(userId) {
    await delay(500);
    return this.reviews
      .filter(r => r.userId === Number(userId))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

export default new ReviewService();