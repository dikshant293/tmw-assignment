import express from 'express'
import cors from 'cors'
import {getAllUserData,getUserDataById,createUser,deleteUser} from './db.js'

const app = express()
const port = 8080

app.use(express.json());
app.use(cors());
app.use((err,req,res,next) => {
    console.error(err.stack);
    res.status(500).send("Something broke, check log...");
});

app.get('/',(req,res) => {
    res.send("this is a get request");
})

app.get('/getUsers',async (req,res) => {
    const data = await getAllUserData();
    res.status(200).send({"data":data});
})

app.get('/getUsers/:id',async (req,res) => {
    const data = await getUserDataById(req.params.id);
    res.status(200),send({"data":data});
})

app.post('/createUser',async (req,res) => {
    const {firstName, lastName, dob} = req.body;
    const data = await createUser(firstName,lastName,dob);
    res.status(201).send({"data":data})
})

app.delete('/deleteUser',async (req,res) => {
    const {id} = req.body;
    const data = await deleteUser(id);
    res.status(200).send({"data":data})
})

app.listen(port,() =>{
    console.log(`App is listening on port ${port}`);
})