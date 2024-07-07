const express = require('express')
const router = express.Router()
const URLservice = require('../services')

router.route('/test').get((req,res)=>{
    // res.send("test running")
    // res.redirect('https://c4rb0n.in');
    res.send({
        addnewuser:"/newuser",
        shortenUrl:"/shorten",
    })

})


router.route('/newuser').post(async(req,res)=>{
    //service.js -> add new user
    try{
        const { name, email, password } = req.body
        console.log('Received data:\n')
        console.log('Name:', name)
        console.log('Email:', email)
        console.log('Password:', password)
        // console.log(onnumilla)
        // res.status(200).json({status:200})
        const addUser = URLservice.addNewUser(name,email,password)
        if(addUser){
            res.send(`User ${name} added successfully!`)
        }

    }catch(err){
        res.send(err.name+" please resend Data")
        console.log("\n\nCatched err at router.js> route: /new :"+err.name+"\n\n")
    }
})

router.route('/shorten').post(async (req,res)=>{
    // handle shortening service
    try{
        const parentUrl = req.body.parentUrl
        const customAlias = req.body.customAlias
        const userID = req.body.userID
        console.log(parentUrl, '\n'+customAlias,'\n'+userID)
        const addingUrl = await URLservice.shortenUrl(parentUrl,customAlias,userID)
        res.status(200).json({
            parent_url: parentUrl,
            alias : customAlias,
            user_id:userID
        })
    }catch(err){
        console.log("error caught at routes.js > /shorten endpoint: ",err)
    }
  })

router.route('/auth').post(async(req,res)=>{
    try{
        const {email, password} = req.body
        console.log(email)
        console.log(password)

        const authCheck = await URLservice.authUser(email,password)
        if(authCheck){
            res.send("login success")
        }else{
            res.send("Authorisation blocked")
            throw new SyntaxError("user authorisation blocked")
        }


    }catch(err){

    }
})

router.route('/:short').get((req,res)=>{
    //handle the redirection here once URL is registered.
})

module.exports = router