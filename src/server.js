const express = require('express') //import express module
const { Show, User } = require('../models')  //import models (db schema)
const app = express() //create new instance of express
let port = 3000
//const  db = require('../db') //import db for sync
const { db } = require('../db')
const seedDB = require('../seed')

const userRouter = require('../routes/userRouter') //import userRouter
const showRouter = require('../routes/showRouter') //import showRouter

app.use(express.json()) //allow web server to parse JSON
//app.use('/user', userRouter)
//app.use('/show', showRouter)

 //populate data base
    //async function seed (){ await seedDB()}
    //seed() 
    

let clientInput = {}
resetClientInput()

userShowLink() //create some arbitrary associations between user and show (for testing)

async function userShowLink(){    

    // Show.belongsTo(User)
    // User.hasMany(Show)

    const user1 = await User.findByPk(1) 
    const user8 = await User.findByPk(2)
    
    const show1 = await Show.findByPk(1)
    const show2 = await Show.findByPk(2)
    const show3 = await Show.findByPk(3)
    const show4 = await Show.findByPk(4)

    
    await show3.setUser(user8)
    await show4.setUser(user8)
    
    await user1.addShow(show1)
    await user1.addShow(show2)
}



/* 1
receive a request via the users endpoint, if a query is included
search the user table using the query provided otherwise return all users
*/
app.get('/users', async (req,res)=>{
    
    //only search the user table with the first key value pair from the query object
    let xKey = Object.keys(req.query)[0]  //get the first key from the query
    let xVal = Object.values(req.query)[0]  //get the first value provided in the query
    
    if(typeof(xKey)==='string'){xKey = xKey.trim()}
    if(typeof(xVal)==='string'){xVal = xVal.trim()}

    let filter
    let runQuery = true
    let xUser

    xKey === undefined || xKey.length === 0 ? filter = false : filter = true //filter present?     
    
    if (runQuery){
        try{            
            filter ? xUser = await User.findAll({where:{[xKey]:xVal}}) : xUser = await User.findAll()           
            result = xUser
        }catch(e){
            result = e.error
        }      
    } else {result = 'connected'}
      
    res.send(result)
})

/* 2
receive a request via the users/parameter endpoint, search for user by either id or username
*/
app.get('/users/:key',async (req,res)=>{
  
    let xUser    
    let result
    let xKey
    let xVal = req.params.key

    //check parameter is not undefined or zero length
    if(varInitialized(xVal)){
        try{
            
            if(!isNaN(xVal)){
                xKey = 'id'              
            } else if (typeof(xVal) === 'string'){
                xKey = 'username'
            }

            if(typeof(xKey)!== undefined){
                xUser = await User.findAll({where:{[xKey]:xVal}})              
                result = xUser
                res.status(200).send(result)
            } else{res.send('invalid search key (search by id (number) or username (text)')}

        }catch(e){            
            res.status(500).send(e.message)
        }
    }else{res.send('invalid search key (search by id (number) or username (text)')}  
})

/* 3
receive a request via the users/parameter/shows endpoint, search for user by either id or username
*/
app.get('/users/:key/shows',async (req,res)=>{
  
    let xUser    
    let result
    let xKey
    let xVal = req.params.key

    //check parameter is not undefined or zero length
    if(varInitialized(xVal)){
        try{                        

            if(!isNaN(xVal)){
                xKey = 'id'              
            } else if (typeof(xVal) === 'string'){
                xKey = 'username'
            }

            if(typeof(xKey)!== undefined){
                xUser = await User.findAll({where:{[xKey]:xVal}, include: {model:Show}})                
                result = xUser
                res.status(200).send(result)
            } else{res.send('invalid search key (search by id (number) or username (text)')}
                      
        }catch(e){            
            res.status(500).send(e.message)
        }
    }else{res.send('invalid search key (search by id (number) or username (text)')}  
})



