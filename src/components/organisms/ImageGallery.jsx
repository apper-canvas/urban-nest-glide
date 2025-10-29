import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ImageGallery = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="relative">
        <div className="aspect-video rounded-lg overflow-hidden bg-gray-200 shadow-lg">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`${alt} - Image ${currentIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <ApperIcon name="ChevronLeft" size={24} className="text-primary" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <ApperIcon name="ChevronRight" size={24} className="text-primary" />
            </button>
          </>
        )}

        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute bottom-4 right-4 px-4 py-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-lg flex items-center gap-2 hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <ApperIcon name="Maximize2" size={18} className="text-primary" />
          <span className="text-sm font-medium text-gray-900">View Full</span>
        </button>

        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm shadow-lg text-sm font-medium text-gray-900">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`aspect-video rounded-lg overflow-hidden transition-all duration-200 ${
              idx === currentIndex
                ? "ring-2 ring-accent shadow-lg scale-105"
                : "ring-1 ring-gray-200 hover:ring-accent hover:scale-105"
            }`}
          >
            <img src={img} alt={`${alt} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <Button
              onClick={() => setIsFullscreen(false)}
              variant="ghost"
              className="absolute top-4 right-4 text-white hover:bg-white/10"
            >
              <ApperIcon name="X" size={24} />
            </Button>

            <div className="relative max-w-7xl w-full">
              <img
                src={images[currentIndex]}
                alt={`${alt} - Full size`}
                className="w-full h-auto max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevious();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <ApperIcon name="ChevronLeft" size={28} className="text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <ApperIcon name="ChevronRight" size={28} className="text-white" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;