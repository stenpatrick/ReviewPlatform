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
      price: {
        type: DataTypes.DECIMAL,
        // allowNull defaults to true
      },
    },
    {
      // Other model options go here
    },
  );
  
  // `sequelize.define` also returns the model
  console.log(Doctor === sequelize.models.Doctor); // true
  return Doctor;
}