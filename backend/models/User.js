module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
        id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
        contact: {
            type: DataTypes.STRING,
            allowNull: false,
          }
        },
        {
          // Other model options go here
        },
      );
      
      // `sequelize.define` also returns the model
      console.log(User === sequelize.models.User); // true
      return User;
    }