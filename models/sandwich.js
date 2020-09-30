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
    },
    enable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: "Sandwich",
  });
  return Sandwich;
};
