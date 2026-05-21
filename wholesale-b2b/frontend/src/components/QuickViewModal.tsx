'use client';

import React, { useState } from 'react';
import { Product } from '../types';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import WhatsAppButton from './WhatsAppButton';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageHelper';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const nextImage = () => {
    if (product.images.length > 1) {
      setActiveImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images.length > 1) {
      setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const whatsappMessage = `Hello, I'm interested in "${product.title}" (${product.price || 'Price on request'}). Please share more details.`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Image Gallery */}
          <div className="w-full md:w-1/2 bg-gray-50 flex flex-col relative min-h-[300px] md:min-h-[450px] justify-between p-6">
            <div className="relative flex-1 flex items-center justify-center">
              {product.images && product.images.length > 0 ? (
                <div className="relative w-full h-[280px] md:h-[320px]">
                  <Image
                    src={getImageUrl(product.images[activeImageIndex])}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
              )}

              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-0 p-1.5 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-md transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-0 p-1.5 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-md transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-4 justify-center overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-12 h-12 border-2 rounded-md overflow-hidden bg-white p-0.5 relative ${
                      i === activeImageIndex ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={getImageUrl(img)}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-contain rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto max-h-[90vh] md:max-h-[unset]">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              Wholesale Deal
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
              {product.title}
            </h2>

            {/* Price */}
            <div className="text-xl font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg w-fit mb-4">
              {product.price || 'Price on Request'}
            </div>

            {/* Short Description */}
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">
                  Product Specifications
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  {product.specifications.slice(0, 6).map((spec, i) => (
                    <div key={i} className="flex flex-col border-b border-gray-100 pb-1">
                      <span className="text-gray-500 font-medium">{spec.key}</span>
                      <span className="text-gray-800 font-semibold truncate">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Features</h3>
                <ul className="space-y-1.5 text-xs text-gray-700">
                  {product.features.slice(0, 3).map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto pt-6 border-t flex flex-col sm:flex-row gap-3">
              <WhatsAppButton
                message={whatsappMessage}
                className="flex-1 py-3 text-sm"
              />
              <Link
                href={`/products/${product._id}`}
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-lg text-sm font-medium transition"
              >
                View Full Details
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
