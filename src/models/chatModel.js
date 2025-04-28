import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    title: {
      type: String,
      default: 'New Chat',
    },
    messages: [messageSchema],
    aiModel: {
      type: String,
      enum: ['openai', 'anthropic', 'google', 'deepseek'],
      default: 'openai',
    },
    modelParameters: {
      temperature: {
        type: Number,
        default: 0.7,
      },
      maxTokens: {
        type: Number,
        default: 1000,
      },
      promptTemplate: {
        type: String,
      },
    },
    generatedContent: [
      {
        themeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Theme',
        },
        content: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
