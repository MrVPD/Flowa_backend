import Brand from '../models/brandModel.js';
import Theme from '../models/themeModel.js';
import Product from '../models/productModel.js';
import Chat from '../models/chatModel.js';

// @desc    Tạo nội dung tự động cho chủ đề đã duyệt
// @route   POST /api/content/generate
// @access  Private
export const generateContent = async (req, res) => {
  try {
    const { brandId, themeId, socialPlatform, count } = req.body;
    
    // Kiểm tra thương hiệu
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
    }
    
    // Kiểm tra quyền truy cập thương hiệu
    if (brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền tạo nội dung cho thương hiệu này' });
    }
    
    // Kiểm tra chủ đề
    const theme = await Theme.findById(themeId);
    if (!theme) {
      return res.status(404).json({ message: 'Không tìm thấy chủ đề' });
    }
    
    // Lấy thông tin sản phẩm của thương hiệu
    const products = await Product.find({ brand: brandId, isActive: true });
    
    // Xây dựng prompt dựa trên nền tảng mạng xã hội
    const prompt = buildSocialMediaPrompt(brand, theme, products, socialPlatform, count);
    
    // Tạo nội dung (giả lập - trong thực tế sẽ gọi API AI)
    const generatedContents = await simulateContentGeneration(theme, socialPlatform, count || 1);
    
    // Lưu nội dung đã tạo vào chat
    const chat = await Chat.create({
      user: req.user._id,
      brand: brandId,
      title: `Nội dung tự động cho ${theme.name}`,
      aiModel: req.body.aiModel || 'openai',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'assistant',
          content: `Đã tạo ${generatedContents.length} nội dung cho chủ đề "${theme.name}" trên ${socialPlatform}.`,
        },
      ],
    });
    
    // Thêm nội dung đã tạo vào chat
    for (const content of generatedContents) {
      chat.generatedContent.push({
        themeId: theme._id,
        content: content,
      });
    }
    
    await chat.save();
    
    res.status(201).json({
      success: true,
      count: generatedContents.length,
      platform: socialPlatform,
      contents: generatedContents.map((content, index) => ({
        id: chat.generatedContent[index]._id,
        themeId: theme._id,
        themeName: theme.name,
        content,
        platform: socialPlatform,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tối ưu hóa nội dung cho từng nền tảng mạng xã hội
// @route   POST /api/content/optimize
// @access  Private
export const optimizeContent = async (req, res) => {
  try {
    const { contentId, platform } = req.body;
    
    // Tìm nội dung trong chat
    const chat = await Chat.findOne({ 'generatedContent._id': contentId });
    if (!chat) {
      return res.status(404).json({ message: 'Không tìm thấy nội dung' });
    }
    
    // Kiểm tra quyền truy cập
    if (chat.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền tối ưu nội dung này' });
    }
    
    // Tìm nội dung cụ thể
    const contentIndex = chat.generatedContent.findIndex(c => c._id.toString() === contentId);
    if (contentIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy nội dung' });
    }
    
    const content = chat.generatedContent[contentIndex];
    
    // Lấy thông tin thương hiệu và chủ đề
    const brand = await Brand.findById(chat.brand);
    const theme = await Theme.findById(content.themeId);
    
    // Tối ưu nội dung cho nền tảng (giả lập - trong thực tế sẽ gọi API AI)
    const optimizedContent = await optimizeForPlatform(content.content, platform, brand, theme);
    
    // Thêm nội dung đã tối ưu vào chat
    chat.generatedContent.push({
      themeId: content.themeId,
      content: optimizedContent,
      platform,
    });
    
    // Thêm tin nhắn về việc tối ưu
    chat.messages.push({
      role: 'system',
      content: `Tối ưu nội dung cho ${platform}`,
    });
    
    chat.messages.push({
      role: 'assistant',
      content: `Đã tối ưu nội dung cho ${platform}.`,
    });
    
    await chat.save();
    
    res.json({
      success: true,
      platform,
      content: {
        id: chat.generatedContent[chat.generatedContent.length - 1]._id,
        themeId: theme._id,
        themeName: theme.name,
        content: optimizedContent,
        platform,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Phân tích từ khóa và hashtag phổ biến
// @route   GET /api/content/keywords
// @access  Private
export const analyzeKeywords = async (req, res) => {
  try {
    const { brandId, themeId } = req.query;
    
    // Kiểm tra thương hiệu
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
    }
    
    // Kiểm tra quyền truy cập thương hiệu
    if (brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền phân tích từ khóa cho thương hiệu này' });
    }
    
    // Giả lập phân tích từ khóa (trong thực tế sẽ sử dụng API phân tích)
    const keywordAnalysis = simulateKeywordAnalysis(brand, themeId);
    
    res.json(keywordAnalysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tạo hình ảnh minh họa
// @route   POST /api/content/generate-image
// @access  Private
export const generateImage = async (req, res) => {
  try {
    const { prompt, brandId, themeId } = req.body;
    
    // Kiểm tra thương hiệu
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
    }
    
    // Kiểm tra quyền truy cập thương hiệu
    if (brand.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền tạo hình ảnh cho thương hiệu này' });
    }
    
    // Giả lập tạo hình ảnh (trong thực tế sẽ gọi API tạo hình ảnh như DALL-E, Midjourney)
    const imageUrl = simulateImageGeneration(prompt, brand);
    
    res.json({
      success: true,
      imageUrl,
      prompt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm hỗ trợ xây dựng prompt cho từng nền tảng mạng xã hội
const buildSocialMediaPrompt = (brand, theme, products, platform, count) => {
  let productInfo = '';
  if (products && products.length > 0) {
    productInfo = 'Sản phẩm:\n' + products.map(p => `- ${p.name}: ${p.description}`).join('\n');
  }

  let platformGuidelines = '';
  
  switch (platform.toLowerCase()) {
    case 'facebook':
      platformGuidelines = 'Tối ưu cho Facebook: Nội dung dài hơn, định dạng rõ ràng, sử dụng hashtag phù hợp.';
      break;
    case 'instagram':
      platformGuidelines = 'Tối ưu cho Instagram: Tập trung vào caption hấp dẫn, hashtag phong phú, kêu gọi hành động rõ ràng.';
      break;
    case 'tiktok':
      platformGuidelines = 'Tối ưu cho TikTok: Script ngắn gọn, xu hướng, nhịp điệu, gợi ý âm nhạc phù hợp.';
      break;
    case 'threads':
      platformGuidelines = 'Tối ưu cho Threads: Nội dung ngắn gọn, súc tích, dễ tiếp cận.';
      break;
    case 'linkedin':
      platformGuidelines = 'Tối ưu cho LinkedIn: Nội dung chuyên nghiệp, giá trị thông tin cao, định dạng rõ ràng.';
      break;
    case 'twitter':
    case 'x':
      platformGuidelines = 'Tối ưu cho Twitter/X: Nội dung ngắn gọn, súc tích, hashtag phù hợp, dưới 280 ký tự.';
      break;
    default:
      platformGuidelines = 'Tạo nội dung phù hợp với tiêu chuẩn mạng xã hội.';
  }

  return `
    Tạo ${count} nội dung cho thương hiệu "${brand.name}" sử dụng chủ đề "${theme.name}" cho nền tảng ${platform}.
    
    Thông tin thương hiệu: ${brand.description}
    Giọng điệu thương hiệu: ${brand.tone || 'chuyên nghiệp'}
    Mô tả chủ đề: ${theme.description || ''}
    Danh mục chủ đề: ${theme.category || 'chung'}
    Độ dài nội dung: Khoảng ${theme.contentLength || 500} ký tự
    
    ${productInfo}
    
    Từ khóa: ${brand.keywords ? brand.keywords.join(', ') : ''}
    Hashtag: ${brand.hashtags ? brand.hashtags.join(' ') : ''}
    
    ${platformGuidelines}
    
    Quy tắc nội dung: ${brand.contentRules || 'Hấp dẫn và phù hợp với đối tượng khách hàng.'}
  `;
};

// Hàm giả lập tạo nội dung (trong thực tế sẽ gọi API AI)
const simulateContentGeneration = async (theme, platform, count) => {
  const contents = [];
  
  for (let i = 0; i < count; i++) {
    let content = '';
    
    switch (platform.toLowerCase()) {
      case 'facebook':
        content = `📣 [Nội dung mẫu cho Facebook về chủ đề "${theme.name}"]

Bạn đã bao giờ tự hỏi làm thế nào để [vấn đề liên quan đến chủ đề]? Hôm nay chúng tôi sẽ chia sẻ với bạn [giải pháp/ý tưởng].

[Nội dung chi tiết về chủ đề, bao gồm 3-4 đoạn văn ngắn]

Đừng quên chia sẻ bài viết này nếu bạn thấy nó hữu ích và để lại bình luận về trải nghiệm của bạn!

#${theme.name.replace(/\s+/g, '')} #TipHữuÍch #ChiaSẻKiếnThức`;
        break;
      case 'instagram':
        content = `✨ [Tiêu đề hấp dẫn về chủ đề "${theme.name}"]

[1-2 đoạn văn ngắn về chủ đề, tập trung vào hình ảnh và cảm xúc]

Bạn đã có trải nghiệm nào tương tự chưa? Chia sẻ với chúng tôi trong phần bình luận nhé!

.
.
.

#${theme.name.replace(/\s+/g, '')} #Insta${theme.category || 'Life'} #TrendingNow #LifeStyle #Experience #MustTry`;
        break;
      case 'tiktok':
        content = `[Script TikTok về "${theme.name}"]

🎵 Nhạc đề xuất: [Tên bài hát phổ biến phù hợp với nội dung]

[0:00-0:05] Hook mở đầu: "Bạn sẽ không tin điều này về [chủ đề]..."
[0:05-0:15] Giới thiệu vấn đề: "[Vấn đề liên quan đến chủ đề]"
[0:15-0:25] Giải pháp: "[Cách giải quyết ngắn gọn]"
[0:25-0:30] Call-to-action: "Follow để xem thêm tips hữu ích!"

#${theme.name.replace(/\s+/g, '')} #FYP #TikTokTips`;
        break;
      case 'linkedin':
        content = `📊 [Tiêu đề chuyên nghiệp về chủ đề "${theme.name}"]

[Đoạn mở đầu chuyên nghiệp giới thiệu về chủ đề và tầm quan trọng của nó trong ngành]

Theo nghiên cứu gần đây, [dẫn chứng/số liệu liên quan đến chủ đề].

Dưới đây là 3 điểm chính cần lưu ý:
1. [Điểm chính thứ nhất]
2. [Điểm chính thứ hai]
3. [Điểm chính thứ ba]

[Đoạn kết luận với lời khuyên chuyên nghiệp]

Bạn có kinh nghiệm nào về vấn đề này? Hãy chia sẻ trong phần bình luận.

#${theme.name.replace(/\s+/g, '')} #ProfessionalDevelopment #IndustryInsights`;
        break;
      case 'twitter':
      case 'x':
        content = `[Nội dung ngắn gọn về "${theme.name}"]

Bạn có biết: [fact thú vị liên quan đến chủ đề]

Điều này quan trọng vì [lý do ngắn gọn].

Chia sẻ nếu bạn thấy hữu ích!

#${theme.name.replace(/\s+/g, '')} #QuickTips`;
        break;
      default:
        content = `[Nội dung mẫu cho chủ đề "${theme.name}"]

[Nội dung chi tiết về chủ đề]

#${theme.name.replace(/\s+/g, '')}`;
    }
    
    contents.push(content);
  }
  
  return contents;
};

// Hàm giả lập tối ưu nội dung cho từng nền tảng
const optimizeForPlatform = async (content, platform, brand, theme) => {
  // Trong thực tế sẽ gọi API AI để tối ưu
  let optimized = `[Nội dung đã tối ưu cho ${platform}]\n\n`;
  
  switch (platform.toLowerCase()) {
    case 'facebook':
      optimized += `📣 [Tiêu đề tối ưu cho Facebook về "${theme.name}"]\n\n`;
      optimized += content.replace(/\[.*?\]/g, '') + '\n\n';
      optimized += `#${brand.name.replace(/\s+/g, '')} #${theme.name.replace(/\s+/g, '')} ${brand.hashtags ? brand.hashtags.join(' ') : ''}`;
      break;
    case 'instagram':
      optimized += `✨ [Caption Instagram hấp dẫn về "${theme.name}"]\n\n`;
      optimized += content.replace(/\[.*?\]/g, '') + '\n\n';
      optimized += `.
.
.
\n`;
      optimized += `#${brand.name.replace(/\s+/g, '')} #${theme.name.replace(/\s+/g, '')} #Insta${theme.category || 'Life'} ${brand.hashtags ? brand.hashtags.join(' ') : ''} #FollowForMore`;
      break;
    default:
      optimized += content.replace(/\[.*?\]/g, '');
  }
  
  return optimized;
};

// Hàm giả lập phân tích từ khóa
const simulateKeywordAnalysis = (brand, themeId) => {
  // Trong thực tế sẽ sử dụng API phân tích từ khóa
  return {
    keywords: [
      { keyword: brand.name, volume: 1000, difficulty: 45, relevance: 95 },
      { keyword: brand.keywords ? brand.keywords[0] : 'marketing', volume: 5000, difficulty: 65, relevance: 85 },
      { keyword: brand.keywords ? brand.keywords[1] : 'content', volume: 8000, difficulty: 70, relevance: 80 },
      { keyword: 'social media marketing', volume: 12000, difficulty: 75, relevance: 75 },
      { keyword: 'content automation', volume: 3000, difficulty: 50, relevance: 90 },
    ],
    hashtags: [
      { hashtag: `#${brand.name.replace(/\s+/g, '')}`, popularity: 85, relevance: 95 },
      { hashtag: brand.hashtags ? brand.hashtags[0] : '#marketing', popularity: 95, relevance: 80 },
      { hashtag: brand.hashtags ? brand.hashtags[1] : '#content', popularity: 90, relevance: 85 },
      { hashtag: '#socialmedia', popularity: 98, relevance: 75 },
      { hashtag: '#contentcreator', popularity: 92, relevance: 90 },
    ],
    recommendations: [
      'Sử dụng hashtag chính của thương hiệu trong mọi bài đăng',
      'Kết hợp 3-5 hashtag phổ biến với 2-3 hashtag riêng của thương hiệu',
      'Tập trung vào từ khóa có độ khó trung bình và liên quan cao',
      'Theo dõi xu hướng hashtag hàng tuần để cập nhật nội dung',
    ]
  };
};

// Hàm giả lập tạo hình ảnh
const simulateImageGeneration = (prompt, brand) => {
  // Trong thực tế sẽ gọi API tạo hình ảnh
  return `https://example.com/generated-images/${brand._id}-${Date.now()}.jpg`;
};
