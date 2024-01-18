import express from 'express'
import cors from 'cors'
import { getAllUserData, getUserDataById, createUser, deleteUser } from './db.js'

const app = express()
const port = 8080

// set all express res and req to json format
app.use(express.json());

// enable cross origin resource sharing
app.use(cors());

// error handling construct provided by the beta version of express 5
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke, check log...");
});

// test request to see if the server is running
app.get('/', (req, res) => {
    res.send("this is a get request");
})

// GET request to obtain all the rows of the database
app.get('/getUsers', async (req, res) => {
    const data = await getAllUserData();
    res.status(200).send({ "data": data });
})

// GET request to get the row data with the given id
app.get('/getUsers/:id', async (req, res) => {
    const data = await getUserDataById(req.params.id);
    res.status(200), send({ "data": data });
})

// POST request to create a new data entry
app.post('/createUser', async (req, res) => {
    const { firstName, lastName, dob } = req.body;
    const data = await createUser(firstName, lastName, dob);
    res.status(201).send({ "data": data })
})

// DELETE request to delete a particular entry
app.delete('/deleteUser', async (req, res) => {
    const { id } = req.body;
    const data = await deleteUser(id);
    res.status(200).send({ "data": data })
})

// start express server
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})