'use strict';
const { Contest, User } = require('../models');

async function seedContests() {
  try {
    // Tìm 1 tài khoản Admin hoặc VIP để làm tác giả
    const author = await User.findOne({ where: { role: ['admin', 'vip', 'premium'] } });
    if (!author) {
      console.log('❌ Cần có ít nhất 1 tài khoản Admin/VIP/Premium trong Database để seed Contest.');
      return;
    }

    const sampleContests = [
      {
        title: 'Master Chef 2026 Championship',
        slug: 'master-chef-2026-championship',
        description: 'Cuộc thi ẩm thực đỉnh cao dành cho các đầu bếp tài năng tranh tài trực tiếp.',
        type: 'offline',
        scale: 'large',
        status: 'ongoing',
        start_date: new Date('2026-08-01'),
        end_date: new Date('2026-08-15'),
        location: 'Trung tâm Hội nghị Quốc gia, Hà Nội',
        rules: 'Thí sinh có mặt trước 30 phút. Chuẩn bị nguyên liệu sơ chế trước.',
        prize_details: '10,000 USD + VIP Membership 1 năm',
        is_featured: true,
        author_id: author.id
      },
      {
        title: 'Sáng Tạo Món Ăn Healthy Online',
        slug: 'sang-tao-mon-an-healthy-online',
        description: 'Đăng tải công thức món ăn Healthy độc đáo của bạn để nhận lượt bình chọn từ cộng đồng!',
        type: 'online',
        scale: 'small',
        status: 'ongoing',
        start_date: new Date('2026-07-01'),
        end_date: new Date('2026-07-31'),
        rules: 'Đăng tải hình ảnh thực tế + công thức chi tiết.',
        prize_details: ' Voucher 2,000,000 VNĐ mua sắm dụng cụ bếp',
        is_featured: false,
        author_id: author.id
      },
      {
        title: 'Vua Món Nướng BBQ Mùa Hè',
        slug: 'vua-mon-nuong-bbq-mua-he',
        description: 'Sự kiện thi đấu trực tiếp tại bãi biển dành cho các tín đồ đồ nướng.',
        type: 'offline',
        scale: 'small',
        status: 'upcoming',
        start_date: new Date('2026-09-01'),
        end_date: new Date('2026-09-02'),
        location: 'Bãi biển Mỹ Khê, Đà Nẵng',
        rules: 'Ban tổ chức cung cấp bếp nướng và than.',
        prize_details: 'Cúp Vàng BBQ + Bếp nướng cao cấp',
        is_featured: false,
        author_id: author.id
      }
    ];

    for (const data of sampleContests) {
      await Contest.findOrCreate({ where: { slug: data.slug }, defaults: data });
    }

    console.log('✅ Seed dữ liệu Contest thành công!');
  } catch (error) {
    console.error('❌ Lỗi Seed Contest:', error);
  }
}

module.exports = seedContests;