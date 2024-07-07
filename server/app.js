const express = require('express')
const app = express()
const cors = require('cors')
const routes = require('./routes/routes')
app.set('view engine','ejs')
const sequelize = require('../database/database');

//middlewares 
app.use(cors())
app.use(express.json())


//routes
app.use('/shortner',routes)



module.exports = app