import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import Category from '../models/Category';
import asyncWrapper from '../utils/asyncWrapper';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const category = req.query.category as string;

    let count;
    let products;

    if (category) {
      let categoryId = category;
      if (!mongoose.isValidObjectId(category)) {
        const cat = await Category.findOne({ slug: category });
        if (cat) {
          categoryId = cat._id.toString();
        }
      }

      count = await Product.countDocuments({ category: categoryId });
      products = await Product.find({ category: categoryId })
        .populate('category')
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    } else {
      count = await Product.countDocuments({});
      products = await Product.find({})
        .populate('category')
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    }

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error fetching products" });
  }
};

export const getProductById = asyncWrapper(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate('category');
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export const createProduct = asyncWrapper(async (req: Request, res: Response) => {
  const { title, slug, price, shortDescription, description, category, specifications, features, tags, isFeatured, status } = req.body;

  let imageUrls: string[] = [];
  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      const url = await uploadToCloudinary(file.buffer, 'products');
      imageUrls.push(url);
    }
  }

  const product = new Product({
    title,
    slug,
    price,
    shortDescription,
    description,
    category,
    image: imageUrls[0] || '',
    images: imageUrls,
    specifications: specifications ? JSON.parse(specifications) : [],
    features: features ? JSON.parse(features) : [],
    tags: tags ? JSON.parse(tags) : [],
    isFeatured: isFeatured === 'true',
    status: status || 'active',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

export const updateProduct = asyncWrapper(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.title = req.body.title || product.title;
    product.slug = req.body.slug || product.slug;
    product.price = req.body.price || product.price;
    product.shortDescription = req.body.shortDescription || product.shortDescription;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured === 'true' : product.isFeatured;
    product.status = req.body.status || product.status;
    
    if (req.body.specifications) product.specifications = JSON.parse(req.body.specifications);
    if (req.body.features) product.features = JSON.parse(req.body.features);
    if (req.body.tags) product.tags = JSON.parse(req.body.tags);

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const newImages: string[] = [];
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, 'products');
        newImages.push(url);
      }
      product.images = [...product.images, ...newImages];
    }
    
    product.image = product.images[0] || '';

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export const deleteProduct = asyncWrapper(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
