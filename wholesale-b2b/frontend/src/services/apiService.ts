import api from '../lib/api';
import { Product, Category, Banner, Settings, AdminStats } from '../types';

// ==========================================
// MOCK DATA FOR DEMO & FALLBACK
// ==========================================

const MOCK_CATEGORIES: Category[] = [
  {
    _id: 'cat-1',
    name: 'Industrial Machinery',
    slug: 'industrial-machinery',
    image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?w=500&auto=format&fit=crop&q=80',
    description: 'Heavy machines, CNC, lathes, and fabrication equipment',
  },
  {
    _id: 'cat-2',
    name: 'Textiles & Garments',
    slug: 'textiles-garments',
    image: 'https://images.unsplash.com/photo-1558271821-65ab9014453a?w=500&auto=format&fit=crop&q=80',
    description: 'Cotton, polyester, fabrics, garments, and apparel materials',
  },
  {
    _id: 'cat-3',
    name: 'Electronics & Electrical',
    slug: 'electronics-electrical',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=500&auto=format&fit=crop&q=80',
    description: 'Sensors, cables, lighting, circuits, and consumer devices',
  },
  {
    _id: 'cat-4',
    name: 'Agriculture & Food',
    slug: 'agriculture-food',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&auto=format&fit=crop&q=80',
    description: 'Organic grains, bulk spices, fresh produce, and fertilizers',
  },
  {
    _id: 'cat-5',
    name: 'Medical & Healthcare',
    slug: 'medical-healthcare',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=80',
    description: 'Medical disposables, surgical items, masks, and clinical equipment',
  },
];

