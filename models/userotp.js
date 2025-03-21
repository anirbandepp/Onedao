'use strict';

module.exports = (sequelize, DataTypes) => {

  const UserOTP = sequelize.define("UserOTP", {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    OTP: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  return UserOTP;
};