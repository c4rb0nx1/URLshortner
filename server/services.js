const bcrypt = require('bcrypt');
const db = require('../database/database');
const crypto = require('crypto');
const { where } = require('sequelize');
const jwt = require("jsonwebtoken")
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


function randomString(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

const URLservice = {
  addNewUser: async (name,email,password) => {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
        //interesting fact
        /*
         becrypt takes the salted password and then it re hashesh the given password,
         if the password is correct, then the exact hash will be produced,
         now comparing both will result true everytime.
         */
        const existing = await db.User.findOne({ // before adding user, check for existing user.
            where:{email},
            attributes:['email']
        })
        if(!existing){
            const newUser = await db.User.create({
                name,
                email,
                password_hash: hashedPassword
              })
            return { success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } };

        }else{
            throw new Error("user exists")
        }
    } catch (error) {
      console.error('Error adding new user:', error)
      return { success: false, message : " An error occured: user already exists with email"} };
  },
  removeUser: async(id)=>{
    try{
        const user = await db.User.findByPk(id)
        const remove = await user.destroy()
        if(remove){
            console.log("deleted user successfuly")
        }else{
            console.log("user deletion operation failed")
        }
    }catch(err){
        console.log("caught at services.js > removeUSer: "+err)
    }
  },
  shortenUrl: async (parentUrl,customAlias,id) => {
    try{
        const parent = parentUrl
        let alias = customAlias
        //need to check status
        const status = 200;
        if(!alias){
            alias = randomString(5)
            console.log("alias empty, random string generated: ",alias)
        }
        const shortURL = '/' + alias 
        const userID = id
        const shortern = await db.Url.create({
            parentURL:parent,
            shortURL,
            customAlias: alias,
            userID,
            status
        })
    }catch(err){
        console.log("error caught at services.js > shortenUrl "+ err)
    }
  },
  removeURL:async(urlid)=>{
    try{
        const url = await db.Url.findByPk(urlid)
        const remove = await url.destroy()
        if(remove){
            console.log("deleted URL successfuly")
        }else{
            console.log("URL deletion operation failed")
        }
    }catch(err){
        console.log("caught at services.js > removeUSer: "+err)
    }
  },
  createSession: async(userID,bearer_token,JWTtoken)=>{
    //manage session timeout and check auth status with JWT.
    try{
        const session = await db.Session.create({
            userID,
            bearer_token,
            JWTtoken,
        })
        return {success:true, message:"session created successfully"}
    }catch(err){
        console.log("error caught at create session ",err)
        return {success:false, message:"Error creating user session check logs"}
    }

  },
  authUser:async(email1,password)=>{
    //authenticate User using json and check session
    try{
        const currentPassword = password
        const user = await db.User.findOne({
            where:{email:email1},
            attributes:['id','password_hash','name']
        })
        if (user) {
            console.log("user ID: ",user.id);
            console.log('user password hash: ',user.password_hash);
            // return user; // Return the user if found
            const userAuth = await bcrypt.compare(currentPassword,user.password_hash)
            if(userAuth){
                console.log(user.name, " have successfully authenticated")
                return user.name
            }else{
                console.log("user auth decline")
            }
        }
        return null;
    }catch(err){
        console.log("error caught at authUser> services.js",err)
    }
  },
  brearerTokenGen:async(userID)=>{
    // generate bearer token for the user after auth and update in session
    const bearerToken = randomString(10)
    return {id:userID,token:bearerToken}
  },
  getUser: async(email)=>{
    const user = await db.User.findOne({
        where:{email:email},
        attributes:['id','password_hash','name']
    })
    if(user){
        return user
    }else{
        throw new Error("user not found")
    }
  },
  jwtCookieGen:async(userObject)=>{ // user is an object
    console.log(userObject)
    console.log(process.env.JWT_SECRET)
    const token = jwt.sign(userObject,process.env.JWT_SECRET,{expiresIn:"3h"})
    return token
  },
  checkJWT: (req,res,next)=>{
   try{
    const token =  req.cookies.JWToken
    console.log("Found token: ", token)
    if(token){
        const verify = URLservice.verifyJWT(token)
        console.log(verify)
        if(verify){
            req.redir = '/shorten'
        }else{
            req.redir = '/auth'
        }
    }else{
        res.redirect("/newuser")
        console.log("serevice.js > checkJWT: no token found")
    }
    next()
   }catch(err){
    console.log('caught at services.js > checkJWT: ',err)
    next()
   }
  },
  verifyJWT: async(token)=>{
    try{
        const check = jwt.verify(token,process.env.JWT_SECRET)
        console.log("logging Check: ",check)
        return true
    }catch(err){
        return false
    }
  },
  checkSession:async(req,res,next)=>{
    let userID = req.body.userID
    console.log("logging at checksession: ", userID)
    if(!userID){
        userID = req.query.id
        console.log("logging at checksession: ", userID)
    }
    const userSession = await db.Session.findOne({
        where:{userID},
        attributes:['sessionID','bearer_token','JWTtoken']
    })
    const verifySession = await URLservice.verifyJWT(userSession.JWTtoken)
    if(verifySession){
        console.log("user session active")
        req.redir = '/shorten'
    }else{
        console.log("user session timeout") 
        req.redir = '/auth'
    }
    next()
  },
  shortenRedirect:async(shortURL)=>{
    try {
        const urlRecord = await db.Url.findOne({
          where: {
            shortURL: '/'+shortURL,
          },
          attributes: ['parentURL']
        });
        console.log("urlRecord: "+urlRecord)
        if (urlRecord) {
            console.log("redirecting to parent URL")
            return {success:true, parentUrl: urlRecord.get('parentURL')}
        } else {
          console.log(`Short URL not found`);
            return {success:false}
        }
      } catch (error) {
        console.log('Error in URL redirection', { error: error.message, stack: error.stack });
      }
  }
};

module.exports = URLservice;