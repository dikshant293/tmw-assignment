import express from 'express'
import {getAllUserData,getUserDataById,createUser} from './db.js'
const app = express()
const port = 8080

app.get('/',(req,res) => {
    res.send("this is a get request");
})

app.get('/getUsers',async (req,res) => {
    const data = await getAllUserData();
    res.send(data);
})

app.get('/getUsers/:id',async (req,res) => {
    const data = await getUserDataById(req.params["id"]);
    res.send(data);
})

app.listen(port,() =>{
    console.log(`App is listening on port ${port}`);
})