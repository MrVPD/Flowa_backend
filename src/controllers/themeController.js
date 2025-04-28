import Theme from '../models/themeModel.js';
import Brand from '../models/brandModel.js';

// @desc    Create a new content theme
// @route   POST /api/themes
// @access  Private (Brand Manager)
export const createTheme = async (req, res) => {
  try {
    const { name, description, brandId, category, contentLength, tone, style } = req.body;
    
    // Check if brand exists and user has access to it
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    // Check if user owns the brand or is an admin
    if (brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create themes for this brand' });
    }
    
    // Create new theme
    const theme = await Theme.create({
      name,
      description,
      brand: brandId,
      category,
      contentLength,
      tone,
      style,
    });

    res.status(201).json(theme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all themes for a brand
// @route   GET /api/themes/brand/:brandId
// @access  Private
export const getThemesByBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    
    // Check if brand exists and user has access to it
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    // Check if user owns the brand or is an admin
    if (brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view themes for this brand' });
    }
    
    const themes = await Theme.find({ brand: brandId, isActive: true });
    res.json(themes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a theme by ID
// @route   GET /api/themes/:id
// @access  Private
export const getThemeById = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id).populate('brand');
    
    if (!theme) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    // Check if user owns the brand or is an admin
    if (theme.brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this theme' });
    }

    res.json(theme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a theme
// @route   PUT /api/themes/:id
// @access  Private (Brand Manager)
export const updateTheme = async (req, res) => {
  try {
    const { name, description, category, contentLength, tone, style } = req.body;
    
    const theme = await Theme.findById(req.params.id).populate('brand');
    
    if (!theme) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    // Check if user owns the brand or is an admin
    if (theme.brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this theme' });
    }

    // Update theme
    theme.name = name || theme.name;
    theme.description = description || theme.description;
    theme.category = category || theme.category;
    theme.contentLength = contentLength || theme.contentLength;
    theme.tone = tone || theme.tone;
    theme.style = style || theme.style;

    const updatedTheme = await theme.save();
    res.json(updatedTheme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a theme (soft delete)
// @route   DELETE /api/themes/:id
// @access  Private (Brand Manager)
export const deleteTheme = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id).populate('brand');
    
    if (!theme) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    // Check if user owns the brand or is an admin
    if (theme.brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this theme' });
    }

    // Soft delete
    theme.isActive = false;
    await theme.save();

    res.json({ message: 'Theme removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
