const express = require('express')
const app = express()
const cors = require('cors')
const routes = require('./routes/routes')
app.set('view engine','ejs')
const sequelize = require('../database/database');
const URLservice = require('./services')
const cookieParser = require('cookie-parser')
const logger = require('./logger')



//middlewares 
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use((req,res,next)=>{
    logger.info(`incoming request ${req.method}`)
    next()
})

//routes
app.use('/shortner',routes) // add jwt middle ware here, if session exists > /shorten else > /auth



module.exports = app