'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Banner, Product } from '../types';
import { BannerService, ProductService } from '../services/apiService';
import { useSettings } from '../context/SettingsContext';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import BannerSlider from '../components/BannerSlider';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import { SlidersHorizontal, Loader2, Search } from 'lucide-react';

import MainLayout from '../components/layout/MainLayout';

function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories } = useSettings();

  // Search & Filter State from URL
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  // Local States
  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Frontend Filter States
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('');
  const [sidebarSearch, setSidebarSearch] = useState<string>('');
  const [globalSearch, setGlobalSearch] = useState(searchParam);
  
  // Sidebar states
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setGlobalSearch(searchParam);
  }, [searchParam]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const bannersData = await BannerService.getAll({ active: true });
        setBanners(bannersData);
      } catch (err) {
        console.error('Error fetching banners', err);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let categoryId = '';
        if (selectedCategorySlug) {
          const cat = categories.find(c => c.slug === selectedCategorySlug);
          if (cat) {
            categoryId = cat._id;
          }
        }

        const searchQuery = sidebarSearch.trim() || globalSearch.trim();

        const response = await ProductService.getAll({
          category: categoryId,
          search: searchQuery,
          page: currentPage,
          limit: 30
        });

        if (response && response.products) {
          setProducts(response.products);
          setTotalProducts(response.total || 0);
          setTotalPages(response.pages || 1);
        } else if (Array.isArray(response)) {
          setProducts(response);
          setTotalProducts(response.length);
          setTotalPages(1);
        }
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategorySlug, globalSearch, sidebarSearch, currentPage, categories]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategorySlug('');
    setSidebarSearch('');
    setGlobalSearch('');
    setCurrentPage(1);
    if (searchParam) {
      router.push('/');
    }
  };

  // Route updates
  const handleCategoryChange = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentPage(1);
    setMobileFiltersOpen(false);
    // Remove category from URL if it exists to cleanly move to frontend filtering
    if (categoryParam) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('category');
      router.replace(`/?${params.toString()}`);
    }
  };

  const handleGlobalSearch = (query: string, category: string) => {
    setGlobalSearch(query);
    setCurrentPage(1);
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (category) {
      setSelectedCategorySlug(category);
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  // Frontend filtering logic is now handled server-side, but keep variable for compatibility
  const filteredProducts = products;

  // Calculate Product Counts dynamically using backend-provided counts
  const productCounts = categories.reduce((acc, cat) => {
    acc[cat._id] = cat.productCount || 0;
    return acc;
  }, {} as Record<string, number>);
  
  // Add total for 'All Products'
  productCounts['all'] = categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);

  return (
    <MainLayout
      onSearch={handleGlobalSearch}
      initialSearch={searchParam}
      initialCategory={selectedCategorySlug || categoryParam}
    >
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
        
        {/* Banner Slider - Always Visible */}
        {banners.length > 0 && (
          <section className="w-full">
            <BannerSlider banners={banners} />
          </section>
        )}

        {/* Main Products section with Left Sidebar */}
        <section className="flex flex-col lg:flex-row gap-8 w-full items-start">
          
          {/* Left Sidebar Filters */}
          <div className="lg:w-64 shrink-0">
            <Sidebar
              selectedCategory={selectedCategorySlug}
              onCategoryChange={handleCategoryChange}
              searchQuery={sidebarSearch}
              onSearchQueryChange={(val) => {
                setSidebarSearch(val);
                setCurrentPage(1);
              }}
              onReset={handleResetFilters}
              isMobileOpen={mobileFiltersOpen}
              onMobileClose={() => setMobileFiltersOpen(false)}
              productCounts={productCounts}
            />
          </div>

          {/* Right Product Grid */}
          <div className="flex-1 flex flex-col gap-6 w-full">
            
            {/* Toolbar for grid */}
            <div className="flex justify-between items-center bg-white px-4 py-3 rounded border border-gray-200 mb-2">
              <div className="text-sm font-medium text-gray-600">
                  {loading ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Loading products...</span>
                  ) : filteredProducts.length > 0 ? (
                    <span>
                      Showing <strong className="text-gray-900">{(currentPage - 1) * 30 + 1}–{Math.min(currentPage * 30, totalProducts)}</strong> of <strong className="text-gray-900">{totalProducts}</strong> products
                    </span>
                  ) : (
                    <span>Showing <strong className="text-gray-900">0</strong> products</span>
                  )}
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-4 py-2 border border-slate-100 rounded-xl text-xs font-semibold text-slate-650 hover:bg-slate-50 transition"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#cc3a07]" />
                <span>Filters</span>
              </button>
            </div>

            {loading ? (
               <div className="flex justify-center items-center py-20">
                 <Loader2 className="w-10 h-10 animate-spin text-[#cc3a07]" />
               </div>
            ) : filteredProducts.length > 0 ? (
              <div className="flex flex-col gap-8 w-full animate-fade-in">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product._id} 
                      product={product} 
                      category={categories.find(c => c._id === product.category)}
                    />
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4 py-4 border-t border-slate-100 w-full select-none">
                    {/* Previous Button */}
                    <button
                      onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 sm:px-4 py-2 border rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1 ${
                        currentPage === 1
                          ? 'border-slate-100 text-slate-350 cursor-not-allowed opacity-50 bg-slate-50'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <span>&larr;</span> <span className="hidden sm:inline">Previous</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      {(() => {
                        const pages: (number | string)[] = [];
                        if (totalPages <= 5) {
                          for (let i = 1; i <= totalPages; i++) pages.push(i);
                        } else {
                          pages.push(1);
                          if (currentPage > 3) pages.push('...');
                          const start = Math.max(2, currentPage - 1);
                          const end = Math.min(totalPages - 1, currentPage + 1);
                          for (let i = start; i <= end; i++) pages.push(i);
                          if (currentPage < totalPages - 2) pages.push('...');
                          pages.push(totalPages);
                        }

                        return pages.map((p, idx) => {
                          if (p === '...') {
                            return (
                              <span
                                key={`ellipsis-${idx}`}
                                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-slate-450 text-xs sm:text-sm font-medium"
                              >
                                ...
                              </span>
                            );
                          }

                          const isPageActive = currentPage === p;
                          return (
                            <button
                              key={`page-${p}`}
                              onClick={() => setCurrentPage(Number(p))}
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center ${
                                isPageActive
                                  ? 'bg-[#cc3a07] text-white shadow-sm'
                                  : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                              }`}
                            >
                              {p}
                            </button>
                          );
                        });
                      })()}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 sm:px-4 py-2 border rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1 ${
                        currentPage === totalPages
                          ? 'border-slate-100 text-slate-350 cursor-not-allowed opacity-50 bg-slate-50'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <span className="hidden sm:inline">Next</span> <span>&rarr;</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-3xl border border-slate-100 shadow-xs w-full">
                <div className="bg-[#f9ebe6] p-5 rounded-full mb-5 text-[#cc3a07]">
                  <Search className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">No products found</h3>
                <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
                  We couldn't find any products matching your current criteria.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#cc3a07] hover:bg-[#a82f05] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-[0_4px_12px_rgba(204,58,7,0.25)]"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

      </div>
    </MainLayout>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <Loader2 className="w-10 h-10 text-[#cc3a07] animate-spin" />
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}
