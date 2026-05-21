'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Banner } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageHelper';

interface BannerSliderProps {
  banners: Banner[];
}

export default function BannerSlider({ banners }: BannerSliderProps) {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    if (banners.length > 1) {
      setCurrent((prev) => (prev + 1) % banners.length);
    }
  }, [banners.length]);

  const prevSlide = () => {
    if (banners.length > 1) {
      setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
    }
  };

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(nextSlide, 6000); // Auto slide every 6 seconds
    return () => clearInterval(interval);
  }, [banners.length, nextSlide]);

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[current];

  return (
    <div className="relative w-full h-[240px] sm:h-[340px] md:h-[420px] bg-gray-100 rounded-2xl overflow-hidden shadow-sm group">
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/35 to-transparent z-1" />

          {/* Banner Image */}
          <Image
            src={getImageUrl(currentBanner.image)}
            alt={currentBanner.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* Content */}
          <div className="absolute inset-y-0 left-0 pl-8 pr-4 sm:pl-16 flex flex-col justify-center max-w-xl z-2 text-white">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-400 mb-2"
            >
              B2B Sourced & Verified
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mb-4"
            >
              {currentBanner.title}
            </motion.h2>
            
            {currentBanner.link && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  href={currentBanner.link}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition duration-200 inline-block w-fit"
                >
                  Source Now
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/90 text-white hover:text-gray-800 rounded-full shadow-md backdrop-blur-xs transition z-10 opacity-0 group-hover:opacity-100 duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/90 text-white hover:text-gray-800 rounded-full shadow-md backdrop-blur-xs transition z-10 opacity-0 group-hover:opacity-100 duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === current ? 'bg-blue-600 w-6' : 'bg-white/50 hover:bg-white'
                }`}
                title={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
