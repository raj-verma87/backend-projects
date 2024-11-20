const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Bill = sequelize.define('Bill', {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

module.exports = Bill;