/* 4
receive a PUT request via the users/parameter/shows/parameter endpoint, search for user by id
and add the show they've watched (link show by id or title)
*/
app.put('/users/:key1/shows/:key2',async (req,res)=>{
  
    let xUser    
    let result
    let xKey1
    let xKey2
    let xVal1 = req.params.key1
    let xVal2 = req.params.key2    

    //check parameter is not undefined or zero length
    if(varInitialized(xVal1) && varInitialized(xVal2)){
        try{                        

            if(!isNaN(xVal1)){xKey1 = 'userId'} else {res.send('invalid search key (search user by id (number)')}
            if(!isNaN(xVal2)){xKey2 = 'id'} else if (typeof(xVal2) === 'string'){xKey2 = 'title'}

            if(typeof(xKey1)!== undefined && typeof(xKey2)!== undefined  ){
                await Show.update({[xKey1]:xVal1},{where:{[xKey2]:xVal2}})
                res.status(200).send('update successful!')
            } else{res.send('invalid search key (search by id (number) or username (text)')}

        }catch(e){            
            res.status(500).send(e.message)
        }
    }else{res.send('invalid search key (search by id (number) or username (text)')}  
})


/* 5
receive a request via the shows endpoint, if a query is included
search the shows table using the query provided otherwise return all shows
*/
app.get('/shows', async (req,res)=>{
    
    //only search the show table with the first key value pair from the query object
    let xKey = Object.keys(req.query)[0]  //get the first key from the query
    let xVal = Object.values(req.query)[0]  //get the first value provided in the query    

    if(typeof(xKey)==='string'){xKey = xKey.trim()}
    if(typeof(xVal)==='string'){xVal = xVal.trim()}

    let filter
    let runQuery = true
    let xShow

    xKey === undefined || xKey.length === 0 ? filter = false : filter = true //filter present?     
    
    if (runQuery){
        try{            
            filter ? xShow = await Show.findAll({where:{[xKey]:xVal}}) : xShow = await Show.findAll()           
            result = xShow
        }catch(e){
            result = e.message
        }      
    } else {result = 'connected'}
      
    res.send(result)
})


/* 6
receive a request via the shows/parameter endpoint, search for show by either id or username
*/
app.get('/shows/:key',async (req,res)=>{
  
    let xShow 
    let result
    let xKey
    let xVal = req.params.key

    //check parameter is not undefined or zero length
    if(varInitialized(xVal)){
        try{
            
            if(!isNaN(xVal)){
                xKey = 'id'              
            } else if (typeof(xVal) === 'string'){
                xKey = 'title'
            }

            if(typeof(xKey)!== undefined){
                xShow = await Show.findAll({where:{[xKey]:xVal}})              
                result = xShow
                res.status(200).send(result)
            } else{res.send('invalid search key (search by id (number) or title (text)')}

        }catch(e){            
            res.status(500).send(e.message)
        }
    }else{res.send('invalid search key (search by id (number) or title (text)')}
})


/* 7
receive a request via the shows/genres/parameter endpoint, search for show by genre
*/
app.get('/shows/genres/:key',async (req,res)=>{
  
    let xShow 
    let result
    let xKey
    let xVal = req.params.key

    //check parameter is not undefined or zero length
    if(varInitialized(xVal)){
        try{
                                   
            if (typeof(xVal) === 'string'){xKey = 'genre'}

            if(typeof(xKey)!== undefined){
                xShow = await Show.findAll({where:{[xKey]:xVal}})              
                result = xShow
                res.status(200).send(result)
            } else{res.send('invalid search key (search by genre (text)')}

        }catch(e){            
            res.status(500).send(e.message)
        }
    }else{res.send('invalid search key (search by id (number) or title (text)')}
})


