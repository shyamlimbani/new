'use client';

import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import Link from 'next/link';
import { Menu, X, Search, PhoneCall, Grid, ShieldCheck } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface HeaderProps {
  onSearch?: (query: string, category: string) => void;
  initialSearch?: string;
  initialCategory?: string;
}

export default function Header({ onSearch, initialSearch = '', initialCategory = '' }: HeaderProps) {
  const { settings, categories } = useSettings();
  const router = useRouter();

  const [searchVal, setSearchVal] = useState(initialSearch);
  const [selectedCat, setSelectedCat] = useState(initialCategory);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchVal, selectedCat);
    } else {
      // If we are not on the search page (homepage), navigate there with query parameters
      const params = new URLSearchParams();
      if (searchVal) params.set('search', searchVal);
      if (selectedCat) params.set('category', selectedCat);
      router.push(`/?${params.toString()}`);
    }
  };

  const selectSearchCategory = (slug: string) => {
    setSelectedCat(slug);
    setSearchDropdownOpen(false);
  };

  const getCategoryName = (slug: string) => {
    if (!slug) return 'All Categories';
    const cat = categories.find((c) => c.slug === slug);
    return cat ? cat.name : 'All Categories';
  };

  return (
    <header className="sticky top-0 z-35 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-4">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 shrink-0 select-none">
            {settings?.logo ? (
              <div className="flex items-center justify-center overflow-hidden bg-transparent">
                <Image
                  src={settings.logo}
                  alt={settings.websiteName || 'My Website'}
                  width={160}
                  height={60}
                  unoptimized={true}
                  className="h-10 md:h-12 w-auto object-contain bg-transparent"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 text-white p-1.5 rounded-xl shadow-sm">
                  <Grid className="w-4 h-4" />
                </div>
                <span className="font-bold text-base sm:text-lg text-slate-800 tracking-tight">
                  {settings?.websiteName || 'My Website'}
                </span>
              </div>
            )}
            <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-bold bg-blue-50 text-blue-600 rounded-md tracking-wider uppercase">
              Wholesale
            </span>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl bg-slate-50 border border-slate-100 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 focus-within:bg-white transition-all duration-300"
          >
            {/* Category Dropdown Selector inside Search */}
            <div className="relative shrink-0 border-r border-slate-200/55 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setSearchDropdownOpen(!searchDropdownOpen)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-650 hover:text-slate-900 flex items-center gap-1.5 focus:outline-hidden transition-colors"
              >
                <Grid className="w-3.5 h-3.5 text-blue-600" />
                <span className="max-w-[100px] truncate">{getCategoryName(selectedCat)}</span>
              </button>

              {searchDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSearchDropdownOpen(false)} />
                  <div className="absolute left-0 top-full mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 min-w-[180px] z-20 max-h-[260px] overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => selectSearchCategory('')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        type="button"
                        key={cat._id}
                        onClick={() => selectSearchCategory(cat.slug)}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* TextInput Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search premium products, verified suppliers..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 text-xs outline-none bg-transparent text-slate-800 placeholder-slate-400 focus:outline-hidden"
              />
              {searchVal && (
                <button
                  type="button"
                  onClick={() => setSearchVal('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </form>

          {/* Navigation Links & WhatsApp Call out */}
          <div className="hidden lg:flex items-center gap-6">
            {/* WhatsApp Contact Header button */}
            <WhatsAppButton
              message="Hello, I would like to make a business inquiry regarding products on your portal."
              className="bg-[#25d366]/8 hover:bg-[#25d366]/15 text-[#075e54] border border-[#25d366]/20 text-xs font-semibold px-4.5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Contact Wholesale</span>
            </WhatsAppButton>
          </div>

          {/* Mobile Actions: Hamburger and Search */}
          <div className="flex lg:hidden items-center gap-2">
            <WhatsAppButton
              message="Hello, I want to inquire about products."
              className="p-2 bg-slate-50 hover:bg-[#25d366]/10 text-slate-700 hover:text-[#075e54] border border-slate-100 rounded-xl transition shadow-xs"
            >
              <PhoneCall className="w-4 h-4" />
            </WhatsAppButton>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4 block">
          <form onSubmit={handleSearchSubmit} className="flex border border-slate-100 rounded-xl overflow-hidden shadow-xs bg-slate-50/50">
            <input
              type="text"
              placeholder="Search products or categories..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full px-3.5 py-2 text-xs outline-none bg-transparent text-slate-800 placeholder-slate-400 focus:bg-white transition-all"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold transition flex items-center justify-center shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex flex-col w-64 max-w-xs bg-white h-full shadow-2xl z-10 p-6 transition-all duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="font-bold text-slate-800">Navigation</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-xl text-slate-500 hover:bg-slate-50 border border-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 space-y-4 py-6">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 px-3 py-2 rounded-xl transition"
              >
                Marketplace Home
              </Link>
            </nav>
            <div className="pt-6 border-t border-slate-100">
              <WhatsAppButton
                message="Hello, I want to make a wholesale inquiry."
                className="w-full text-xs font-semibold py-3 flex items-center justify-center gap-2 bg-[#25d366]/10 hover:bg-[#25d366]/15 border border-[#25d366]/20 text-[#075e54] rounded-xl transition shadow-xs"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
