'use client';

import React from 'react';
import { Product } from '../types';
import Link from 'next/link';
import { Eye, MessageCircle } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageHelper';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const whatsappMessage = `Hello, I am interested in your product: "${product.title}" (${product.price || 'Price on request'}). Please provide more details.`;
  
  // Use product.image or product.images[0] as primary image URL
  const primaryImage = product.image || (product.images && product.images[0]);

  return (
    <div className="group bg-white rounded-2xl border border-slate-100/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Image Container with Hover Effects */}
      <div className="relative pt-[80%] bg-slate-50/50 overflow-hidden shrink-0">
        <Link href={`/products/${product._id}`} className="absolute inset-0 flex items-center justify-center p-4">
          {primaryImage ? (
            <Image
              src={getImageUrl(primaryImage)}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-contain p-4 group-hover:scale-[1.03] transition-transform duration-300 ease-out"
            />
          ) : (
            <div className="text-slate-400 text-xs font-medium tracking-wide">No Image Available</div>
          )}
        </Link>

        {/* Quick View Hover overlay */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute bottom-3 right-3 p-2 bg-white/95 hover:bg-blue-650 text-slate-700 hover:text-white rounded-xl shadow-xs transition-all opacity-0 group-hover:opacity-100 duration-300 md:block hidden border border-slate-100 backdrop-blur-xs hover:scale-105"
          title="Quick View"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        {/* Quick View Button for Mobile */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute top-2 right-2 p-1.5 bg-white/95 text-slate-705 rounded-lg shadow-xs md:hidden border border-slate-100"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link href={`/products/${product._id}`} className="block">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-650 line-clamp-2 leading-snug mb-1.5 transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Price */}
          <div className="text-sm sm:text-base font-bold text-blue-600 mb-1">
            {product.price || 'Get Latest Price'}
          </div>

          {/* Short Description */}
          <p className="text-[11px] text-slate-500 line-clamp-2 mb-4 leading-relaxed font-normal">
            {product.shortDescription}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex flex-col gap-2 pt-3 border-t border-slate-100/80">
          <WhatsAppButton
            message={whatsappMessage}
            className="w-full text-xs font-semibold py-2.5 bg-[#25d366] hover:bg-[#20ba5a] text-white flex items-center justify-center gap-1.5 rounded-xl shadow-xs transition-all duration-200 hover:shadow-sm hover:scale-[1.01]"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Contact Supplier</span>
          </WhatsAppButton>

          <Link
            href={`/products/${product._id}`}
            className="w-full text-center text-xs font-semibold py-2.5 bg-slate-50 hover:bg-blue-50/50 text-slate-600 hover:text-blue-600 border border-slate-100/60 hover:border-blue-100/40 rounded-xl transition-all duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