/* 8
receive a PUT request via the shows/parameter/watched/parameter endpoint, search for show by id or title
and update the rating 
*/
app.put('/shows/:key1/watched/:key2',async (req,res)=>{
     
    let xKey1
    let xKey2
    let xVal1 = req.params.key1
    let xVal2 = req.params.key2    

    xVal1 = xVal1.trim()
    xVal2 = xVal2.trim()
    //check parameter is not undefined or zero length
    if(varInitialized(xVal1) && varInitialized(xVal2)){
        try{                        
            
            if(!isNaN(xVal1)){xKey1 = 'id'} else if (typeof(xVal2) === 'string'){xKey1 = 'title'}
            if(!isNaN(xVal2)){xKey2 = 'rating'} else {res.send('rating must be a number and a value must be supplied')}            

            if(typeof(xKey1)!== undefined && typeof(xKey2)!== undefined  ){
                await Show.update({[xKey2]:xVal2},{where:{[xKey1]:xVal1}})
                res.status(200).send('update successful!')
            } else{res.send(`invalid search key (search show by id (number) or title (text), rating must be a number and a value must be supplied`)}
            

        }catch(e){            
            res.status(500).send(e.message)
        }
    }else{res.send('invalid search key (search show by id (number) or title (text), rating must be a number and a value must be supplied')}
})


/* 9
receive a PUT request via the shows/parameter/updates/parameter endpoint, search for show by id or title
and update the status
*/
app.put('/shows/:key1/updates/:key2',async (req,res)=>{
    let xShow
    let xKey1
    let xKey2
    let xVal1 = req.params.key1
    let xVal2 = req.params.key2    

    xVal1 = xVal1.trim()
    xVal2 = xVal2.trim()
    //check parameter is not undefined or zero length
    if(varInitialized(xVal1) && varInitialized(xVal2)){
        try{                        
            
            if(!isNaN(xVal1)){xKey1 = 'id'} else if (typeof(xVal2) === 'string'){xKey1 = 'title'}
            if(typeof(xVal2) === 'string' && xVal2.length>=5 && xVal2.length <=25){xKey2 = 'status'} else {res.send('status must be between 5 to 25 characters in length')}            

            if(typeof(xKey1)!== undefined && typeof(xKey2)!== undefined  ){
                xShow = await Show.findAll({where:{[xKey1]:xVal1}})
                if(xShow.length === 0){throw new Error('show does not exist!')} 
                await Show.update({[xKey2]:xVal2},{where:{[xKey1]:xVal1}})
                res.status(200).send('update successful!')
            } else{res.send(`status must be between 5 to 25 characters in length`)}
            

        }catch(e){            
            res.status(500).send(e.message)
        }
    }else{res.send('status must be between 5 to 25 characters in length')}
})


/* 10
receive a delete request via the shows/parameter endpoint, search for show by either id or title
*/
app.delete('/shows/:key',async (req,res)=>{
  
    let xShow
    let result
    let xKey
    let xVal = req.params.key
    let rowsDeleted = 0

    xVal= xVal.trim()
    //check parameter is not undefined or zero length
    if(varInitialized(xVal)){
        try{
            
            if(!isNaN(xVal)){
                xKey = 'id'              
            } else if (typeof(xVal) === 'string'){
                xKey = 'title'
            }

            if(typeof(xKey)!== undefined){
                
                xShow = await Show.findAll({where:{[xKey]:xVal}})                
                if(xShow.length === 0){throw new Error('show does not exist!')}

                await Show.destroy({where:{[xKey]:xVal}}).then(rows=>rowsDeleted = rows)
                result = xShow
                result.unshift('deleted rows: ' + rowsDeleted)

                res.status(200).send(result)
            } else{res.send('invalid search key (search by id (number) or title (text)')}

        }catch(e){            
            res.status(500).send(e.message)
        }
    }else{res.send('invalid search key (search by id (number) or title (text)')}
})





/* --------------- extension ------------- */

/* --------------- extension ------------- */


/* 11
receive a delete request via the users/parameter endpoint, search for user by either id or username
*/
app.delete('/users/:key',async (req,res)=>{
  
    let xUser
    let result
    let xKey
    let xVal = req.params.key
    let rowsDeleted = 0

    xVal= xVal.trim()
    //check parameter is not undefined or zero length
    if(varInitialized(xVal)){
        try{
            
            if(!isNaN(xVal)){
                xKey = 'id'              
            } else if (typeof(xVal) === 'string'){
                xKey = 'username'
            }

            if(typeof(xKey)!== undefined){
                
                xUser = await User.findAll({where:{[xKey]:xVal}})                
                if(xUser.length === 0){throw new Error('User does not exist!')}

                await User.destroy({where:{[xKey]:xVal}}).then(rows=>rowsDeleted = rows)
                result = xUser
                result.unshift('deleted rows: ' + rowsDeleted)

                res.status(200).send(result)
            } else{res.send('invalid search key (search by id (number) or username (text)')}

        }catch(e){            
            res.status(500).send(e.message)
        }
    }else{res.send('invalid search key (search by id (number) or username (text)')}
})



