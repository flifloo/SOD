"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Command extends Model {
    static associate(models) {
      Command.belongsToMany(models.Sandwich, {through: {model: models.SandwichCommand, unique: false}});
      Command.belongsTo(models.Department);
      Command.belongsTo(models.User);
    }
  }
  Command.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: "Command",
  });
  return Command;
};
