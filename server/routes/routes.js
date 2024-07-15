const express = require('express')
const router = express.Router()
const URLservice = require('../services')
const userValidation = require('../validation/userValidation')
const urlValidation = require('../validation/urlValidation')
const { validate, ValidationError, Joi } = require('express-validation');
const logger = require('../logger')

router.route('/test').get(URLservice.checkJWT,(req,res)=>{
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
        if(addingUrl){
        res.status(200).json({
            parent_url: parentUrl,
            alias : customAlias,
            userID,
            status:'success',
        })
        }else{
            res.status(412).json({
                parent_url: parentUrl,
                alias : customAlias,
                userID,
                status:'alias already taken by the user',
            })
        }
    }catch(err){
        logger.info("error caught at routes.js > /shorten endpoint: ",err)
    }
  })

  router.route('/auth').post(validate(userValidation.authValidation), async (req, res) => {
    try {
        const { email, password } = req.body;
        const authCheck = await URLservice.authUser(email, password);
        
        if (authCheck) {
            // Clear existing JWT cookie if present
            if (req.cookies.JWToken) {
                res.clearCookie('JWToken');
            }

            const userName = await URLservice.getUser(email);
            logger.info("log : userName: " + userName.name);
            const user = { id: userName.id, name: userName.name, email: email };
            
            const token = await URLservice.jwtCookieGen(user);
            logger.info("Created JWT at /auth using jwtCookieGen " + token);
            
            const bearer = await URLservice.brearerTokenGen(userName.id);
            const session = await URLservice.createSession(bearer.id, bearer.token, token);
            logger.info("Session created successfully");
            
            res.cookie("JWToken", token, {
                // secure: process.env.NODE_ENV === 'production' // Use secure in production
            }).json({
                status: "success",
                message: "Login successful",
                userName: userName.name,
                token
            });
            
            logger.info(`Login success for ${userName.name}`);
        } else {
            res.status(401).json({
                status: "error",
                message: "Authorization blocked, password doesn't match"
            });
        }
    } catch (err) {
        logger.error("Error in /auth route:", err);
        res.status(500).json({
            status: "error",
            message: "An internal error occurred during authentication"
        });
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

router.route('/redirect/:short').get(validate(urlValidation.redirectValidation),async (req,res)=>{
    //handle the redirection here once URL is registered.
    //sample format:
    //http://localhost:9999/shortner/redirect/ert?id=71
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

router.route('/urls').get(URLservice.checkSession,async (req,res)=>{
    // send urls for the UserID
    const id = req.query.id
    if(!id) {
        return res.status(400).json({ error: 'userID query parameter is required' });
    }
    const urls = await URLservice.getUrlsByUserId(id)
    urls.message = 'success'
    if(urls){
        logger.info(urls)
        res.status(200).json(urls)
    }else{
        res.status(404).json(urls.message)
    }
})

module.exports = router