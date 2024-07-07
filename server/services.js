const bcrypt = require('bcrypt');
const db = require('../database/database');
const crypto = require('crypto');
const { where } = require('sequelize');

function randomString(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

const URLservice = {
  addNewUser: async (name, email, password) => {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
        //interesting fact
        /**
         becrypt takes the salted password and then it re hashesh the given password,
         if the password is correct, then the exact hash will be produced,
         now comparing both will result true everytime.
         */
      const newUser = await db.User.create({
        name,
        email,
        password_hash: hashedPassword
      })

      return { success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } };
    } catch (error) {
      console.error('Error adding new user:', error)
      return { success: false, error: error.message }
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
        const shortURL = parent + '/' + alias 
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
  session: async(userID,bearer_token,JWTtoken)=>{
    //manage session timeout and check auth status with JWT.
  },
  authUser:async(email1,password)=>{
    //authenticate User using json and check session
    const user = await db.User.findOne({
        where:{email:email1},
        attributes:['id','password']
    })
    console.log(user.id)
    console.log(user.password)
    return 1

  },
  brearerTokenGen:async(userID)=>{
    // generate bearer token for the user after auth and update in session
    

  },
};

module.exports = URLservice;