import User from '../models/userModel.js';
import Brand from '../models/brandModel.js';
import Theme from '../models/themeModel.js';
import Chat from '../models/chatModel.js';

// @desc    Thống kê hiệu suất tạo nội dung
// @route   GET /api/analytics/content-stats
// @access  Private
export const getContentStats = async (req, res) => {
  try {
    const { brandId, startDate, endDate } = req.query;
    
    // Kiểm tra thương hiệu nếu có
    if (brandId) {
      const brand = await Brand.findById(brandId);
      if (!brand) {
        return res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
      }
      
      // Kiểm tra quyền truy cập thương hiệu
      if (brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Không có quyền xem thống kê cho thương hiệu này' });
      }
    }
    
    // Xây dựng bộ lọc thời gian
    const timeFilter = {};
    if (startDate) timeFilter.createdAt = { $gte: new Date(startDate) };
    if (endDate) {
      if (timeFilter.createdAt) {
        timeFilter.createdAt.$lte = new Date(endDate);
      } else {
        timeFilter.createdAt = { $lte: new Date(endDate) };
      }
    }
    
    // Trong thực tế, sẽ truy vấn cơ sở dữ liệu để lấy thống kê
    // Đây chỉ là mô phỏng
    
    // Giả lập thống kê hiệu suất
    const stats = {
      totalThemes: 24,
      totalContents: 156,
      approvalRate: 92.5, // tỷ lệ phần trăm
      averageGenerationTime: 2.3, // giây
      contentByTheme: [
        { themeName: 'Sản phẩm mới', count: 45 },
        { themeName: 'Mẹo sử dụng', count: 38 },
        { themeName: 'Câu chuyện khách hàng', count: 32 },
        { themeName: 'Tin tức ngành', count: 25 },
        { themeName: 'Khuyến mãi', count: 16 },
      ],
      contentByPlatform: [
        { platform: 'facebook', count: 52 },
        { platform: 'instagram', count: 48 },
        { platform: 'tiktok', count: 25 },
        { platform: 'linkedin', count: 18 },
        { platform: 'twitter', count: 13 },
      ],
      timeDistribution: [
        { month: 'Tháng 1', count: 12 },
        { month: 'Tháng 2', count: 15 },
        { month: 'Tháng 3', count: 22 },
        { month: 'Tháng 4', count: 28 },
        { month: 'Tháng 5', count: 32 },
        { month: 'Tháng 6', count: 47 },
      ],
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Báo cáo hiệu suất mạng xã hội
// @route   GET /api/analytics/social-performance
// @access  Private
export const getSocialPerformance = async (req, res) => {
  try {
    const { brandId, platform, startDate, endDate } = req.query;
    
    // Kiểm tra thương hiệu nếu có
    if (brandId) {
      const brand = await Brand.findById(brandId);
      if (!brand) {
        return res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
      }
      
      // Kiểm tra quyền truy cập thương hiệu
      if (brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Không có quyền xem báo cáo cho thương hiệu này' });
      }
    }
    
    // Trong thực tế, sẽ truy vấn API của các nền tảng mạng xã hội để lấy dữ liệu
    // Đây chỉ là mô phỏng
    
    // Giả lập báo cáo hiệu suất mạng xã hội
    const performance = {
      overview: {
        totalPosts: 87,
        totalEngagements: 12450,
        totalReach: 45600,
        totalImpressions: 68900,
        followerGrowth: 523,
      },
      platforms: [
        {
          platform: 'facebook',
          metrics: {
            posts: 32,
            likes: 4250,
            comments: 865,
            shares: 342,
            reach: 18500,
            impressions: 27800,
            followerGrowth: 215,
          },
        },
        {
          platform: 'instagram',
          metrics: {
            posts: 28,
            likes: 5680,
            comments: 732,
            saves: 423,
            reach: 15200,
            impressions: 22600,
            followerGrowth: 187,
          },
        },
        {
          platform: 'tiktok',
          metrics: {
            posts: 15,
            likes: 8750,
            comments: 1240,
            shares: 856,
            views: 124500,
            followerGrowth: 412,
          },
        },
        {
          platform: 'linkedin',
          metrics: {
            posts: 12,
            likes: 865,
            comments: 132,
            shares: 78,
            impressions: 8500,
            followerGrowth: 45,
          },
        },
      ],
      topPosts: [
        {
          id: '1',
          platform: 'instagram',
          content: 'Nội dung mẫu cho Instagram',
          metrics: {
            likes: 1250,
            comments: 187,
            saves: 95,
            reach: 4500,
          },
        },
        {
          id: '2',
          platform: 'tiktok',
          content: 'Nội dung mẫu cho TikTok',
          metrics: {
            likes: 3200,
            comments: 456,
            shares: 278,
            views: 45600,
          },
        },
        {
          id: '3',
          platform: 'facebook',
          content: 'Nội dung mẫu cho Facebook',
          metrics: {
            likes: 875,
            comments: 156,
            shares: 87,
            reach: 3800,
          },
        },
      ],
      timeDistribution: [
        { week: 'Tuần 1', engagements: 1250, reach: 5600 },
        { week: 'Tuần 2', engagements: 1580, reach: 6200 },
        { week: 'Tuần 3', engagements: 2150, reach: 7800 },
        { week: 'Tuần 4', engagements: 2450, reach: 8500 },
        { week: 'Tuần 5', engagements: 2780, reach: 9200 },
        { week: 'Tuần 6', engagements: 3240, reach: 10500 },
      ],
    };
    
    // Lọc theo nền tảng nếu có
    if (platform) {
      performance.platforms = performance.platforms.filter(p => p.platform === platform);
    }
    
    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Phân tích nội dung
// @route   GET /api/analytics/content-analysis
// @access  Private
export const getContentAnalysis = async (req, res) => {
  try {
    const { brandId, themeId } = req.query;
    
    // Kiểm tra thương hiệu nếu có
    if (brandId) {
      const brand = await Brand.findById(brandId);
      if (!brand) {
        return res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
      }
      
      // Kiểm tra quyền truy cập thương hiệu
      if (brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Không có quyền xem phân tích cho thương hiệu này' });
      }
    }
    
    // Kiểm tra chủ đề nếu có
    if (themeId) {
      const theme = await Theme.findById(themeId);
      if (!theme) {
        return res.status(404).json({ message: 'Không tìm thấy chủ đề' });
      }
    }
    
    // Trong thực tế, sẽ truy vấn và phân tích dữ liệu từ cơ sở dữ liệu
    // Đây chỉ là mô phỏng
    
    // Giả lập phân tích nội dung
    const analysis = {
      bestPerformingThemes: [
        { themeName: 'Câu chuyện khách hàng', engagementRate: 8.7, reachRate: 12.5 },
        { themeName: 'Mẹo sử dụng', engagementRate: 7.2, reachRate: 10.8 },
        { themeName: 'Sản phẩm mới', engagementRate: 6.5, reachRate: 9.2 },
      ],
      optimalPostingTimes: [
        { day: 'Thứ 2', time: '18:00 - 20:00', engagementRate: 6.8 },
        { day: 'Thứ 4', time: '12:00 - 14:00', engagementRate: 7.2 },
        { day: 'Thứ 6', time: '19:00 - 21:00', engagementRate: 8.5 },
        { day: 'Chủ nhật', time: '10:00 - 12:00', engagementRate: 7.9 },
      ],
      contentLengthAnalysis: [
        { platform: 'facebook', optimalLength: '1000-1500 ký tự', engagementRate: 6.2 },
        { platform: 'instagram', optimalLength: '150-300 ký tự', engagementRate: 7.8 },
        { platform: 'tiktok', optimalLength: '50-100 ký tự', engagementRate: 9.5 },
        { platform: 'linkedin', optimalLength: '1200-1800 ký tự', engagementRate: 5.4 },
      ],
      suggestions: [
        'Tăng tần suất đăng bài về câu chuyện khách hàng',
        'Tối ưu thời gian đăng bài vào buổi tối thứ 6 và sáng chủ nhật',
        'Điều chỉnh độ dài nội dung phù hợp với từng nền tảng',
        'Sử dụng nhiều hình ảnh và video cho nội dung trên Instagram và TikTok',
      ],
    };
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Đề xuất cải thiện
// @route   GET /api/analytics/improvement-suggestions
// @access  Private
export const getImprovementSuggestions = async (req, res) => {
  try {
    const { brandId } = req.query;
    
    // Kiểm tra thương hiệu nếu có
    if (brandId) {
      const brand = await Brand.findById(brandId);
      if (!brand) {
        return res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
      }
      
      // Kiểm tra quyền truy cập thương hiệu
      if (brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Không có quyền xem đề xuất cho thương hiệu này' });
      }
    }
    
    // Trong thực tế, sẽ phân tích dữ liệu và đưa ra đề xuất dựa trên AI
    // Đây chỉ là mô phỏng
    
    // Giả lập đề xuất cải thiện
    const suggestions = {
      contentStrategy: [
        'Tăng tần suất đăng bài về chủ đề "Câu chuyện khách hàng" lên 30%',
        'Giảm độ dài nội dung trên Facebook xuống 800-1000 ký tự',
        'Thêm nhiều hình ảnh và video vào nội dung trên Instagram',
        'Sử dụng nhiều câu hỏi và call-to-action trong nội dung',
      ],
      postingSchedule: [
        'Tối ưu lịch đăng bài vào khung giờ 18:00-20:00 các ngày trong tuần',
        'Tăng tần suất đăng bài vào cuối tuần',
        'Đăng nội dung quan trọng vào thứ 4 và thứ 6',
      ],
      platformSpecific: [
        {
          platform: 'facebook',
          suggestions: [
            'Sử dụng nhiều hình ảnh và infographic',
            'Tăng độ tương tác bằng cách đặt câu hỏi',
            'Sử dụng video ngắn 60-90 giây',
          ],
        },
        {
          platform: 'instagram',
          suggestions: [
            'Sử dụng nhiều hashtag phổ biến (10-15 hashtag)',
            'Đăng Stories hàng ngày',
            'Sử dụng Reels cho nội dung ngắn, hấp dẫn',
          ],
        },
        {
          platform: 'tiktok',
          suggestions: [
            'Tham gia các thử thách đang trending',
            'Sử dụng nhạc phổ biến',
            'Tạo nội dung ngắn, hài hước và giáo dục',
          ],
        },
      ],
    };
    
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
