// src/repositories/base.repository.js
class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async findAll(options = {}) {
        return await this.model.findAll(options);
    }

    async findById(id) {
        return await this.model.findByPk(id);
    }

    async create(data) {
        return await this.model.create(data);
    }

    async update(id, data) {
        const record = await this.model.findByPk(id);
        if (record) {
            return await record.update(data);
        }
        return null;
    }

    async delete(id) {
        const record = await this.model.findByPk(id);
        if (record) {
            return await record.destroy();
        }
        return false;
    }
}

module.exports = BaseRepository;