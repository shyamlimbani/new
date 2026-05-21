import { Request, Response } from 'express';
import Banner from '../models/Banner';
import asyncWrapper from '../utils/asyncWrapper';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';

export const getBanners = asyncWrapper(async (req: Request, res: Response) => {
  const query: any = {};
  // If not admin/authenticated or if public request, only fetch active banners
  if (req.query.active === 'true') {
    query.isActive = true;
  }
  const banners = await Banner.find(query).sort({ order: 1 });
  res.json(banners);
});

export const getBannerById = asyncWrapper(async (req: Request, res: Response) => {
  const banner = await Banner.findById(req.params.id);
  if (banner) {
    res.json(banner);
  } else {
    res.status(404);
    throw new Error('Banner not found');
  }
});

export const createBanner = asyncWrapper(async (req: Request, res: Response) => {
  const { title, link, order, isActive } = req.body;

  let imageUrl = '';
  if (req.file) {
    imageUrl = await uploadToCloudinary(req.file.buffer, 'banners');
  } else {
    res.status(400);
    throw new Error('Please upload a banner image');
  }

  const banner = new Banner({
    title,
    image: imageUrl,
    link,
    order: Number(order) || 0,
    isActive: isActive === 'true' || isActive === true,
  });

  const createdBanner = await banner.save();
  res.status(201).json(createdBanner);
});

export const updateBanner = asyncWrapper(async (req: Request, res: Response) => {
  const { title, link, order, isActive } = req.body;

  const banner = await Banner.findById(req.params.id);

  if (banner) {
    banner.title = title || banner.title;
    banner.link = link !== undefined ? link : banner.link;
    banner.order = order !== undefined ? Number(order) : banner.order;
    banner.isActive = isActive !== undefined ? (isActive === 'true' || isActive === true) : banner.isActive;

    if (req.file) {
      banner.image = await uploadToCloudinary(req.file.buffer, 'banners');
    }

    const updatedBanner = await banner.save();
    res.json(updatedBanner);
  } else {
    res.status(404);
    throw new Error('Banner not found');
  }
});

export const deleteBanner = asyncWrapper(async (req: Request, res: Response) => {
  const banner = await Banner.findById(req.params.id);

  if (banner) {
    await Banner.deleteOne({ _id: banner._id });
    res.json({ message: 'Banner removed' });
  } else {
    res.status(404);
    throw new Error('Banner not found');
  }
});
