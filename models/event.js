"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Organizer);
      Event.hasMany(models.Recipient);
    }
  }
  Event.init(
    {
      title: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Title cannot be empty",
          },
        },
      },
      date: {
        type: DataTypes.DATE,
        notEmpty: {
          args: true,
          msg: "Date cannot be empty",
        },
      },
      type: {
        type: DataTypes.STRING,
        notEmpty: {
          args: true,
          msg: "Type cannot be empty",
        },
      },
      OrganizerId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
