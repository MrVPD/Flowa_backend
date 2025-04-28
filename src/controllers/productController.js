import Product from '../models/productModel.js';
import Brand from '../models/brandModel.js';

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Brand Manager)
export const createProduct = async (req, res) => {
  try {
    const { name, description, brandId, features, benefits, targetAudience } = req.body;
    
    // Check if brand exists and user has access to it
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    // Check if user owns the brand or is an admin
    if (brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create products for this brand' });
    }
    
    // Create new product
    const product = await Product.create({
      name,
      description,
      brand: brandId,
      features: features || [],
      benefits: benefits || [],
      targetAudience,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products for a brand
// @route   GET /api/products/brand/:brandId
// @access  Private
export const getProductsByBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    
    // Check if brand exists and user has access to it
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    // Check if user owns the brand or is an admin
    if (brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view products for this brand' });
    }
    
    const products = await Product.find({ brand: brandId, isActive: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a product by ID
// @route   GET /api/products/:id
// @access  Private
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('brand');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user owns the brand or is an admin
    if (product.brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this product' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Brand Manager)
export const updateProduct = async (req, res) => {
  try {
    const { name, description, features, benefits, targetAudience } = req.body;
    
    const product = await Product.findById(req.params.id).populate('brand');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user owns the brand or is an admin
    if (product.brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    // Update product
    product.name = name || product.name;
    product.description = description || product.description;
    product.features = features || product.features;
    product.benefits = benefits || product.benefits;
    product.targetAudience = targetAudience || product.targetAudience;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product (soft delete)
// @route   DELETE /api/products/:id
// @access  Private (Brand Manager)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('brand');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user owns the brand or is an admin
    if (product.brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    // Soft delete
    product.isActive = false;
    await product.save();

    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload product images
// @route   POST /api/products/:id/images
// @access  Private (Brand Manager)
export const uploadProductImages = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('brand');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user owns the brand or is an admin
    if (product.brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one file' });
    }

    // Add new image URLs to product
    const imageUrls = req.files.map(file => file.path);
    product.images = [...product.images, ...imageUrls];
    await product.save();

    res.json({ message: 'Images uploaded successfully', images: product.images });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
