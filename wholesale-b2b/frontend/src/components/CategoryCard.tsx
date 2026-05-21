'use client';

import React from 'react';
import { Category } from '../types';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageHelper';

interface CategoryCardProps {
  category: Category;
  active?: boolean;
}

export default function CategoryCard({ category, active = false }: CategoryCardProps) {
  return (
    <Link
      href={`/?category=${category.slug}`}
      className={`group block p-4 bg-white rounded-2xl border transition-all duration-300 ${
        active
          ? 'border-blue-500 bg-blue-50/10 shadow-xs ring-1 ring-blue-500/25'
          : 'border-slate-100/85 hover:border-blue-200 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Category Image */}
        <div className="w-14 h-14 rounded-xl bg-slate-50/80 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100/50 relative">
          {category.image ? (
            <Image
              src={getImageUrl(category.image)}
              alt={category.name}
              fill
              sizes="56px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-slate-300 text-xs font-semibold uppercase">{category.name.slice(0, 2)}</div>
          )}
        </div>

        {/* Category Info */}
        <div className="min-w-0">
          <h4 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
            {category.name}
          </h4>
          {category.description && (
            <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-1 mt-0.5 leading-normal">
              {category.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
