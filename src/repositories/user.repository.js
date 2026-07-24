// src/repositories/user.repository.js
const BaseRepository = require('./base.repository');
const { User } = require('../models');

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    // Nơi chứa các custom queries liên quan đến User nếu cần sau này
    async findByEmail(email) {
        return await this.model.findOne({ where: { email } });
    }
}

module.exports = new UserRepository();