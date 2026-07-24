// // src/models/user.model.js
// const { DataTypes, Model } = require('sequelize');
// const sequelize = require('../config/database');

// class User extends Model {}

// User.init({
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     username: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     role: {
//         type: DataTypes.STRING,
//         defaultValue: 'user'
//     },
//     avatar: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     status: {
//         type: DataTypes.STRING,
//         defaultValue: 'active'
//     }
// }, {
//     sequelize,
//     modelName: 'User',
//     tableName: 'users',
//     timestamps: true 
// });

// module.exports = User;