const sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define(
        'Comment',
        {
        id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            doctorId: {
                type: DataTypes.INTEGER,
                primaryKey: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: false,
            },
          comment: {
            type: DataTypes.STRING,
            allowNull: false,
          }
        },
        {
          // Other model options go here
        },
      );
      
      // `sequelize.define` also returns the model
      console.log(Comment === sequelize.models.Comment); // true
      return Comment;
    }