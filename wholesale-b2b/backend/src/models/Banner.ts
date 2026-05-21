import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
}

const bannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // Cloudinary URL
      required: true,
    },
    link: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model<IBanner>('Banner', bannerSchema);

export default Banner;
