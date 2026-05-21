'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { ProductService } from '@/services/apiService';
import { useSettings } from '@/context/SettingsContext';

// Components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductCard from '@/components/ProductCard';
import { Loader2, Check, ArrowLeft, FileText, Tag, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageHelper';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const { categories } = useSettings();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Gallery index
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Quick Inquiry Form inside detail page
  const [quantity, setQuantity] = useState('10');
  const [unit, setUnit] = useState('Pieces');
  const [requirementText, setRequirementText] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await ProductService.getById(id);
        setProduct(data);
        setActiveImageIndex(0);

        // Fetch related products from same category
        const catId = typeof data.category === 'object' ? data.category._id : data.category;
        const related = await ProductService.getAll({ category: catId });
        // Exclude current product
        setRelatedProducts(related.filter((p) => p._id !== data._id).slice(0, 4));
      } catch (err) {
        console.error('Error loading product details', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fafbfc]">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
          <span className="text-slate-500 text-sm font-semibold tracking-wide">Loading product specifications...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fafbfc]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="bg-red-50/50 text-red-500 p-4 rounded-full mb-4 border border-red-100/50">
            <Tag className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">Product Not Found</h2>
          <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
            The product you are looking for may have been removed or is temporarily unavailable.
          </p>
          <Link href="/" className="bg-blue-650 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-xs">
            Back to Marketplace
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryName = () => {
    const catId = typeof product.category === 'object' ? product.category._id : product.category;
    const cat = categories.find((c) => c._id === catId || c.slug === catId);
    return cat ? cat.name : 'Bulk Items';
  };

  const whatsappMessage = `Hello, I am interested in sourcing "${product.title}" (${product.price || 'Price on request'}). Bulk Requirement: ${quantity} ${unit}. ${requirementText ? `Details: ${requirementText}` : ''}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc]">
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-650 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Wholesale Catalog</span>
          </Link>
        </div>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Block (Lg: col-span-7) - Image & Spec Sheet & Description */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6">
              
              {/* Main Image container with Zoom Hover */}
              <div className="aspect-square w-full rounded-2xl bg-slate-50/50 flex items-center justify-center p-6 relative overflow-hidden group border border-slate-100/60">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={getImageUrl(product.images[activeImageIndex])}
                    alt={product.title}
                    width={600}
                    height={600}
                    priority
                    className="object-contain w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="text-slate-400 text-sm font-medium tracking-wide">No Image Available</div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`w-16 h-16 border rounded-xl overflow-hidden shrink-0 bg-white p-1 transition-all ${
                        i === activeImageIndex
                          ? 'border-blue-600 shadow-xs ring-2 ring-blue-500/10'
                          : 'border-slate-200 hover:border-slate-350'
                      }`}
                    >
                      <Image
                        src={getImageUrl(img)}
                        alt=""
                        width={60}
                        height={60}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications Sheet */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2 pb-2 border-b border-slate-50 tracking-tight">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-2.5 text-sm">
                      <span className="text-slate-400 font-medium">{spec.key}</span>
                      <span className="text-slate-800 font-semibold pl-4 truncate max-w-[60%]">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description & Features */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-50 tracking-tight">
                  Detailed Product Description
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line font-normal">
                  {product.description}
                </p>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="border-t border-slate-50 pt-6">
                  <h4 className="text-sm font-bold text-slate-800 mb-4 tracking-tight">Key Features & Benefits</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-650">
                        <div className="bg-emerald-50 text-emerald-600 rounded-full p-0.5 shrink-0 mt-0.5 border border-emerald-100/50">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="font-medium text-slate-600">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>

          {/* Right Block (Lg: col-span-5) - Core Info & Dynamic WhatsApp Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-6">
            
            {/* Core Specs Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-5">
              
              <div>
                <span className="text-[11px] font-semibold text-slate-500 tracking-wide bg-slate-50 border border-slate-100/50 px-2.5 py-1 rounded-lg uppercase w-fit">
                  {categoryName()}
                </span>
                
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight mt-4">
                  {product.title}
                </h1>

                <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed mt-3">
                  {product.shortDescription}
                </p>
              </div>

              {/* Pricing Display */}
              <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-5 my-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider mb-0.5">Wholesale Price</span>
                  <span className="text-2xl font-black text-slate-950">{product.price || 'Price on Request'}</span>
                </div>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/50">
                  Bulk Sourcing
                </span>
              </div>

              {/* WhatsApp Action Panel */}
              <div className="flex flex-col gap-4 border-t border-slate-50 pt-5">
                
                {/* Quantity Requirement */}
                <div className="flex flex-col gap-2 bg-slate-50/40 p-4 rounded-xl border border-slate-100/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-700">Requirement Quantity</span>
                    <span className="text-[11px] text-slate-400 font-medium">Specify order size</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
                      className="w-2/3 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-xs"
                    />
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-1/3 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-xs"
                    >
                      <option>Pieces</option>
                      <option>Kg</option>
                      <option>Tons</option>
                      <option>Units</option>
                      <option>Boxes</option>
                    </select>
                  </div>
                </div>

                {/* Optional Requirement Text */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Custom Sourcing Notes (Optional)</label>
                  <textarea
                    placeholder="Mention custom dimensions, target delivery dates, or branding..."
                    value={requirementText}
                    onChange={(e) => setRequirementText(e.target.value)}
                    rows={3}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 outline-none resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-xs"
                  />
                </div>

                {/* Primary Premium CTA */}
                <div className="pt-2">
                  <WhatsAppButton
                    message={whatsappMessage}
                    className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white flex items-center justify-center gap-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] text-sm group"
                  >
                    <MessageCircle className="w-5 h-5 fill-current transition-transform duration-300 group-hover:scale-110" />
                    <span>Send WhatsApp Inquiry</span>
                  </WhatsAppButton>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-slate-100 pt-12">
            <h2 className="text-xl font-extrabold text-slate-900 mb-8 tracking-tight">
              Related Sourcing Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onQuickView={() => {}}
                />
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />

      {/* Mobile Sticky WhatsApp Button Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100/80 p-4 flex items-center justify-between gap-4 md:hidden z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col shrink-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Wholesale</span>
          <span className="text-base font-extrabold text-slate-900 truncate max-w-[130px]">
            {product.price || 'Price request'}
          </span>
        </div>
        <WhatsAppButton
          message={whatsappMessage}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white flex items-center justify-center gap-2 rounded-xl font-bold shadow-sm text-sm active:scale-[0.98] transition-all"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Inquire Now</span>
        </WhatsAppButton>
      </div>
    </div>
  );
}
