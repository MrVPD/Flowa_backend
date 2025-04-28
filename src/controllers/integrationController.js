import User from '../models/userModel.js';
import Brand from '../models/brandModel.js';

// @desc    Quản lý API key
// @route   POST /api/integrations/api-keys
// @access  Private
export const manageApiKeys = async (req, res) => {
  try {
    const { service, key, action } = req.body;
    
    // Kiểm tra dịch vụ hợp lệ
    const validServices = ['openai', 'anthropic', 'google', 'deepseek'];
    if (!validServices.includes(service)) {
      return res.status(400).json({ message: 'Dịch vụ không hợp lệ' });
    }
    
    // Lấy thông tin người dùng
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    // Xử lý theo hành động
    if (action === 'add') {
      // Thêm API key mới
      user.apiKeys.push({
        service,
        key,
        isActive: true,
      });
    } else if (action === 'update') {
      // Cập nhật API key hiện có
      const keyIndex = user.apiKeys.findIndex(k => k.service === service);
      if (keyIndex >= 0) {
        user.apiKeys[keyIndex].key = key;
        user.apiKeys[keyIndex].isActive = true;
      } else {
        return res.status(400).json({ message: 'Không tìm thấy API key' });
      }
    } else if (action === 'delete') {
      // Xóa API key
      user.apiKeys = user.apiKeys.filter(k => k.service !== service);
    } else if (action === 'toggle') {
      // Bật/tắt API key
      const keyIndex = user.apiKeys.findIndex(k => k.service === service);
      if (keyIndex >= 0) {
        user.apiKeys[keyIndex].isActive = !user.apiKeys[keyIndex].isActive;
      } else {
        return res.status(400).json({ message: 'Không tìm thấy API key' });
      }
    } else {
      return res.status(400).json({ message: 'Hành động không hợp lệ' });
    }
    
    // Lưu thay đổi
    await user.save();
    
    res.json({
      success: true,
      apiKeys: user.apiKeys,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Thiết lập tham số cho mô hình AI
// @route   POST /api/integrations/ai-parameters
// @access  Private
export const setAiParameters = async (req, res) => {
  try {
    const { service, parameters } = req.body;
    
    // Kiểm tra dịch vụ hợp lệ
    const validServices = ['openai', 'anthropic', 'google', 'deepseek'];
    if (!validServices.includes(service)) {
      return res.status(400).json({ message: 'Dịch vụ không hợp lệ' });
    }
    
    // Kiểm tra tham số
    if (!parameters || typeof parameters !== 'object') {
      return res.status(400).json({ message: 'Tham số không hợp lệ' });
    }
    
    // Trong thực tế, sẽ lưu tham số vào cơ sở dữ liệu
    // Đây chỉ là mô phỏng
    
    res.json({
      success: true,
      service,
      parameters,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Theo dõi sử dụng API
// @route   GET /api/integrations/api-usage
// @access  Private
export const getApiUsage = async (req, res) => {
  try {
    const { service, startDate, endDate } = req.query;
    
    // Trong thực tế, sẽ truy vấn dữ liệu sử dụng API từ cơ sở dữ liệu
    // Đây chỉ là mô phỏng
    
    // Giả lập dữ liệu sử dụng API
    const usage = {
      overview: {
        totalRequests: 1250,
        totalTokens: 3750000,
        estimatedCost: 75.5, // USD
      },
      byService: [
        {
          service: 'openai',
          requests: 850,
          tokens: 2550000,
          cost: 51.0,
        },
        {
          service: 'anthropic',
          requests: 250,
          tokens: 750000,
          cost: 15.0,
        },
        {
          service: 'google',
          requests: 150,
          tokens: 450000,
          cost: 9.5,
        },
      ],
      timeDistribution: [
        { day: '2025-04-18', requests: 120, tokens: 360000 },
        { day: '2025-04-19', requests: 135, tokens: 405000 },
        { day: '2025-04-20', requests: 180, tokens: 540000 },
        { day: '2025-04-21', requests: 210, tokens: 630000 },
        { day: '2025-04-22', requests: 245, tokens: 735000 },
        { day: '2025-04-23', requests: 175, tokens: 525000 },
        { day: '2025-04-24', requests: 185, tokens: 555000 },
      ],
    };
    
    // Lọc theo dịch vụ nếu có
    if (service) {
      usage.byService = usage.byService.filter(u => u.service === service);
    }
    
    res.json(usage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tích hợp với N8N
// @route   POST /api/integrations/n8n/webhook
// @access  Public (sử dụng xác thực riêng)
export const handleN8NWebhook = async (req, res) => {
  try {
    const { event, data, secret } = req.body;
    
    // Kiểm tra secret key (trong thực tế nên sử dụng biện pháp xác thực mạnh hơn)
    if (!secret || secret !== process.env.N8N_WEBHOOK_SECRET) {
      return res.status(401).json({ message: 'Không được phép' });
    }
    
    // Xử lý sự kiện từ N8N
    switch (event) {
      case 'content_created':
        // Xử lý sự kiện tạo nội dung
        console.log('Nội dung được tạo:', data);
        break;
      case 'post_scheduled':
        // Xử lý sự kiện lên lịch đăng bài
        console.log('Bài đăng được lên lịch:', data);
        break;
      case 'post_published':
        // Xử lý sự kiện đăng bài
        console.log('Bài đăng được xuất bản:', data);
        break;
      default:
        console.log('Sự kiện không xác định:', event);
    }
    
    res.json({
      success: true,
      message: 'Webhook đã được xử lý',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Kết nối với hệ thống N8N
// @route   POST /api/integrations/n8n/connect
// @access  Private (Admin)
export const connectN8N = async (req, res) => {
  try {
    const { n8nUrl, apiKey } = req.body;
    
    // Kiểm tra thông tin kết nối
    if (!n8nUrl || !apiKey) {
      return res.status(400).json({ message: 'URL và API key là bắt buộc' });
    }
    
    // Trong thực tế, sẽ lưu thông tin kết nối vào cơ sở dữ liệu và kiểm tra kết nối
    // Đây chỉ là mô phỏng
    
    res.json({
      success: true,
      message: 'Kết nối thành công với N8N',
      connection: {
        url: n8nUrl,
        status: 'connected',
        connectedAt: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tạo workflow tự động trong N8N
// @route   POST /api/integrations/n8n/workflow
// @access  Private (Admin)
export const createN8NWorkflow = async (req, res) => {
  try {
    const { name, triggers, actions } = req.body;
    
    // Kiểm tra thông tin workflow
    if (!name || !triggers || !actions) {
      return res.status(400).json({ message: 'Tên, triggers và actions là bắt buộc' });
    }
    
    // Trong thực tế, sẽ gọi API của N8N để tạo workflow
    // Đây chỉ là mô phỏng
    
    res.json({
      success: true,
      message: 'Workflow đã được tạo',
      workflow: {
        id: Date.now().toString(),
        name,
        triggers,
        actions,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cung cấp API cho các ứng dụng khác
// @route   GET /api/integrations/public-api/documentation
// @access  Public
export const getApiDocumentation = async (req, res) => {
  try {
    // Trong thực tế, sẽ trả về tài liệu API thực tế
    // Đây chỉ là mô phỏng
    
    const documentation = {
      openapi: '3.0.0',
      info: {
        title: 'Flowa API',
        version: '1.0.0',
        description: 'API công khai của Flowa cho phép tích hợp với các ứng dụng khác',
      },
      servers: [
        {
          url: 'https://api.flowa.example.com/v1',
          description: 'Production server',
        },
      ],
      paths: {
        '/content/generate': {
          post: {
            summary: 'Tạo nội dung',
            description: 'Tạo nội dung tự động dựa trên thương hiệu và chủ đề',
            parameters: [
              {
                name: 'api_key',
                in: 'header',
                required: true,
                schema: {
                  type: 'string',
                },
                description: 'API key để xác thực',
              },
            ],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      brandId: {
                        type: 'string',
                        description: 'ID của thương hiệu',
                      },
                      themeId: {
                        type: 'string',
                        description: 'ID của chủ đề',
                      },
                      platform: {
                        type: 'string',
                        description: 'Nền tảng mạng xã hội',
                      },
                      count: {
                        type: 'integer',
                        description: 'Số lượng nội dung cần tạo',
                      },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Thành công',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: {
                          type: 'boolean',
                        },
                        contents: {
                          type: 'array',
                          items: {
                            type: 'object',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    
    res.json(documentation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