const MOCK_PRODUCTS: Product[] = [
  {
    _id: 'prod-1',
    title: 'High Precision CNC Lathe Machine CK6150',
    slug: 'precision-cnc-lathe-machine',
    price: '₹3,50,000 / Unit',
    shortDescription: 'Industrial-grade CNC lathe machine for high precision metal turnings and shaft machining.',
    description: 'High efficiency CNC lathe machine with horizontal bed. Features advanced Fanuc or GSK control system. Perfect for metal turnings, shaft machining, and industrial component manufacturers. Includes auto-lubrication system and high-torque spindle.',
    category: 'cat-1',
    images: [
      'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Control System', value: 'GSK980TDi / Fanuc' },
      { key: 'Max Bed Swing', value: '500mm' },
      { key: 'Spindle Speed', value: '150-2000 rpm' },
      { key: 'Motor Power', value: '7.5 kW' }
    ],
    features: ['High-rigidity cast iron bed', 'Automatic 4-station tool post', 'Fully enclosed guarding for operator safety'],
    tags: ['CNC', 'Lathe', 'Machinery', 'Metalworking'],
    isFeatured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'prod-2',
    title: 'Premium 100% Organic Cotton Yarn',
    slug: 'organic-cotton-yarn',
    price: '₹250 / Kg',
    shortDescription: 'Combed organic cotton yarn for high-quality weaving and knitting.',
    description: 'High quality 100% organic cotton yarn. Available in counts 20s to 40s. Certified by GOTS. Ideal for weaving high-end bedsheets, t-shirts, and apparel fabrics. Extremely soft texture and high dye affinity.',
    category: 'cat-2',
    images: [
      'https://images.unsplash.com/photo-1558271821-65ab9014453a?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Composition', value: '100% Cotton' },
      { key: 'Count Range', value: '20s - 40s' },
      { key: 'Type', value: 'Combed & Carded' },
      { key: 'Certification', value: 'GOTS Certified' }
    ],
    features: ['Eco-friendly organic cotton', 'High tensile strength for high-speed looms', 'Soft skin feel with minimal hairiness'],
    tags: ['Cotton', 'Yarn', 'Textile', 'Organic'],
    isFeatured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'prod-3',
    title: 'Mono Perc Half-Cut Solar Panel 550W',
    slug: 'mono-perc-solar-panel-550w',
    price: '₹18,500 / Piece',
    shortDescription: 'A-grade Mono Perc Half-Cell solar panels for commercial and industrial installations.',
    description: 'Tier-1 high efficiency solar panel. Monocrystalline silicon cells with half-cut technology. Excellent performance under low light conditions with high durability against wind and snow loads. 25-year performance warranty included.',
    category: 'cat-3',
    images: [
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Peak Power', value: '550W' },
      { key: 'Cell Type', value: 'Monocrystalline' },
      { key: 'Module Efficiency', value: '21.3%' },
      { key: 'Warranty', value: '25 Years Linear Performance' }
    ],
    features: ['Anti-reflective glass coating', 'IP68 junction box with bypass diodes', 'PID resistant cells'],
    tags: ['Solar', 'Green Energy', 'Electrical', 'Power Panel'],
    isFeatured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'prod-4',
    title: 'Automatic Bottle Liquid Filling Machine',
    slug: 'automatic-liquid-filling-machine',
    price: '₹4,20,000 / Unit',
    shortDescription: '4-Nozzle linear volumetric liquid filling machine for PET/Glass bottles.',
    description: 'Fully automatic liquid filling machine suitable for pharmaceuticals, juice, water, oils, and chemical bottles. Volumetric piston filling mechanism guarantees ±1% filling accuracy. Simple adjustment for different bottle sizes.',
    category: 'cat-1',
    images: [
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Nozzles', value: '4 Heads (Customizable to 6/8)' },
      { key: 'Filling Range', value: '50ml - 1000ml' },
      { key: 'Speed', value: '30-40 Bottles/min' },
      { key: 'Material', value: 'Stainless Steel 316 / 304' }
    ],
    features: ['No Bottle No Fill smart mechanism', 'PLC controlled with touch-screen HMI', 'Drip-free pneumatic shutoff nozzles'],
    tags: ['Filling Machine', 'Packaging', 'Industrial'],
    isFeatured: false,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'prod-5',
    title: 'Disposable Syringes 3ml with Needle',
    slug: 'disposable-syringes-3ml',
    price: '₹1.80 / Piece',
    shortDescription: 'Bulk sterile medical grade disposable syringes with needles.',
    description: 'Sterilized using EO gas. Highly transparent barrel for easy visual inspection of flow. Double-contact gasket reduces plunger friction and leakage. Safe, medical-grade materials for hospital and clinical usage.',
    category: 'cat-5',
    images: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Capacity', value: '3 ml' },
      { key: 'Sterilization', value: 'EO Gas Sterile' },
      { key: 'Needle Size', value: '23G (Included)' },
      { key: 'Box Quantity', value: '100 Units/Box' }
    ],
    features: ['Non-toxic & Pyrogen free', 'Luer lock connector for safety', 'CE & ISO 13485 certified'],
    tags: ['Syringe', 'Medical', 'Surgical', 'Disposable'],
    isFeatured: false,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_BANNERS: Banner[] = [
  {
    _id: 'ban-1',
    title: 'Heavy Duty Industrial Machinery & Components',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&auto=format&fit=crop&q=80',
    link: '/?category=industrial-machinery',
    order: 1,
    isActive: true,
  },
  {
    _id: 'ban-2',
    title: 'Bulk Textile & Apparel Raw Materials',
    image: 'https://images.unsplash.com/photo-1558271821-65ab9014453a?w=1600&auto=format&fit=crop&q=80',
    link: '/?category=textiles-garments',
    order: 2,
    isActive: true,
  },
  {
    _id: 'ban-3',
    title: 'High Efficiency Solar & Green Energy Products',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&auto=format&fit=crop&q=80',
    link: '/?category=electronics-electrical',
    order: 3,
    isActive: true,
  },
];

const MOCK_SETTINGS: Settings = {
  logo: '',
  footerLogo: '',
  whatsappNumber: '919876543210',
  websiteName: 'IndiB2B Marketplace',
  seoTitle: 'IndiB2B Marketplace - Find Suppliers & Manufacturers',
  seoDescription: 'Connecting wholesale buyers with verified B2B suppliers, manufacturers, exporters, and logistics providers.',
  footerText: '© 2026 IndiB2B Wholesale Inc. All rights reserved. Made for wholesale business transactions.',
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
};

// ==========================================
// CLIENT STATE (IN-MEMORY PERSISTENCE FOR DEMO)
// ==========================================

let localProducts: Product[] = [];
let localCategories: Category[] = [];
let localBanners: Banner[] = [];
let localSettings: Settings = { ...MOCK_SETTINGS };

