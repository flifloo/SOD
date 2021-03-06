"use strict";
const {
    Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsTo(models.Department);
            User.hasMany(models.Order);
        }

        checkPassword(password) {
            return require("crypto")
                .createHash("sha256")
                .update(this.username + password)
                .digest("base64") === this.passwordHash
        }
    }
    User.init({
        username: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            },
            unique: true
        },
        emailVerified : {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        emailToken: {
            type: DataTypes.STRING,
            unique: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: "userFullName"
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: "userFullName"
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                if (value)
                    this.setDataValue("passwordHash",
                        require("crypto").
                        createHash("sha256").
                        update(this.username + value).
                        digest("base64"));
            }
        },
        passwordToken: {
            type: DataTypes.STRING,
            unique: true
        },
        passwordTokenDate: {
            type: DataTypes.DATE
        },
        permissions: { // 1 = sandwich page, 2 = order page, 3 = admin
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "User",
    });
    return User;
};
