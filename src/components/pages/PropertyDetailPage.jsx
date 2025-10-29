import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import propertyService from "@/services/api/propertyService";
import favoritesService from "@/services/api/favoritesService";
import reviewService from "@/services/api/reviewService";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ImageGallery from "@/components/organisms/ImageGallery";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import PriceTag from "@/components/molecules/PriceTag";
import PropertyStats from "@/components/molecules/PropertyStats";
import FavoriteButton from "@/components/molecules/FavoriteButton";
import StarRating from "@/components/molecules/StarRating";
import ReviewForm from "@/components/molecules/ReviewForm";
import ReviewCard from "@/components/molecules/ReviewCard";
const ContactDialog = ({ isOpen, onClose, type, propertyTitle }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredDate: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (type === "message" && !formData.message) {
      toast.error("Please enter your message");
      return;
    }

    if (type === "viewing" && !formData.preferredDate) {
      toast.error("Please select your preferred date");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Simulate form submission
    const message = type === "message" 
      ? "Your message has been sent successfully!" 
      : "Viewing request sent! We'll contact you shortly.";
    
    toast.success(message);
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      preferredDate: ""
    });
    
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-card-hover max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-display text-primary mb-1">
                  {type === "message" ? "Send Message" : "Schedule Viewing"}
                </h2>
                <p className="text-sm text-gray-600">{propertyTitle}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close dialog"
              >
                <ApperIcon name="X" size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>

              {type === "message" ? (
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    placeholder="I'm interested in this property..."
                    required
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-white hover:bg-primary-dark"
                >
                  {type === "message" ? "Send Message" : "Schedule Viewing"}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [isFavorite, setIsFavorite] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [contactType, setContactType] = useState("message");
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [averageRating, setAverageRating] = useState({ average: 0, count: 0 });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
useEffect(() => {
    loadProperty();
    checkFavorite();
    loadReviews();
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getById(id);
      setProperty(data);
    } catch (err) {
      setError(err.message);
toast.error("Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    setReviewLoading(true);
    try {
      const [reviewsData, ratingData] = await Promise.all([
        reviewService.getByPropertyId(id),
        reviewService.getAverageRating(id)
      ]);
      setReviews(reviewsData);
      setAverageRating(ratingData);
    } catch (error) {
      console.info(`apper_info: Got an error in reviewService.getByPropertyId. The error is: ${error.message}`);
      toast.error("Failed to load reviews");
    } finally {
      setReviewLoading(false);
    }
  };

  const checkFavorite = () => {
    setIsFavorite(favoritesService.isFavorite(parseInt(id)));
  };

  const handleToggleFavorite = () => {
    try {
      if (isFavorite) {
        favoritesService.removeFavorite(parseInt(id));
        toast.info("Property removed from favorites");
      } else {
        favoritesService.addFavorite(parseInt(id));
        toast.success("Property added to favorites");
      }
      setIsFavorite(!isFavorite);
      window.dispatchEvent(new Event("favoritesUpdated"));
    } catch (err) {
      toast.error("Failed to update favorites");
    }
  };

const handleContact = () => {
    setContactType("message");
    setIsContactDialogOpen(true);
  };

  const handleSchedule = () => {
    setContactType("viewing");
    setIsContactDialogOpen(true);
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    loadReviews();
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    setIsSubmitting(true);
    try {
      await reviewService.delete(reviewId);
      toast.success('Review deleted successfully');
      loadReviews();
    } catch (error) {
      console.info(`apper_info: Got an error in reviewService.delete. The error is: ${error.message}`);
      toast.error(error.message || 'Failed to delete review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
    setEditingReview(null);
  };
  if (loading) return <Loading type="detail" />;
  if (error) return <Error message={error} onRetry={loadProperty} />;
  if (!property) return <Error message="Property not found" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
        Back to Properties
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ImageGallery images={property.images} alt={property.title} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <PriceTag price={property.price} />
                  <Badge variant="primary">{property.propertyType}</Badge>
                  <Badge variant="secondary">{property.listingType}</Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <ApperIcon name="MapPin" size={20} className="text-primary" />
                  <span className="font-body">
                    {property.address}, {property.city}, {property.state} {property.zipCode}
                  </span>
                </div>
                <PropertyStats
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  squareFeet={property.squareFeet}
                  size="lg"
                />
              </div>
<FavoriteButton
                isFavorite={isFavorite}
                onToggle={handleToggleFavorite}
                className="mt-2"
              />
            </div>

            <div className="prose max-w-none mt-8">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 font-body leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20"
                  >
                    <ApperIcon name="Check" size={18} className="text-primary flex-shrink-0" />
                    <span className="text-sm font-body text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-white shadow-card">
                <p className="text-sm text-gray-600 mb-1">Year Built</p>
                <p className="text-lg font-display font-bold text-gray-900">{property.yearBuilt}</p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-card">
                <p className="text-sm text-gray-600 mb-1">Parking</p>
                <p className="text-lg font-display font-bold text-gray-900">{property.parking}</p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-card">
                <p className="text-sm text-gray-600 mb-1">Pet Friendly</p>
                <p className="text-lg font-display font-bold text-gray-900">
                  {property.petFriendly ? "Yes" : "No"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-card">
                <p className="text-sm text-gray-600 mb-1">Listed</p>
                <p className="text-lg font-display font-bold text-gray-900">
                  {format(new Date(property.dateListedTimestamp), "MMM d, yyyy")}
                </p>
              </div>
</div>

            {/* Reviews Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-gray-900">
                    Community Reviews
                  </h2>
                  {averageRating.count > 0 && (
                    <div className="flex items-center gap-3 mt-2">
                      <StarRating rating={averageRating.average} readonly size={20} />
                      <span className="text-sm text-gray-600">
                        Based on {averageRating.count} review{averageRating.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
                {!showReviewForm && (
                  <Button onClick={() => setShowReviewForm(true)}>
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Write Review
                  </Button>
                )}
              </div>

              {showReviewForm && (
                <div className="mb-6">
                  <ReviewForm
                    propertyId={id}
                    existingReview={editingReview}
                    onSuccess={handleReviewSuccess}
                    onCancel={handleCancelReview}
                  />
                </div>
              )}

              {reviewLoading ? (
                <div className="flex justify-center py-12">
                  <Loading type="spinner" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <ApperIcon name="MessageSquare" size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">No reviews yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Be the first to share your experience
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review.Id}
                      review={review}
                      currentUserId={999}
                      onEdit={handleEditReview}
                      onDelete={handleDeleteReview}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-card p-6 sticky top-20"
          >
            <h3 className="text-xl font-display font-bold text-gray-900 mb-6">
              Contact Agent
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                  <ApperIcon name="User" size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{property.contactName}</p>
                  <p className="text-sm text-gray-600">Real Estate Agent</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <ApperIcon name="Phone" size={20} className="text-primary" />
                <span className="font-body">{property.contactPhone}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <ApperIcon name="Mail" size={20} className="text-primary" />
                <span className="font-body break-all">{property.contactEmail}</span>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full mb-3"
              onClick={handleContact}
            >
              <ApperIcon name="MessageCircle" size={20} className="mr-2" />
              Send Message
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleContact}
            >
              <ApperIcon name="Phone" size={20} className="mr-2" />
              Schedule Viewing
            </Button>
          </motion.div>
        </div>
      </div>
<ContactDialog
        isOpen={isContactDialogOpen}
        onClose={() => setIsContactDialogOpen(false)}
        type={contactType}
        propertyTitle={property?.title}
      />
    </div>
  );
};

export default PropertyDetailPage;