import User from '../models/userModel.js';
import Brand from '../models/brandModel.js';
import Chat from '../models/chatModel.js';

// Model cho tài khoản mạng xã hội và bài đăng
// Trong thực tế, nên tạo các model riêng trong thư mục models
// Đây chỉ là mô phỏng cho mục đích demo
const SocialAccount = {
  findByUser: async (userId) => {
    // Giả lập truy vấn cơ sở dữ liệu
    return [
      { id: '1', platform: 'facebook', name: 'Facebook Page', isConnected: true },
      { id: '2', platform: 'instagram', name: 'Instagram Business', isConnected: true },
      { id: '3', platform: 'tiktok', name: 'TikTok Creator', isConnected: false },
    ];
  },
  
  findByBrand: async (brandId) => {
    // Giả lập truy vấn cơ sở dữ liệu
    return [
      { id: '1', platform: 'facebook', name: 'Facebook Page', isConnected: true },
      { id: '2', platform: 'instagram', name: 'Instagram Business', isConnected: true },
    ];
  }
};

const SocialPost = {
  create: async (data) => {
    // Giả lập tạo bài đăng
    return {
      id: Date.now().toString(),
      ...data,
      status: 'scheduled',
      createdAt: new Date(),
    };
  },
  
  findByUser: async (userId, filters = {}) => {
    // Giả lập truy vấn cơ sở dữ liệu
    return [
      { 
        id: '1', 
        platform: 'facebook', 
        content: 'Nội dung mẫu cho Facebook', 
        status: 'published',
        publishedAt: new Date(),
        metrics: {
          likes: 45,
          comments: 12,
          shares: 8
        }
      },
      { 
        id: '2', 
        platform: 'instagram', 
        content: 'Nội dung mẫu cho Instagram', 
        status: 'scheduled',
        scheduledFor: new Date(Date.now() + 86400000), // 1 ngày sau
      },
    ];
  }
};

// @desc    Kết nối tài khoản mạng xã hội
// @route   POST /api/social/connect
// @access  Private
export const connectSocialAccount = async (req, res) => {
  try {
    const { platform, credentials } = req.body;
    
    // Trong thực tế, sẽ sử dụng OAuth hoặc API của nền tảng để xác thực
    // Đây chỉ là mô phỏng
    
    // Kiểm tra nền tảng được hỗ trợ
    const supportedPlatforms = ['facebook', 'instagram', 'tiktok', 'twitter', 'linkedin', 'threads'];
    if (!supportedPlatforms.includes(platform)) {
      return res.status(400).json({ message: 'Nền tảng không được hỗ trợ' });
    }
    
    // Mô phỏng kết nối thành công
    const connection = {
      userId: req.user._id,
      platform,
      accountId: `${platform}_${Date.now()}`,
      accountName: credentials.accountName || `${platform} Account`,
      token: 'sample_token_' + Date.now(),
      isConnected: true,
      connectedAt: new Date(),
    };
    
    res.status(201).json({
      success: true,
      connection,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách tài khoản mạng xã hội đã kết nối
// @route   GET /api/social/accounts
// @access  Private
export const getSocialAccounts = async (req, res) => {
  try {
    // Lấy danh sách tài khoản đã kết nối
    const accounts = await SocialAccount.findByUser(req.user._id);
    
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Đăng bài lên mạng xã hội
// @route   POST /api/social/post
// @access  Private
export const createSocialPost = async (req, res) => {
  try {
    const { 
      contentId, 
      platforms, 
      scheduledTime,
      brandId
    } = req.body;
    
    // Kiểm tra thương hiệu
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
    }
    
    // Kiểm tra quyền truy cập thương hiệu
    if (brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền đăng bài cho thương hiệu này' });
    }
    
    // Tìm nội dung trong chat
    const chat = await Chat.findOne({ 'generatedContent._id': contentId });
    if (!chat) {
      return res.status(404).json({ message: 'Không tìm thấy nội dung' });
    }
    
    // Tìm nội dung cụ thể
    const contentIndex = chat.generatedContent.findIndex(c => c._id.toString() === contentId);
    if (contentIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy nội dung' });
    }
    
    const content = chat.generatedContent[contentIndex];
    
    // Lấy danh sách tài khoản mạng xã hội của thương hiệu
    const accounts = await SocialAccount.findByBrand(brandId);
    
    // Kiểm tra các nền tảng được chọn
    const validPlatforms = platforms.filter(platform => 
      accounts.some(account => account.platform === platform && account.isConnected)
    );
    
    if (validPlatforms.length === 0) {
      return res.status(400).json({ message: 'Không có tài khoản mạng xã hội nào được kết nối cho các nền tảng đã chọn' });
    }
    
    // Tạo bài đăng cho mỗi nền tảng
    const posts = [];
    for (const platform of validPlatforms) {
      // Trong thực tế, sẽ gọi API của từng nền tảng để đăng bài
      // Đây chỉ là mô phỏng
      const post = await SocialPost.create({
        userId: req.user._id,
        brandId,
        contentId,
        platform,
        content: content.content,
        scheduledFor: scheduledTime ? new Date(scheduledTime) : new Date(),
        status: scheduledTime ? 'scheduled' : 'published',
      });
      
      posts.push(post);
    }
    
    res.status(201).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách bài đăng
// @route   GET /api/social/posts
// @access  Private
export const getSocialPosts = async (req, res) => {
  try {
    const { brandId, platform, status } = req.query;
    
    // Xây dựng bộ lọc
    const filters = {};
    if (brandId) filters.brandId = brandId;
    if (platform) filters.platform = platform;
    if (status) filters.status = status;
    
    // Lấy danh sách bài đăng
    const posts = await SocialPost.findByUser(req.user._id, filters);
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lên lịch đăng bài
// @route   POST /api/social/schedule
// @access  Private
export const schedulePosts = async (req, res) => {
  try {
    const { posts } = req.body;
    
    if (!Array.isArray(posts) || posts.length === 0) {
      return res.status(400).json({ message: 'Cần cung cấp danh sách bài đăng' });
    }
    
    // Trong thực tế, sẽ lưu lịch đăng bài vào cơ sở dữ liệu và sử dụng job scheduler
    // Đây chỉ là mô phỏng
    const scheduledPosts = posts.map(post => ({
      ...post,
      status: 'scheduled',
      scheduledAt: new Date(),
    }));
    
    res.json({
      success: true,
      scheduledPosts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xử lý trạng thái đăng bài
// @route   PUT /api/social/posts/:id/status
// @access  Private
export const updatePostStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Kiểm tra trạng thái hợp lệ
    const validStatuses = ['draft', 'scheduled', 'published', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }
    
    // Trong thực tế, sẽ cập nhật trạng thái trong cơ sở dữ liệu
    // Đây chỉ là mô phỏng
    const updatedPost = {
      id: req.params.id,
      status,
      updatedAt: new Date(),
    };
    
    res.json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
