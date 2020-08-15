"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Command extends Model {
    static associate(models) {
      Command.belongsToMany(models.Sandwich, {through: "SandwichCommand"});
      Command.belongsTo(models.Department);
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
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: "Command",
  });
  return Command;
};
