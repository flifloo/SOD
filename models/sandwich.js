"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sandwich extends Model {
    static associate(models) {
      Sandwich.belongsToMany(models.Command, {through: "SandwichCommand"});
    }
  }
  Sandwich.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
