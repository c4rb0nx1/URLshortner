const app = require('./app') 
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const PORT = process.env.PORT;
const db = require('../database/database');


async function startServer() {
    try {
      await db.sequelize.authenticate();
      console.log('Database connection has been established successfully.');
  
      await db.sequelize.sync();
      console.log('All models were synchronized successfully.');
  
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
  
  startServer();