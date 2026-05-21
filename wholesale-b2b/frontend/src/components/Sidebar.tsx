'use client';

import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { X, Search, RefreshCw, FolderOpen } from 'lucide-react';

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (slug: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onReset: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  productCounts: Record<string, number>;
}

export default function Sidebar({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchQueryChange,
  onReset,
  isMobileOpen = false,
  onMobileClose,
  productCounts,
}: SidebarProps) {
  const { categories } = useSettings();

  const filterContent = (
    <div className="flex flex-col gap-6 p-5 bg-white">
      {/* Header with Reset */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h3 className="font-semibold text-slate-800 text-sm tracking-tight">Filters</h3>
        {(searchQuery || selectedCategory) && (
          <button
            onClick={onReset}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Keywords Search in Sidebar */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-slate-705 tracking-wide uppercase">Search Within</h4>
        <div className="relative">
          <input
            type="text"
            placeholder="Type keywords..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-xs bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all placeholder-slate-400 text-slate-750"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Categories Selection */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-slate-705 tracking-wide uppercase flex items-center gap-1.5">
          <FolderOpen className="w-3.5 h-3.5 text-slate-450" />
          Browse Categories
        </h4>
        <div className="flex flex-col gap-1 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
          <button
            onClick={() => onCategoryChange('')}
            className={`flex justify-between items-center text-left text-xs py-2 px-3.5 rounded-xl transition-all duration-200 ${
              selectedCategory === ''
                ? 'bg-blue-50/50 text-blue-600 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => {
            const count = productCounts[cat._id] || productCounts[cat.slug] || 0;
            return (
              <button
                key={cat._id}
                onClick={() => onCategoryChange(cat.slug)}
                className={`flex justify-between items-center text-left text-xs py-2 px-3.5 rounded-xl transition-all duration-200 ${
                  selectedCategory === cat.slug
                    ? 'bg-blue-50/50 text-blue-600 font-bold'
                    : 'text-slate-650 hover:bg-slate-50'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold transition-all ${
                    selectedCategory === cat.slug ? 'bg-blue-100/50 text-blue-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white rounded-2xl border border-slate-100 shadow-sm shrink-0 sticky top-20 hidden lg:block overflow-hidden self-start">
        {filterContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />
          {/* Drawer Panel */}
          <div className="relative flex flex-col w-72 max-w-xs bg-white h-full shadow-2xl z-10 animate-slide-in">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center shrink-0 bg-slate-50/50">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-800">Filter Catalog</span>
              <button
                onClick={onMobileClose}
                className="p-1.5 text-slate-500 hover:bg-slate-100 border border-slate-100 rounded-xl transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-white">{filterContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
