'use client';

import React, { useState, useEffect } from 'react';
import { Product, Category } from '@/types';
import { ProductService, CategoryService } from '@/services/apiService';
import { Plus, Search, Edit2, Trash2, X, PlusCircle, MinusCircle, Loader2 } from 'lucide-react';
import { getImageUrl } from '@/lib/imageHelper';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<'active' | 'draft' | 'out_of_stock'>('active');
  const [tags, setTags] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  
  // Specifications builder state
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([]);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');

  // Image Upload State
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        ProductService.getAll(),
        CategoryService.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync title to slug automatically on create
  useEffect(() => {
    if (!editingProduct) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [title, editingProduct]);

  const openAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setSlug('');
    setPrice('');
    setShortDescription('');
    setDescription('');
    setCategory(categories[0]?._id || '');
    setIsFeatured(false);
    setStatus('active');
    setTags('');
    setFeatures([]);
    setSpecifications([]);
    setImageFiles([]);
    setImageUrls([]);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setSlug(product.slug);
    setPrice(product.price || '');
    setShortDescription(product.shortDescription);
    setDescription(product.description);
    
    const catId = typeof product.category === 'object' ? product.category._id : product.category;
    setCategory(catId || '');
    
    setIsFeatured(product.isFeatured);
    setStatus(product.status);
    setTags(product.tags ? product.tags.join(', ') : '');
    setFeatures(product.features || []);
    setSpecifications(product.specifications || []);
    setImageFiles([]);
    setImageUrls(product.images || []);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  // Specs helper
  const addSpecification = () => {
    if (!newSpecKey.trim() || !newSpecVal.trim()) return;
    setSpecifications([...specifications, { key: newSpecKey.trim(), value: newSpecVal.trim() }]);
    setNewSpecKey('');
    setNewSpecVal('');
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  // Features helper
  const addFeature = () => {
    if (!featureInput.trim()) return;
    setFeatures([...features, featureInput.trim()]);
    setFeatureInput('');
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Handle files select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('price', price);
    formData.append('shortDescription', shortDescription);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('isFeatured', String(isFeatured));
    formData.append('status', status);
    formData.append('tags', tags);
    formData.append('specifications', JSON.stringify(specifications));
    formData.append('features', JSON.stringify(features));

    // Append files
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      if (editingProduct) {
        await ProductService.update(editingProduct._id, formData);
      } else {
        await ProductService.create(formData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await ProductService.delete(id);
        loadData();
      } catch (err) {
        console.error('Error deleting product', err);
      }
    }
  };

  // Filter products by search
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchVal.toLowerCase()) ||
    p.shortDescription.toLowerCase().includes(searchVal.toLowerCase())
  );

  const getCategoryName = (cat: any) => {
    if (typeof cat === 'object' && cat !== null) {
      return cat.name;
    }
    const match = categories.find((c) => c._id === cat || c.slug === cat);
    return match ? match.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Products Management</h1>
          <p className="text-sm text-gray-500">Add, edit, or delete wholesale marketplace products.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Filter and search row */}
      <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search products by title..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table grid */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-150 p-12 flex justify-center items-center shadow-xs">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
          <span className="text-gray-500 font-semibold">Loading product table...</span>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-extrabold border-b border-gray-150">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-gray-50 border rounded-lg overflow-hidden flex items-center justify-center p-1">
                        {p.image || (p.images && p.images.length > 0) ? (
                          <img src={getImageUrl(p.image || p.images[0])} alt="" className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span className="text-gray-300 text-[10px]">No image</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-800 line-clamp-1">{p.title}</div>
                        {p.isFeatured && (
                          <span className="inline-block mt-1 text-[9px] font-extrabold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-semibold">{getCategoryName(p.category)}</td>
                    <td className="px-6 py-4 font-bold text-gray-700">{p.price || 'Request Price'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        p.status === 'active'
                          ? 'bg-green-50 text-green-700'
                          : p.status === 'out_of_stock'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 hover:bg-gray-150 text-gray-600 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">
                      No products found. Add a product to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => !submitting && setIsModalOpen(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col z-10 animate-scale-in">
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                disabled={submitting}
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-500 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {errorMsg && (
                <div className="bg-red-50 text-red-650 p-4 rounded-lg text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Product Title*</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Industrial Lathe Machine"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Product Slug*</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. industrial-lathe-machine"
                  />
                </div>
              </div>

              {/* Category, Price, Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Category*</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Price (Optional)</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. ₹3,50,000 / Unit"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Short description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Short Description* (1-2 sentences)</label>
                <input
                  type="text"
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Summarize product main purpose..."
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Description*</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Detail specifications, operational aspects, packaging, delivery details..."
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Upload Images (Select files)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imageUrls.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {imageUrls.map((url, i) => (
                      <div key={i} className="relative w-12 h-12 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
                        <img src={getImageUrl(url)} alt="" className="max-h-full max-w-full object-contain" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Key Features List Builder */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Product Key Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Made from corrosion-resistant SS316"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-blue-650 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center"
                  >
                    Add
                  </button>
                </div>
                {features.length > 0 && (
                  <ul className="space-y-1 bg-gray-50 p-3 rounded-lg border text-xs">
                    {features.map((feat, i) => (
                      <li key={i} className="flex justify-between items-center py-1">
                        <span className="text-gray-700 font-semibold">• {feat}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(i)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Specifications Key-Value Builder */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Technical Specifications</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Spec Key (e.g. Dimensions)"
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                    className="px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Spec Value (e.g. 100 x 50 cm)"
                      value={newSpecVal}
                      onChange={(e) => setNewSpecVal(e.target.value)}
                      className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="bg-blue-650 text-white font-bold px-4 py-2 rounded-lg text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {specifications.length > 0 && (
                  <div className="border rounded-lg overflow-hidden text-xs">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b text-gray-500 font-extrabold text-left">
                          <th className="px-4 py-2">Specification Name</th>
                          <th className="px-4 py-2">Value</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {specifications.map((spec, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2 font-semibold text-gray-700">{spec.key}</td>
                            <td className="px-4 py-2 text-gray-650">{spec.value}</td>
                            <td className="px-4 py-2 text-right">
                              <button
                                type="button"
                                onClick={() => removeSpecification(i)}
                                className="text-red-500 hover:text-red-700 font-bold"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Tags & Featured */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. lathe, cnc, machine"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded-sm focus:ring-blue-500"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-bold text-gray-700 select-none">
                    Feature on Homepage Grid
                  </label>
                </div>
              </div>

              {/* Form Actions Footer */}
              <div className="pt-6 border-t flex justify-end gap-3">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-750 font-bold rounded-lg text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-650 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg text-sm transition flex items-center gap-1.5 shadow-sm"
                >
                  {submitting && <Loader2 className="w-4.5 h-4.5 animate-spin" />}
                  <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
