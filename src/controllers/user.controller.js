// src/controllers/user.controller.js
const userService = require('../services/user.service');

const createUser = async (req, res, next) => {
    try {
        // Tạm thời log ra body nhận được từ Postman
        console.log("Dữ liệu từ Postman:", req.body);
        
        res.status(201).json({
            success: true,
            message: "Tạo user thành công",
            data: {
                id: "uuid-gia-lap-de-test-1234",
                ...req.body
            }
        });
    } catch (error) {
        next(error);
    }
};

const getUsers = async (req, res, next) => {
    try {
        // Nếu userService đã viết xong, bạn có thể mở comment dòng dưới
        // const users = await userService.getAllUsers();
        
        res.status(200).json({ 
            success: true,
            message: "Lấy danh sách user thành công",
            // data: users 
        });
    } catch (error) {
        next(error);
    }
};

// Export tất cả các hàm cùng một lúc
module.exports = {
    createUser,
    getUsers
};