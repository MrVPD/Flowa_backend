import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    category: {
      type: String,
      enum: ['news', 'knowledge', 'entertainment', 'other'],
      default: 'other',
    },
    contentLength: {
      type: Number, // Preferred content length in characters
      default: 500,
    },
    tone: {
      type: String,
      default: 'professional',
    },
    style: {
      type: String,
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

const Theme = mongoose.model('Theme', themeSchema);

export default Theme;
