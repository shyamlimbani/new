'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Product, Category } from '../../../types';
import { ProductService } from '../../../services/apiService';
import { useSettings } from '../../../context/SettingsContext';
import ProductCard from '../../../components/ProductCard';
import MainLayout from '../../../components/layout/MainLayout';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

function CategoryPageContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const { categories } = useSettings();
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categories && slug) {
      const match = categories.find((c) => c.slug === slug);
      if (match) {
        setCurrentCategory(match);
        setCurrentPage(1); // Reset page to 1 if category changes
      }
    }
  }, [categories, slug]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentCategory) return;
      setLoading(true);
      try {
        const response = await ProductService.getAll({
          category: currentCategory._id,
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
        console.error('Error fetching category products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentCategory, currentPage]);

  if (!currentCategory && !loading) {
    return (
      <MainLayout>
        <div className="max-w-xl mx-auto py-20 px-6 text-center space-y-6">
          <h2 className="text-2xl font-black text-slate-800">Category Not Found</h2>
          <p className="text-slate-500">The wholesale directory you are trying to reach doesn't exist.</p>
          <Link href="/" className="inline-block bg-[#cc3a07] hover:bg-[#a82f05] text-white font-bold px-6 py-2.5 rounded-xl transition text-sm">
            Back to Home
          </Link>
        </div>
      </MainLayout>
    );
  }

  const filteredProducts = products;

  return (
    <MainLayout>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider select-none">
          <Link href="/" className="hover:text-[#cc3a07] transition">Home</Link>
          <span>/</span>
          <span className="text-slate-600">{currentCategory?.name || 'Category'}</span>
        </div>

        {/* Category Title Section */}
        {currentCategory && (
          <div className="flex flex-col gap-1 pb-4 border-b border-gray-100 select-none">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 uppercase tracking-tight">
              {currentCategory.name}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-400">
              {loading ? 'Calculating...' : totalProducts > 0 ? `Showing ${(currentPage - 1) * 30 + 1}–${Math.min(currentPage * 30, totalProducts)} of ${totalProducts} Products` : '0 Products Found'}
            </p>
          </div>
        )}

        {/* Products Grid */}
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
                  category={currentCategory || undefined}
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
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-2xl border border-slate-100 shadow-xs w-full">
            <h3 className="text-base font-bold text-slate-800 mb-2">No products found</h3>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              We couldn't find any products in this category.
            </p>
          </div>
        )}

      </div>
    </MainLayout>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <Loader2 className="w-10 h-10 text-[#cc3a07] animate-spin" />
      </div>
    }>
      <CategoryPageContent />
    </Suspense>
  );
}
