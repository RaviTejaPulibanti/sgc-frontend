// src/components/clubs/ClubGallery.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Image as ImageLucide  // Renamed to avoid conflict with Next.js Image
} from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import Modal from '@/components/ui/Modal';

interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: Date;
}

interface ClubGalleryProps {
  clubId: string;
}

const ClubGallery: React.FC<ClubGalleryProps> = ({ clubId }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    fetchImages();
  }, [clubId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      // TODO: Fetch images from API
      // Mock data for now
      setImages([
        { id: '1', url: '/gallery/1.jpg', caption: 'Event 2024', uploadedAt: new Date() },
        { id: '2', url: '/gallery/2.jpg', caption: 'Workshop', uploadedAt: new Date() },
        { id: '3', url: '/gallery/3.jpg', caption: 'Meeting', uploadedAt: new Date() },
      ]);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(prev => prev !== null ? (prev - 1 + images.length) % images.length : null);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(prev => prev !== null ? (prev + 1) % images.length : null);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-light flex items-center justify-center">
          <ImageLucide className="w-8 h-8 text-foreground-secondary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No images yet</h3>
        <p className="text-foreground-secondary">Gallery will be updated soon</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedImage(index)}
            className="cursor-pointer group relative aspect-square rounded-xl overflow-hidden"
          >
            <Image
              src={image.url}
              alt={image.caption || 'Gallery image'}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              {image.caption && (
                <p className="absolute bottom-2 left-2 right-2 text-white text-sm truncate">
                  {image.caption}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Modal
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        size="xl"
        showCloseButton={false}
      >
        {selectedImage !== null && (
          <div className="relative">
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Download button */}
            <button
              onClick={() => handleDownload(images[selectedImage].url, `image-${selectedImage}.jpg`)}
              className="absolute top-4 right-16 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>

            {/* Navigation */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image */}
            <div className="relative aspect-auto max-h-[80vh]">
              <Image
                src={images[selectedImage].url}
                alt={images[selectedImage].caption || 'Gallery image'}
                width={1200}
                height={800}
                className="object-contain w-full h-full"
              />
            </div>

            {/* Caption */}
            {images[selectedImage].caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-center">{images[selectedImage].caption}</p>
              </div>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-4 z-10 px-3 py-1 bg-black/50 rounded-lg text-white text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ClubGallery;