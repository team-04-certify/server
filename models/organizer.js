"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Organizer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Organizer.hasMany(models.Event);
    }
  }
  Organizer.init(
    {
      organization: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Organization name cannot be empty",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Email cannot be empty",
          },

          isEmail: {
            args: true,
            msg: "Email format is incorrect",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [6],
            msg: "The password must be at least 6 characters long",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Organizer",
    }
  );
  return Organizer;
};
