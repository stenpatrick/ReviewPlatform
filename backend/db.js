const { Sequelize, DataTypes } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect:'mariadb',
    // logging: console.log,

  });


  (async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

const db = {}
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.doctors = require("./models/Doctor")(sequelize, DataTypes);
db.users = require("./models/User")(sequelize, DataTypes);
db.comments = require("./models/Comment")(sequelize, DataTypes);


const sync =(async () => {
  await sequelize.sync({ alter: true });
console.log('All models were synchronized successfully.');
});

module.exports = {db, sync};