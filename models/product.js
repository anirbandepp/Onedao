'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class Product extends Model { }

  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      qty: {
        type: DataTypes.NUMBER,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'Product',
    }
  );

  Product.associate = function (models) {
    Product.belongsTo(models.User, {
      as: "user",
      foreignKey: "user_id",
    });
  }

  return Product;
};