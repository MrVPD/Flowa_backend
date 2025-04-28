import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    code: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: function() {
        return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      },
    },
    userData: {
      name: String,
      email: String,
      password: String,
    },
  },
  {
    timestamps: true,
  }
);

// Add an index on email for faster queries
verificationSchema.index({ email: 1 });

// Add an index on expiresAt for automatic cleanup
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Verification = mongoose.model('Verification', verificationSchema);

export default Verification; 