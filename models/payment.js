"use strict";
let maxLength = 80;
function idGen() {
    let id = "";
    while (id.length < maxLength) {
        let tmp = id + Math.random().toString(36).substring(2, 15);
        if (tmp.length <= maxLength)
            id = tmp;
        else
            break;
    }
    return id;
}

const {
    Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        static associate(models) {
            Payment.hasOne(models.Order);
        }
    }
    Payment.init({
        shopReference: {
            type: DataTypes.STRING(maxLength),
            primaryKey: true,
            defaultValue: idGen
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: "Payment",
    });
    return Payment;
};