const loadLocalState = () => {
  if (typeof window === 'undefined') return;
  
  const products = localStorage.getItem('local_products');
  const categories = localStorage.getItem('local_categories');
  const banners = localStorage.getItem('local_banners');
  const settings = localStorage.getItem('local_settings');

  localProducts = products ? JSON.parse(products) : [...MOCK_PRODUCTS];
  localCategories = categories ? JSON.parse(categories) : [...MOCK_CATEGORIES];
  localBanners = banners ? JSON.parse(banners) : [...MOCK_BANNERS];
  localSettings = settings ? JSON.parse(settings) : { ...MOCK_SETTINGS };
};

const saveLocalState = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('local_products', JSON.stringify(localProducts));
  localStorage.setItem('local_categories', JSON.stringify(localCategories));
  localStorage.setItem('local_banners', JSON.stringify(localBanners));
  localStorage.setItem('local_settings', JSON.stringify(localSettings));
};

// Load initial local state
if (typeof window !== 'undefined') {
  loadLocalState();
  saveLocalState();
}

// Helper to wait
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// API SERVICES
// ==========================================

export const CategoryService = {
  getAll: async (): Promise<Category[]> => {
    try {
      const { data } = await api.get('/categories');
      // If backend returns nothing or is empty, use mock
      if (!data || data.length === 0) return localCategories;
      return data;
    } catch (e) {
      console.warn('Category fetch error, falling back to mock:', e);
      return localCategories;
    }
  },

  getById: async (id: string): Promise<Category> => {
    try {
      const { data } = await api.get(`/categories/${id}`);
      return data;
    } catch (e) {
      const found = localCategories.find((c) => c._id === id);
      if (found) return found;
      throw e;
    }
  },

  create: async (formData: FormData): Promise<Category> => {
    try {
      const { data } = await api.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (e) {
      console.warn('Category create error, creating locally:', e);
      const name = formData.get('name') as string;
      const slug = formData.get('slug') as string || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const description = formData.get('description') as string;
      
      const newCat: Category = {
        _id: `cat-${Date.now()}`,
        name,
        slug,
        description,
        image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?w=500&auto=format&fit=crop&q=80',
      };
      
      localCategories.push(newCat);
      saveLocalState();
      return newCat;
    }
  },

  update: async (id: string, formData: FormData): Promise<Category> => {
    try {
      const { data } = await api.put(`/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (e) {
      console.warn('Category update error, updating locally:', e);
      const index = localCategories.findIndex((c) => c._id === id);
      if (index === -1) throw new Error('Category not found');

      const name = formData.get('name') as string;
      const slug = formData.get('slug') as string;
      const description = formData.get('description') as string;

      localCategories[index] = {
        ...localCategories[index],
        name: name || localCategories[index].name,
        slug: slug || localCategories[index].slug,
        description: description || localCategories[index].description,
      };

      saveLocalState();
      return localCategories[index];
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/categories/${id}`);
    } catch (e) {
      console.warn('Category delete error, deleting locally:', e);
      localCategories = localCategories.filter((c) => c._id !== id);
      saveLocalState();
    }
  },
};

export const ProductService = {
  getAll: async (params?: { category?: string; search?: string }): Promise<Product[]> => {
    try {
      const { data } = await api.get('/products', { params });
      
      const productsList = data.products ? data.products : data;

      if (!productsList || !Array.isArray(productsList) || productsList.length === 0) {
        return ProductService.filterLocal(params);
      }
      return productsList;
    } catch (e) {
      console.warn('Product fetch error, falling back to mock:', e);
      return ProductService.filterLocal(params);
    }
  },

  filterLocal: (params?: { category?: string; search?: string }): Product[] => {
    let result = [...localProducts];
    if (params?.category) {
      // Can be category ID or slug
      const cat = localCategories.find(c => c._id === params.category || c.slug === params.category);
      if (cat) {
        result = result.filter((p) => p.category === cat._id || p.category === cat.slug);
      }
    }
    if (params?.search) {
      const s = params.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.shortDescription.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s)
      );
    }
    return result;
  },

  getById: async (id: string): Promise<Product> => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data;
    } catch (e) {
      const found = localProducts.find((p) => p._id === id || p.slug === id);
      if (found) return found;
      throw e;
    }
  },

  create: async (formData: FormData): Promise<Product> => {
    try {
      const { data } = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (e) {
      console.warn('Product create error, creating locally:', e);
      const title = formData.get('title') as string;
      const slug = formData.get('slug') as string || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const price = formData.get('price') as string;
      const shortDescription = formData.get('shortDescription') as string;
      const description = formData.get('description') as string;
      const categoryId = formData.get('category') as string;
      const specificationsRaw = formData.get('specifications') as string;
      const featuresRaw = formData.get('features') as string;
      const tagsRaw = formData.get('tags') as string;
      const isFeatured = formData.get('isFeatured') === 'true';

      const specs = specificationsRaw ? JSON.parse(specificationsRaw) : [];
      const features = featuresRaw ? JSON.parse(featuresRaw) : [];
      const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()) : [];

      const newProd: Product = {
        _id: `prod-${Date.now()}`,
        title,
        slug,
        price,
        shortDescription,
        description,
        category: categoryId,
        images: [
          'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?w=800&auto=format&fit=crop&q=80'
        ],
        specifications: specs,
        features,
        tags,
        isFeatured,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localProducts.push(newProd);
      saveLocalState();
      return newProd;
    }
  },

  update: async (id: string, formData: FormData): Promise<Product> => {
    try {
      const { data } = await api.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (e) {
      console.warn('Product update error, updating locally:', e);
      const index = localProducts.findIndex((p) => p._id === id);
      if (index === -1) throw new Error('Product not found');

      const title = formData.get('title') as string;
      const slug = formData.get('slug') as string;
      const price = formData.get('price') as string;
      const shortDescription = formData.get('shortDescription') as string;
      const description = formData.get('description') as string;
      const categoryId = formData.get('category') as string;
      const specificationsRaw = formData.get('specifications') as string;
      const featuresRaw = formData.get('features') as string;
      const tagsRaw = formData.get('tags') as string;
      const isFeatured = formData.get('isFeatured') === 'true';

      localProducts[index] = {
        ...localProducts[index],
        title: title || localProducts[index].title,
        slug: slug || localProducts[index].slug,
        price: price !== undefined ? price : localProducts[index].price,
        shortDescription: shortDescription || localProducts[index].shortDescription,
        description: description || localProducts[index].description,
        category: categoryId || localProducts[index].category,
        specifications: specificationsRaw ? JSON.parse(specificationsRaw) : localProducts[index].specifications,
        features: featuresRaw ? JSON.parse(featuresRaw) : localProducts[index].features,
        tags: tagsRaw ? tagsRaw.split(',').map((t) => t.trim()) : localProducts[index].tags,
        isFeatured: isFeatured !== undefined ? isFeatured : localProducts[index].isFeatured,
        updatedAt: new Date().toISOString(),
      };

      saveLocalState();
      return localProducts[index];
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/products/${id}`);
    } catch (e) {
      console.warn('Product delete error, deleting locally:', e);
      localProducts = localProducts.filter((p) => p._id !== id);
      saveLocalState();
    }
  },
};

export const BannerService = {
  getAll: async (params?: { active?: boolean }): Promise<Banner[]> => {
    try {
      const { data } = await api.get('/banners', {
        params: { active: params?.active ? 'true' : 'false' },
      });
      if (!data || data.length === 0) return localBanners.filter(b => !params?.active || b.isActive);
      return data;
    } catch (e) {
      console.warn('Banner fetch error, falling back to mock:', e);
      return localBanners.filter(b => !params?.active || b.isActive);
    }
  },

  create: async (formData: FormData): Promise<Banner> => {
    try {
      const { data } = await api.post('/banners', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (e) {
      console.warn('Banner create error, creating locally:', e);
      const title = formData.get('title') as string;
      const link = formData.get('link') as string;
      const order = Number(formData.get('order')) || 0;
      const isActive = formData.get('isActive') === 'true';

      const newBan: Banner = {
        _id: `ban-${Date.now()}`,
        title,
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&auto=format&fit=crop&q=80',
        link,
        order,
        isActive,
      };

      localBanners.push(newBan);
      localBanners.sort((a, b) => a.order - b.order);
      saveLocalState();
      return newBan;
    }
  },

  update: async (id: string, formData: FormData): Promise<Banner> => {
    try {
      const { data } = await api.put(`/banners/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (e) {
      console.warn('Banner update error, updating locally:', e);
      const index = localBanners.findIndex((b) => b._id === id);
      if (index === -1) throw new Error('Banner not found');

      const title = formData.get('title') as string;
      const link = formData.get('link') as string;
      const order = formData.get('order');
      const isActive = formData.get('isActive');

      localBanners[index] = {
        ...localBanners[index],
        title: title || localBanners[index].title,
        link: link !== undefined ? link : localBanners[index].link,
        order: order !== null ? Number(order) : localBanners[index].order,
        isActive: isActive !== null ? (String(isActive) === 'true') : localBanners[index].isActive,
      };

      localBanners.sort((a, b) => a.order - b.order);
      saveLocalState();
      return localBanners[index];
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/banners/${id}`);
    } catch (e) {
      console.warn('Banner delete error, deleting locally:', e);
      localBanners = localBanners.filter((b) => b._id !== id);
      saveLocalState();
    }
  },
};

export const SettingsService = {
  get: async (): Promise<Settings> => {
    try {
      const { data } = await api.get('/settings');
      if (!data) return localSettings;
      return data;
    } catch (e) {
      console.warn('Settings fetch error, falling back to mock:', e);
      return localSettings;
    }
  },

  update: async (formData: FormData): Promise<Settings> => {
    try {
      const { data } = await api.put('/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (e) {
      console.warn('Settings update error, updating locally:', e);
      
      const whatsappNumber = formData.get('whatsappNumber') as string;
      const websiteName = formData.get('websiteName') as string;
      const seoTitle = formData.get('seoTitle') as string;
      const seoDescription = formData.get('seoDescription') as string;
      const footerText = formData.get('footerText') as string;
      const facebook = formData.get('facebook') as string;
      const instagram = formData.get('instagram') as string;
      const twitter = formData.get('twitter') as string;
      const linkedin = formData.get('linkedin') as string;

      const logoFile = formData.get('logo') as File | null;
      const footerLogoFile = formData.get('footerLogo') as File | null;
      
      let logoUrl = localSettings.logo;
      let footerLogoUrl = localSettings.footerLogo;
      
      if (logoFile && typeof window !== 'undefined') {
        try {
          logoUrl = URL.createObjectURL(logoFile);
        } catch (err) {
          console.error(err);
        }
      }
      if (footerLogoFile && typeof window !== 'undefined') {
        try {
          footerLogoUrl = URL.createObjectURL(footerLogoFile);
        } catch (err) {
          console.error(err);
        }
      }

      localSettings = {
        ...localSettings,
        logo: logoUrl,
        footerLogo: footerLogoUrl,
        whatsappNumber: whatsappNumber || localSettings.whatsappNumber,
        websiteName: websiteName || localSettings.websiteName,
        seoTitle: seoTitle !== undefined ? seoTitle : localSettings.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription : localSettings.seoDescription,
        footerText: footerText !== undefined ? footerText : localSettings.footerText,
        socialLinks: {
          facebook: facebook !== undefined ? facebook : localSettings.socialLinks?.facebook,
          instagram: instagram !== undefined ? instagram : localSettings.socialLinks?.instagram,
          twitter: twitter !== undefined ? twitter : localSettings.socialLinks?.twitter,
          linkedin: linkedin !== undefined ? linkedin : localSettings.socialLinks?.linkedin,
        },
      };

      saveLocalState();
      return localSettings;
    }
  },
};

export const AdminService = {
  getStats: async (): Promise<AdminStats> => {
    try {
      // Try to fetch real counts if possible
      const products = await ProductService.getAll();
      const categories = await CategoryService.getAll();
      const banners = await BannerService.getAll();
      
      return {
        totalProducts: products.length,
        totalCategories: categories.length,
        activeBanners: banners.filter((b) => b.isActive).length,
        pendingInquiries: 5, // Mock inquiry count
      };
    } catch (e) {
      return {
        totalProducts: localProducts.length,
        totalCategories: localCategories.length,
        activeBanners: localBanners.filter((b) => b.isActive).length,
        pendingInquiries: 3,
      };
    }
  },
};
