"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Recipient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Recipient.belongsTo(models.Event);
    }
  }
  Recipient.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.UUID,
      }, 
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Name cannot be empty",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: {
            args: true,
            msg: "Email format is incorrect",
          },
        },
      },
      birthDate: {
        type: DataTypes.DATE,
        validate: {
          notEmpty: {
            args: true,
            msg: "Birth Date cannot be empty",
          },
        },
      },
      certificateNumber: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Certificate number cannot be empty",
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Role cannot be empty",
          }
        },
      },
      certificateLink: {
        type: DataTypes.STRING
      },
      EventId: DataTypes.INTEGER,
      status: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Recipient",
    }
  );
  return Recipient;
};
