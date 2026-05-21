'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, Banner } from '../types';
import { ProductService, BannerService } from '../services/apiService';
import { useSettings } from '../context/SettingsContext';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import BannerSlider from '../components/BannerSlider';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import QuickViewModal from '../components/QuickViewModal';
import { SlidersHorizontal, Loader2, Search, HelpCircle } from 'lucide-react';

function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, loading: settingsLoading } = useSettings();

  // Search & Filter State from URL
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  // Local States
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Sidebar states
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Fetch banners on load
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await BannerService.getAll({ active: true });
        setBanners(data);
      } catch (err) {
        console.error('Error fetching banners', err);
      }
    };
    fetchBanners();
  }, []);

  // Fetch products when category, search, or local filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fetch from API
        const data = await ProductService.getAll({
          category: categoryParam,
          search: searchParam,
        });

        // Apply sidebar keyword filtering locally
        let filtered = [...data];

        if (sidebarSearch) {
          const s = sidebarSearch.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.title.toLowerCase().includes(s) ||
              (p.shortDescription && p.shortDescription.toLowerCase().includes(s))
          );
        }

        setProducts(filtered);
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, searchParam, sidebarSearch]);

  // Synchronize sidebar search with main search parameter
  useEffect(() => {
    if (searchParam) {
      setSidebarSearch(searchParam);
    }
  }, [searchParam]);

  // Reset all filters
  const handleResetFilters = () => {
    setSidebarSearch('');
    router.push('/');
  };

  // Route updates
  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    router.push(`/?${params.toString()}`);
  };

  const handleSearch = (query: string, category: string) => {
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (category) params.set('category', category);
    setSidebarSearch(query);
    router.push(`/?${params.toString()}`);
  };

  // Calculate product counts per category for the sidebar badge
  const getProductCounts = () => {
    const counts: Record<string, number> = {};
    // Note: ideally counted from full dataset, we simulate based on local loaded products count
    // but here we compute counts from all products (without category filter active)
    ProductService.filterLocal().forEach((p) => {
      const catId = typeof p.category === 'object' ? p.category._id : p.category;
      counts[catId] = (counts[catId] || 0) + 1;
      
      // Also index by category slug for matching
      const catObj = categories.find(c => c._id === catId);
      if (catObj) {
        counts[catObj.slug] = (counts[catObj.slug] || 0) + 1;
      }
    });
    return counts;
  };

  const productCounts = getProductCounts();

  return (
    <div className="flex flex-col min-h-screen bg-[#fafbfc]">
      <Header
        onSearch={handleSearch}
        initialSearch={searchParam}
        initialCategory={categoryParam}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
        
        {/* Banner Slider */}
        {banners.length > 0 && (
          <section className="w-full">
            <BannerSlider banners={banners} />
          </section>
        )}

        {/* Popular Categories Grid */}
        {categories.length > 0 && (
          <section className="w-full">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight mb-5 flex items-center gap-2">
              <span className="h-4 w-1 bg-blue-600 rounded-full"></span>
              Popular Sourcing Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.slice(0, 5).map((cat) => (
                <CategoryCard
                  key={cat._id}
                  category={cat}
                  active={categoryParam === cat.slug}
                />
              ))}
            </div>
          </section>
        )}

        {/* Main Products section with Left Sidebar */}
        <section className="flex gap-8 w-full items-start">
          
          {/* Left Sidebar Filters */}
          <Sidebar
            selectedCategory={categoryParam}
            onCategoryChange={handleCategoryChange}
            searchQuery={sidebarSearch}
            onSearchQueryChange={setSidebarSearch}
            onReset={handleResetFilters}
            isMobileOpen={mobileFiltersOpen}
            onMobileClose={() => setMobileFiltersOpen(false)}
            productCounts={productCounts}
          />

          {/* Right Product Grid */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Toolbar for grid */}
            <div className="flex justify-between items-center bg-white px-5 py-4 rounded-2xl border border-slate-100 shadow-xs">
              <div className="text-xs sm:text-sm font-medium text-slate-600">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                    Searching products...
                  </span>
                ) : (
                  <span>
                    Found <span className="text-blue-600 font-semibold">{products.length}</span> verified products
                    {categoryParam && (
                      <> in <span className="text-slate-800 font-semibold">{getCategoryName(categoryParam)}</span></>
                    )}
                  </span>
                )}
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-4 py-2 border border-slate-100 rounded-xl text-xs font-semibold text-slate-650 hover:bg-slate-50 transition"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                <span>Filters</span>
              </button>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-xs text-slate-500 font-semibold">Loading catalog items...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-3xl border border-slate-100 shadow-xs max-w-2xl mx-auto w-full">
                <div className="bg-blue-50/50 p-5 rounded-full mb-5 text-blue-600">
                  <Search className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">No matching products</h3>
                <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
                  We couldn't find matches for your current filter combination. Try resetting your search parameters or browsing other categories.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs hover:shadow-sm hover:scale-[1.01] transition-all duration-200 animate-pulse"
                >
                  Reset Search & Filters
                </button>
              </div>
            )}

          </div>

        </section>

      </main>

      {/* Quick View Dialog */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <Footer />
    </div>
  );

  function getCategoryName(slug: string) {
    if (!slug) return '';
    const cat = categories.find((c) => c.slug === slug);
    return cat ? cat.name : '';
  }
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}