//CREATE
/*12*/
app.post('/users', async (req,res)=>{
    try{
        const user = await User.create(req.body)        
        res.status(200).send(user.username + ' added successfully!')                
        //console.table(user.toJSON())
    }catch(e){
        res.sendStatus(500).send(e.message)
    }
})
/*13*/
app.post('/shows', async (req,res)=>{
    try{
        const show = await Show.create(req.body)        
        res.status(200).send(show.title + ' added successfully!')                
        //console.table(show.toJSON())
    }catch(e){
        res.sendStatus(500).send(e.message)
    }
})



/*14
receive a delete request via the /shows endpoint, search for show by either id or username using query or object
*/
app.delete('/shows', async (req,res)=>{

    clientInput = getClientInput(req)

    let inputOption //user input method 0 - query, 1 - object, 2 - no input
    // order of precedence - use query, else use object, else no input
    if(clientInput.query){ 
        inputOption = 0
    } else if(clientInput.object){
        inputOption = 1
    } else {inputOption = 2}
    
    if(inputOption === 0){
        //use query
        let xShow
        try{
            //step 1-check records exists (if true move to step 2, if false throw error), step 2-delete record (if true confirm deletion, if false throw error)
            xShow = await Show.findAll({where:{[clientInput.qKey]:[clientInput.qVal]}}).catch(e=>{console.log((e.message));clientInput.errMsg = e.message; throw new Error(e)})
            await Show.destroy({where:{[clientInput.qKey]:clientInput.qVal}}).then(rows=>clientInput.rowsDeleted = rows).catch(e=>{clientInput.errMsg = e.message; throw new Error(e)})            
            if(xShow.length === 0){xShow.unshift('show does not exist!')}
            xShow.unshift('rows deleted: ' + clientInput.rowsDeleted)
            console.log(xShow)
            res.status(200).send(xShow)
        }catch(e){
            res.status(500).send(e.message)
        }       
    }

    if(inputOption === 1){
        //use object
        let xShow
        try{
            //determine search key & destroy via class User
            switch(clientInput.objPropCount){

                //step 1-check records exists (if true move to step 2, if false throw error), step 2-delete record (if true confirm deletion, if false throw error)

                case 1:
                    xShow = await Show.findAll({where:{[clientInput.xKey1]:[clientInput.xVal1]}}).catch(e=>{console.log((e.message));clientInput.errMsg = e.message; throw new Error(e)})
                    await Show.destroy({where:{[clientInput.xKey1]:[clientInput.xVal1]}}).then(rows=>clientInput.rowsDeleted = rows).catch(e=>{clientInput.errMsg = e.message; throw new Error(e)})                
                break;
                case 2: 
                    xShow = await Show.findAll({where:{[clientInput.xKey1]:[clientInput.xVal1], [clientInput.xKey2]:[clientInput.xVal2]}}).catch(e=>{console.log((e.message));clientInput.errMsg = e.message; throw new Error(e)})
                    await Show.destroy({where:{[clientInput.xKey1]:[clientInput.xVal1], [clientInput.xKey2]:[clientInput.xVal2]}}).then(rows=>clientInput.rowsDeleted = rows).catch(e=>{clientInput.errMsg = e.message; throw new Error(e)})                
                break;
                case 3:
                    xShow = await Show.findAll({where:{[clientInput.xKey1]:[clientInput.xVal1], [clientInput.xKey2]:[clientInput.xVal2], [clientInput.xKey3]:[clientInput.xVal3]}}).catch(e=>{console.log((e.message));clientInput.errMsg = e.message; throw new Error(e)})
                    await Show.destroy({where:{[clientInput.xKey1]:[clientInput.xVal1], [clientInput.xKey2]:[clientInput.xVal2], [clientInput.xKey3]:[clientInput.xVal3]}}).then(rows=>clientInput.rowsDeleted = rows).catch(e=>{clientInput.errMsg = e.message; throw new Error(e)})                               
                break;               
            }
            xShow.unshift('rows deleted: ' + clientInput.rowsDeleted)
            console.log(xShow)
            res.status(200).send(xShow)            
        }catch(e){
            res.status(500).send(e.message)
        }        
    }

    if(inputOption === 2){res.status(500).send('no input received')}
    resetClientInput()

})



