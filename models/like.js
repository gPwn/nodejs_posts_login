'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Users, { foreignKey: "userId" });
      this.belongsTo(models.Posts, { foreignKey: "postId" });
    }
  }
  Likes.init(
    {
    likeId: {
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "userId",
      },
      onDelete: "cascade",
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Posts",
        key: "postId",
      },
      onDelete: "cascade",
    },
    likes :{
      type: DataTypes.INTEGER,
    },
    nickname : {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title : {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    sequelize,
    modelName: 'Likes',
  });
  // Likes.associate = function (models) {
  //   models.Posts.hasMany(models.Posts, {
  //     foreignKey: 'postId',
  //     onDelete: 'cascade',
  //   });
  // };
  // Likes.associate = function (models) {
  //   models.Users.hasMany(models.Users, {
  //     foreignKey: 'userId',
  //     onDelete: 'cascade',
  //   });
  // };
  return Likes;
};