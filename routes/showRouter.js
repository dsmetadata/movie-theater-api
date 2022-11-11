//two ways of importing the router function
const { Router } = require('express') //import router  (destructured import)
//const userRouter = require('express').Router() //import router (invoke function from inside express)

//create router using Router return value
const showRouter = Router();

//add GET route to router
showRouter.get('/', (req,res)=>{
    res.send('show router base')
})

module.exports = showRouter