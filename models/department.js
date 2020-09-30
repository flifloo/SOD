"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      Department.hasMany(models.Order);
      Department.hasMany(models.User);
    }
  }
  Department.init({
    name: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    enable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: "Department",
  });
  return Department;
};