/******Bespoke functions ********/

function resetClientInput(){
    clientInput = {          
        objPropCount : 0,
        rowsDeleted: undefined,
        errMsg : undefined,
        query : false,
        object : false,
        qKey : undefined,
        qVal : undefined
   }
}

function varIsEmpty(xVar){
    let result
    try{
        if(typeof(xVar)===undefined){
            result = false
            //throw new Error("variable is undefined")
        }else{

            let structure = typeof(xVar)
            // if(Array.isArray(xVar)){
            //     structure = 'array'
            // }else{structure = typeof(xVar)}
    
            switch(structure){
                case'number': result = false
                break;
                case'string': xVar.length > 0 ? result = false: result = true
                break;                        
                case'object': Object.entries(xVar) > 0 ? result = false: result = true
                break;
                default: throw new Error('data type unknown')                        
            }
        }
        return result
    }catch(e){return e}    
}

function varIsDefined(xVar){
    let result
    try{
        typeof(xVar) === undefined ? result = false: result = true
        return result
    } catch(e){
        return e
    }    
}

function varInitialized(xVar){
    let result
    try{
        varIsDefined(xVar) && !varIsEmpty(xVar) ? result = true: result = false
        return result
    } catch(e){
        return e
    }
}

function getClientInput(req){

    let xAllValues = []
    let xAllKeys = []

    xAllValues = Object.values(req.body)
    xAllKeys = Object.keys(req.body)

    clientInput.objPropCount = 0  //number of properties in the object supplied by the end user
    //clientInput.rowsDeleted
    //clientInput.errMsg
    clientInput.query = false //true if query is submitted by end user
    clientInput.object = false // true if object is submitted by end user


    //Query Present?
        //only uses first key and value in the query
        clientInput.qKey = Object.keys(req.query)[0]  //get the first key from the query
        clientInput.qVal = Object.values(req.query)[0]  //get the first value provided in the query

        //remove white space from both ends of query
        if(typeof(clientInput.qKey)==='string'){clientInput.qKey = clientInput.qKey.trim()}
        if(typeof(clientInput.qVal)==='string'){clientInput.qVal = clientInput.qVal.trim()}  
    
        clientInput.qKey && clientInput.qKey.length > 0 && clientInput.qVal && clientInput.qVal.length > 0 ? clientInput.query = true : clientInput.query = false //query present? 
    
        let propIndex = 0 //counter for end user generated input
    //Object Present?    
        //check no of object properties submitted
        for(i in xAllValues){
            if(varInitialized(xAllValues[i])){ //if the property value submitted by the end user is initialized (not undefined or zero length)
                clientInput.objPropCount++  // add to count
                propIndex ++
                clientInput['xVal'+ propIndex] = xAllValues[i] //create property in the clientInput object and add the initialized value submitted by the end user
                clientInput['xKey'+ propIndex] = xAllKeys[i]  // add the corresponding reference/key
                // the property name takes the convention - xVal + counter or xKey + counter
            }
        }       
     
        clientInput.objPropCount > 0 ? clientInput.object = true : clientInput.object = false //object present?

    return clientInput
}


/******Bespoke functions ********/



app.listen(port, async ()=>{
    await db.sync({force: false}) //(force:false - do not overwrite existing data)    
    console.log('listening on port '+port)
})