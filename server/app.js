const express = require('express')
const app = express()
const cors = require('cors')
const routes = require('./routes/routes')
app.set('view engine','ejs')
const sequelize = require('../database/database');
const URLservice = require('./services')
const cookieParser = require('cookie-parser')

//middlewares 
app.use(cors())
app.use(express.json())
app.use(cookieParser())

//routes
app.use('/shortner',routes) // add jwt middle ware here, if session exists > /shorten else > /auth



module.exports = app