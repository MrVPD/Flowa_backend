import Chat from '../models/chatModel.js';
import Brand from '../models/brandModel.js';
import Theme from '../models/themeModel.js';
import Product from '../models/productModel.js';

// @desc    Create a new chat session
// @route   POST /api/chat
// @access  Private
export const createChat = async (req, res) => {
  try {
    const { brandId, title, aiModel } = req.body;
    
    // Check if brand exists and user has access to it
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    // Create new chat session
    const chat = await Chat.create({
      user: req.user._id,
      brand: brandId,
      title: title || 'New Chat',
      aiModel: aiModel || 'openai',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant for the brand "${brand.name}". ${brand.description || ''} Please help create content that matches the brand's tone: ${brand.tone || 'professional'}.`,
        },
      ],
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's chat sessions
// @route   GET /api/chat
// @access  Private
export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .populate('brand', 'name')
      .select('title brand aiModel createdAt updatedAt')
      .sort('-updatedAt');
    
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get chat by ID with messages
// @route   GET /api/chat/:id
// @access  Private
export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('brand', 'name description tone')
      .populate('generatedContent.themeId', 'name');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user owns the chat
    if (chat.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send message to AI and get response
// @route   POST /api/chat/:id/message
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user owns the chat
    if (chat.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }

    // Add user message to chat
    chat.messages.push({
      role: 'user',
      content: message,
    });

    // In a real implementation, this would call the AI model API
    // For now, we'll simulate a response
    const aiResponse = await simulateAIResponse(chat, message);
    
    // Add AI response to chat
    chat.messages.push({
      role: 'assistant',
      content: aiResponse,
    });

    await chat.save();

    res.json({
      chatId: chat._id,
      message: {
        role: 'assistant',
        content: aiResponse,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate content based on theme
// @route   POST /api/chat/:id/generate
// @access  Private
export const generateContent = async (req, res) => {
  try {
    const { themeId, count } = req.body;
    
    const chat = await Chat.findById(req.params.id).populate('brand');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user owns the chat
    if (chat.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }

    // Get theme details
    const theme = await Theme.findById(themeId);
    if (!theme) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    // Get brand products for context
    const products = await Product.find({ brand: chat.brand._id, isActive: true });

    // Build prompt for content generation
    const prompt = buildContentGenerationPrompt(chat.brand, theme, products, count || 1);

    // Add system message to chat for content generation
    chat.messages.push({
      role: 'system',
      content: prompt,
    });

    // In a real implementation, this would call the AI model API
    // For now, we'll simulate content generation
    const generatedContents = await simulateContentGeneration(theme, count || 1);
    
    // Add generated content to chat
    for (const content of generatedContents) {
      chat.generatedContent.push({
        themeId: theme._id,
        content,
      });
    }

    // Add AI response to chat
    chat.messages.push({
      role: 'assistant',
      content: `I've generated ${generatedContents.length} content pieces based on the "${theme.name}" theme.`,
    });

    await chat.save();

    res.json({
      chatId: chat._id,
      generatedContent: generatedContents.map((content, index) => ({
        id: chat.generatedContent[chat.generatedContent.length - generatedContents.length + index]._id,
        themeId: theme._id,
        themeName: theme.name,
        content,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Parse command from chat message
// @route   POST /api/chat/:id/parse-command
// @access  Private
export const parseCommand = async (req, res) => {
  try {
    const { command } = req.body;
    
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user owns the chat
    if (chat.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }

    // Parse the command (e.g., "Create 5 product themes for bakery")
    const parsedCommand = parseCommandString(command, chat.brand);
    
    res.json(parsedCommand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to simulate AI response (in a real app, this would call an AI API)
const simulateAIResponse = async (chat, message) => {
  // This is a placeholder for actual AI API integration
  const brand = await Brand.findById(chat.brand);
  
  // Simple response based on message content
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    return `Hello! I'm your AI assistant for ${brand.name}. How can I help you today?`;
  } else if (message.toLowerCase().includes('help')) {
    return `I can help you create content for ${brand.name}. You can ask me to generate content based on specific themes, or we can chat about your content needs.`;
  } else {
    return `Thank you for your message about "${message.substring(0, 30)}...". I'm here to assist with content creation for ${brand.name}. Would you like me to generate some content ideas based on this?`;
  }
};

// Helper function to build prompt for content generation
const buildContentGenerationPrompt = (brand, theme, products, count) => {
  let productInfo = '';
  if (products && products.length > 0) {
    productInfo = 'Products:\n' + products.map(p => `- ${p.name}: ${p.description}`).join('\n');
  }

  return `
    Generate ${count} content pieces for the brand "${brand.name}" using the theme "${theme.name}".
    
    Brand description: ${brand.description}
    Brand tone: ${brand.tone || 'professional'}
    Theme description: ${theme.description || ''}
    Theme category: ${theme.category || 'general'}
    Content length: Approximately ${theme.contentLength || 500} characters
    
    ${productInfo}
    
    Keywords: ${brand.keywords ? brand.keywords.join(', ') : ''}
    Hashtags: ${brand.hashtags ? brand.hashtags.join(' ') : ''}
    
    Content rules: ${brand.contentRules || 'Be engaging and relevant to the audience.'}
  `;
};

// Helper function to simulate content generation (in a real app, this would call an AI API)
const simulateContentGeneration = async (theme, count) => {
  // This is a placeholder for actual AI content generation
  const contents = [];
  
  for (let i = 0; i < count; i++) {
    contents.push(`
      This is a simulated content piece for the theme "${theme.name}".
      
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, 
      nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam auctor, nisl eget ultricies aliquam,
      nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
      
      #SampleContent #${theme.name.replace(/\s+/g, '')}
    `);
  }
  
  return contents;
};

// Helper function to parse command string
const parseCommandString = (command, brandId) => {
  // This is a simplified command parser
  // In a real implementation, this would be more sophisticated
  
  const createMatch = command.match(/create\s+(\d+)\s+(.*?)\s+for\s+(.*)/i);
  if (createMatch) {
    const count = parseInt(createMatch[1]);
    const contentType = createMatch[2]; // e.g., "themes", "posts", etc.
    const subject = createMatch[3]; // e.g., "bakery", "summer campaign", etc.
    
    return {
      type: 'create',
      count,
      contentType,
      subject,
      brandId,
    };
  }
  
  // Default response if no pattern matches
  return {
    type: 'unknown',
    originalCommand: command,
    brandId,
  };
};
