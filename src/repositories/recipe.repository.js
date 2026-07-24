'use strict';
// Sửa lại dòng require ở trên cùng thành như sau:
const { Op } = require('sequelize');
const { Recipe, Category, User, Tag, Ingredient, RecipeStep, RecipeImage } = require('../models');

class RecipeRepository {
  constructor() {
    this.defaultIncludes = [
      { model: User, as: 'author' },
      { model: Category, as: 'categories' },
      { model: Ingredient, as: 'ingredients' },
      { model: Tag, as: 'tags' },
      { model: RecipeStep, as: 'steps' },
      { model: RecipeImage, as: 'images' }
    ];
  }

  create(data) {
    return Recipe.create(data);
  }

async findById(id) {
    return Recipe.findOne({
      where: { id },
      include: [
        {
          model: Category,
          as: 'categories',
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'email']
        },
        {
          model: Ingredient,
          as: 'ingredients',
          through: { attributes: ['quantity', 'unit', 'note'] }
        },
        {
          model: RecipeStep,
          as: 'steps'
        },
        {
          model: Tag,
          as: 'tags',
          through: { attributes: [] }
        },
        {
          model: RecipeImage,
          as: 'images' // Bổ sung hình ảnh cho trang detail
        }
      ]
    });
  }

  async findBySlug(slug) {
    return Recipe.findOne({
      where: { slug },
      include: [
        {
          model: Category,
          as: 'categories',
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'email']
        },
        {
          model: Ingredient,
          as: 'ingredients',
          through: { attributes: ['quantity', 'unit', 'note'] }
        },
        {
          model: RecipeStep,
          as: 'steps'
        },
        {
          model: Tag,
          as: 'tags',
          through: { attributes: [] }
        },
        {
          model: RecipeImage,
          as: 'images' // Bổ sung hình ảnh cho trang detail
        }
      ]
    });
  }

async findAll(filters = {}) {
    // 1. Tách các tham số từ Frontend (có giá trị mặc định nếu không truyền)
    const { 
      page = 1, 
      limit = 6, 
      search = '', 
      category = '', 
      difficulty = '', 
      sort = 'newest',
      status,
      is_featured,
      is_premium
    } = filters;

    // 2. Khởi tạo điều kiện lọc cho bảng Recipe
    const whereCondition = {};

    // Chỉ lấy các công thức đã publish (hoặc theo status truyền vào)
    if (status) whereCondition.status = status;
    
    // Lọc theo độ khó
    if (difficulty) whereCondition.difficulty = difficulty;

    // Lọc trạng thái nổi bật / premium
    if (is_featured !== undefined) whereCondition.is_featured = is_featured === 'true';
    if (is_premium !== undefined) whereCondition.is_premium = is_premium === 'true';

    // Tìm kiếm theo tên (title) sử dụng toán tử LIKE
    if (search) {
      whereCondition.title = {
        [Op.like]: `%${search}%`
      };
    }

    // 3. Xử lý logic Phân trang (Pagination)
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);
    const offset = (parsedPage - 1) * parsedLimit;

    // 4. Xử lý Sắp xếp (Sorting)
    let orderClause = [['created_at', 'DESC']]; // Mặc định Mới nhất
    if (sort === 'oldest') orderClause = [['created_at', 'ASC']];
    // Bạn có thể thêm các kiểu sort khác ở đây

    // 5. Cấu hình bảng Category (Nếu có lọc theo category thì thêm where vào đây)
    const categoryInclude = {
      model: Category,
      as: 'categories',
      through: { attributes: [] }
    };
    if (category) {
      categoryInclude.where = { slug: category }; // Giả sử Frontend gửi lên slug của category
    }

    // 6. Thực thi truy vấn
    return Recipe.findAndCountAll({
      where: whereCondition,
      limit: parsedLimit,
      offset: offset,
      order: orderClause,
      include: [
        categoryInclude,
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'email']
        }
      ],
      distinct: true // Bắt buộc phải có khi dùng limit/offset kết hợp với include N-N
    });
  }

  async update(id, data) {
    await Recipe.update(data, {
      where: { id }
    });
    return this.findById(id);
  }

  async delete(id) {
    const deletedCount = await Recipe.destroy({
      where: { id }
    });
    return deletedCount > 0;
  }
}

module.exports = new RecipeRepository();