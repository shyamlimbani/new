import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  slug: string;
  price?: string; // Optional since it's wholesale, sometimes they hide price
  shortDescription: string;
  description: string;
  category: mongoose.Types.ObjectId;
  image?: string;
  images: string[];
  specifications: { key: string; value: string }[];
  features: string[];
  tags: string[];
  isFeatured: boolean;
  status: 'active' | 'draft' | 'out_of_stock';
}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: String,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    image: {
      type: String, // Main product image URL
    },
    images: [
      {
        type: String, // Cloudinary URLs
      },
    ],
    specifications: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],
    features: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'out_of_stock'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        if (!ret.image && ret.images && ret.images.length > 0) {
          ret.image = ret.images[0];
        }
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        if (!ret.image && ret.images && ret.images.length > 0) {
          ret.image = ret.images[0];
        }
        return ret;
      }
    }
  }
);

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
