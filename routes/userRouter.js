//two ways of importing the router function
const { Router } = require('express') //import router  (destructured import)
//const userRouter = require('express').Router() //import router (invoke function from inside express)
const { Show, User, StatusCode } = require('../models')  //import models (db schema)
//create router using Router return value
const userRouter = Router();

//add GET route to router
userRouter.get('/', (req,res)=>{
    res.send('user router base')
})
userRouter.get('/:name', (req,res)=>{
    res.send('user router name parameter')
})

userRouter.post('/', async (req,res)=>{
    try{
        const user = await User.create(req.body)   
        
        res.status(200).send(`
                  received: ${req.body.name} ${req.body.age} ${req.body.email}
                  added: ${user.name} ${user.age} ${user.email}         
                `)
        
        //console.log(user.dataValues)    
        console.table(user.toJSON())
    }catch(e){
        res.sendStatus(500).send(e)
    }
})

module.exports = userRouter