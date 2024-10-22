module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define(
      'Doctor',
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
        rating: {
          type: DataTypes.DECIMAL(10, 2),
          // allowNull defaults to true
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
    console.log(Doctor === sequelize.models.User); // true
    return Doctor;
  }