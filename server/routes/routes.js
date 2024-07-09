const express = require('express')
const router = express.Router()
const URLservice = require('../services')
const userValidation = require('../validation/userValidation')
const urlValidation = require('../validation/urlValidation')
const { validate, ValidationError, Joi } = require('express-validation');
const logger = require('../logger')

router.route('/test').get(URLservice.checkJWT,(req,res)=>{
    // res.send("test running")
    // res.redirect('https://c4rb0n.in');
    // res.send({
    //     addnewuser:"/newuser",
    //     shortenUrl:"/shorten",
    // })
    res.redirect("/shortner"+req.redir)
    logger.info('Redirected successfuly to ',req.redir)
})


router.route('/newuser').post(validate(userValidation.newUserValidation),async(req,res)=>{
    //service.js -> add new user
    try{
        const { name, email, password } = req.body
        const user = { name, email };
        console.log(user);
        const addUser = await URLservice.addNewUser(name,email,password)
        if(addUser.success){
            //jwt token gen and set cookie.
            const token = await URLservice.jwtCookieGen(user)
            logger.info("Created JWT at /newuser using jwtCookieGen "+token)
            //

            const getUser = await URLservice.getUser(user.email)
            const bearer = await URLservice.brearerTokenGen(getUser.id)
            const session = await URLservice.createSession(bearer.id,bearer.token,token)
            logger.info("session created successfuly")

            //
            res.cookie("JWToken",token,{
                httpOnly: true,
                sameSite:'strict'
            }).send("JWT created, and cookie set :)")
            //redirect to /shorten
        }else{
            logger.info("adding new user failed")
            res.status(400).json({ message: "user with same email exists already" });

        }

    }catch(err){
        res.send(err.name+" please resend Data")
        console.log("\n\nCatched err at routes.js> route: /new :"+err.name+"\n\n")
    }
})

router.route('/shorten').post(validate(urlValidation.shortenValidation),URLservice.checkSession,async (req,res)=>{
    // handle shortening service
    try{
        const parentUrl = req.body.parentUrl
        const customAlias = req.body.customAlias
        const userID = req.body.userID
        logger.info(parentUrl, '\n'+customAlias,'\n'+userID)
        const addingUrl = await URLservice.shortenUrl(parentUrl,customAlias,userID)
        res.status(200).json({
            parent_url: parentUrl,
            alias : customAlias,
            user_id:userID
        })
    }catch(err){
        logger.info("error caught at routes.js > /shorten endpoint: ",err)
    }
  })

router.route('/auth').post(validate(userValidation.authValidation),async(req,res)=>{ // landing page for non auth users.
    try{
        const {email, password} = req.body
        // console.log(email)
        // console.log(password)

        const authCheck = await URLservice.authUser(email,password)
        if(authCheck){
            res.redirect("/shorten")
            logger.info(`login success for ${authCheck}`) // form here after successful login redirect to other page
        }else{
            res.send("Authorisation blocked, password doesn't match")
            throw new SyntaxError("user authorisation blocked")
        }


    }catch(err){

    }
})

router.route('/removeuser').post(validate(userValidation.removeUserValidation),URLservice.checkSession,async(req,res,id)=>{
    try{
        const id= req.query.id
        const op = await URLservice.removeUser(id)
        logger.info("exited remove user operation")
    }catch(err){
        logger.error("caught at remove User > routes.js ",err)
    }
})

router.route('/removeurl').post(validate(urlValidation.removeUrlValidation),URLservice.checkSession,async(req,res,urlid)=>{
    try{
        const urlid = req.query.urlid
        const op = await URLservice.removeURL(urlid)
        logger.info("exited remove URL operation")
    }catch(err){
        logger.error("Error caught at routes.js > removeurl/:... ",err)
    }
})

router.route('/redirect/:short').get(validate(urlValidation.redirectValidation),URLservice.checkSession,async (req,res)=>{
    //handle the redirection here once URL is registered.
    const shortURL = req.params.short
    logger.info("recieved shorten URL :",shortURL)
    const redirect = await URLservice.shortenRedirect(shortURL)
    if(redirect.success){
        res.redirect(redirect.parentUrl)
        logger.info(redirect.parentUrl)
        logger.info("redirection success")
    }else{
        logger.error("redirection failed")
    }

})

module.exports = router