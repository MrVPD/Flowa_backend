import Brand from '../models/brandModel.js';
import User from '../models/userModel.js';

// @desc    Create a new brand
// @route   POST /api/brands
// @access  Private (Brand Manager)
export const createBrand = async (req, res) => {
  try {
    const { name, description, tone, keywords, hashtags, contentRules } = req.body;
    
    // Create new brand
    const brand = await Brand.create({
      name,
      description,
      owner: req.user._id,
      tone,
      keywords: keywords || [],
      hashtags: hashtags || [],
      contentRules,
    });

    // Add brand to user's brands
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { brands: brand._id } },
      { new: true }
    );

    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all brands for a user
// @route   GET /api/brands
// @access  Private
export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ owner: req.user._id });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a brand by ID
// @route   GET /api/brands/:id
// @access  Private
export const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Check if user owns the brand or is an admin
    if (brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this brand' });
    }

    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a brand
// @route   PUT /api/brands/:id
// @access  Private (Brand Manager)
export const updateBrand = async (req, res) => {
  try {
    const { name, description, tone, keywords, hashtags, contentRules } = req.body;
    
    const brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Check if user owns the brand or is an admin
    if (brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this brand' });
    }

    // Update brand
    brand.name = name || brand.name;
    brand.description = description || brand.description;
    brand.tone = tone || brand.tone;
    brand.keywords = keywords || brand.keywords;
    brand.hashtags = hashtags || brand.hashtags;
    brand.contentRules = contentRules || brand.contentRules;

    const updatedBrand = await brand.save();
    res.json(updatedBrand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a brand (soft delete)
// @route   DELETE /api/brands/:id
// @access  Private (Brand Manager)
export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Check if user owns the brand or is an admin
    if (brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this brand' });
    }

    // Soft delete
    brand.isActive = false;
    await brand.save();

    res.json({ message: 'Brand removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload brand logo
// @route   POST /api/brands/:id/logo
// @access  Private (Brand Manager)
export const uploadBrandLogo = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Check if user owns the brand or is an admin
    if (brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this brand' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    // Update brand with logo URL
    brand.logo = req.file.path;
    await brand.save();

    res.json({ message: 'Logo uploaded successfully', logo: brand.logo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload brand images
// @route   POST /api/brands/:id/images
// @access  Private (Brand Manager)
export const uploadBrandImages = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Check if user owns the brand or is an admin
    if (brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this brand' });
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one file' });
    }

    // Add new image URLs to brand
    const imageUrls = req.files.map(file => file.path);
    brand.images = [...brand.images, ...imageUrls];
    await brand.save();

    res.json({ message: 'Images uploaded successfully', images: brand.images });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
