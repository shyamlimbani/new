export interface Product {
  _id: string;
  title: string;
  slug: string;
  price?: string;
  shortDescription: string;
  description: string;
  category: any; // Can be ObjectId string or Category object
  image?: string;
  images: string[];
  specifications: { key: string; value: string }[];
  features: string[];
  tags: string[];
  isFeatured: boolean;
  status: 'active' | 'draft' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  parent?: any; // Can be ObjectId string or Category object
  createdAt?: string;
  updatedAt?: string;
}

export interface Banner {
  _id: string;
  title: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Settings {
  _id?: string;
  logo?: string;
  footerLogo?: string;
  whatsappNumber?: string;
  websiteName?: string;
  seoTitle?: string;
  seoDescription?: string;
  footerText?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface AdminStats {
  totalProducts: number;
  totalCategories: number;
  activeBanners: number;
  pendingInquiries: number;
}
