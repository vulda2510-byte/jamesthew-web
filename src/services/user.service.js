// src/services/user.service.js
const userRepository = require('../repositories/user.repository');

const getAllUsers = async () => {
    return await userRepository.findAll({
        attributes: { exclude: ['password'] } // Không trả về password
    });
};

module.exports = {
    getAllUsers
};