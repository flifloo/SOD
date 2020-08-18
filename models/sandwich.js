"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sandwich extends Model {
    static associate(models) {
      Sandwich.belongsToMany(models.Order, {through: {model: models.SandwichOrder, unique: false}});
    }
  }
  Sandwich.init({
    name: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: "Sandwich",
  });
  return Sandwich;
};
