import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    logo: {
      type: String, // URL to the logo image
    },
    images: [
      {
        type: String, // URLs to brand images
      },
    ],
    tone: {
      type: String,
      default: 'professional',
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    hashtags: [
      {
        type: String,
        trim: true,
      },
    ],
    postingSchedule: {
      preferredTimes: [
        {
          day: {
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          },
          time: {
            type: String, // Format: HH:MM
          },
        },
      ],
    },
    contentRules: {
      type: String, // Do's and don'ts for content
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

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;
