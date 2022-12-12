//models
'use strict';
const {
  Model
} = require('sequelize');
// const { Users, Posts, Likes} = require("./");
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.Like, { foreignKey: "likes" });
      this.belongsTo(models.Users, { foreignKey: "userId" });
      this.belongsTo(models.Users, { foreignKey: "nickname" });
    }
  }
  Posts.init({
    postId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
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
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Users",
        key: "nickname",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // likes :{
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  } ,{
    sequelize,
    modelName: 'Posts',
  });
  // Posts.associate = function (models) {
  //   models.Posts.hasMany(models.Users, {
  //     foreignKey: 'userId',
  //     onDelete: 'cascade',
  //   });
  // };
  return Posts;
};