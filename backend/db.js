const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config(); // Load environment variables

// Initialize Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    dialectOptions: {
        connectTimeout: 10000 // 10 seconds
    },
    pool: {
        max: 5, // Maximum number of connections
        min: 0, // Minimum number of connections
        acquire: 30000, // Maximum time to wait for a connection
        idle: 10000 // Maximum time a connection can remain idle before being released
    }
});

// Test database connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
    }
})();

// Initialize database object
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.doctors = require("./models/Doctor")(sequelize, DataTypes);
db.users = require("./models/User")(sequelize, DataTypes);
db.comments = require("./models/Comment")(sequelize, DataTypes);

// Sync function
const sync = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Error synchronizing models:', error.message);
    }
};

// Export database and sync function
module.exports = { db, sync };
