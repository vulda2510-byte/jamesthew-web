// src/models/userProfile.model.js

module.exports = (sequelize, DataTypes) => {
    const UserProfile = sequelize.define('UserProfile', {
        id: {
            type: DataTypes.CHAR(100),
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.CHAR(100),
            allowNull: false,
            references: {
                model: 'users', // Trỏ tới bảng users
                key: 'id'
            }
        },
        first_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        last_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        display_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        avatar_url: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        cover_image_url: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        biography: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        date_of_birth: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        gender: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        country: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        website: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        cooking_style: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        focus: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        location: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        is_public: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'user_profiles', // Khớp chính xác với tên bảng trong DB của bạn
        timestamps: true,           // Tự động quản lý created_at, updated_at
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true              // Kích hoạt Soft Delete (do DB của bạn có cột deleted_at)
    });

    // Thiết lập mối quan hệ (Association)
    UserProfile.associate = (models) => {
        // Một Profile thuộc về Một User
        UserProfile.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return UserProfile;
};