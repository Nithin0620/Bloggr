import React, { useEffect, useCallback } from 'react';
import { IoClose } from 'react-icons/io5';
import { HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi';

const ImageLightbox = ({ images, currentIndex, onClose, onPrev, onNext }) => {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onPrev();
    if (e.key === 'ArrowRight') onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!images || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10 p-2 rounded-full bg-black/50 hover:bg-black/70"
      >
        <IoClose size={24} />
      </button>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-4 text-white/80 hover:text-white transition-colors z-10 p-3 rounded-full bg-black/50 hover:bg-black/70"
          >
            <HiOutlineArrowLeft size={24} />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 text-white/80 hover:text-white transition-colors z-10 p-3 rounded-full bg-black/50 hover:bg-black/70"
          >
            <HiOutlineArrowRight size={24} />
          </button>
        </>
      )}

      {/* Image container */}
      <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt={`Lightbox image ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-fadeIn"
        />
      </div>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/80 text-sm bg-black/50 px-3 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default ImageLightbox;
