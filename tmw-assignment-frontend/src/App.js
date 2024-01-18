import { useState, useEffect } from "react";
import './App.css';

// set api url for calling methods
const apiUrl = "http://127.0.0.1:8080";

// function to get all the rows from the DB table
async function getUsers() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    const response = await fetch(`${apiUrl}/getUsers`, requestOptions)
    return response.json()
}

// function to check if the inputted entries are valid or not
function isValid(firstName, lastName, dob) {
    const d = new Date(`${dob}T06:00:00.000Z`)
    if (firstName.length === 0 ||
        lastName.length === 0 ||
        firstName.length > 50 ||
        lastName.length === 0 ||
        // reg ex expression that matches any character that is not an alphabet
        /[^a-z A-Z]/.test(firstName) ||
        /[^a-z A-Z]/.test(lastName) ||
        // check if entered date is valid
        isNaN(d) === true) {
            return false;
        }
    else {
        return true;
    }
}

// create a POST request to the express server to add a new entry
async function createUser(firstName, lastName, dob) {
    if (isValid(firstName,lastName,dob)===false) {
        const errorMsg = `invalid input\n
        name should only contain alphabets\n
        first name max length = 30\n
        last name max length = 50`
        alert(errorMsg)
        return {
            "msg": errorMsg
        }
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "firstName": firstName,
        "lastName": lastName,
        "dob": dob
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const response = await fetch(`${apiUrl}/createUser`, requestOptions);
    return response.json()
}

// create a DELETE request to delete the entry with the given id
async function deleteUser(id) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "id": id
    });

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const response = await fetch(`${apiUrl}/deleteUser`, requestOptions);
    return response.json()
}

// fill the table with all the table data from the db
async function fillTable(settable) {
    const res = await getUsers();
    settable(res.data);
}

function App() {
    // create states to store firstname, lastname, DOB and table
    const [firstName, setfirstName] = useState("")
    const [lastName, setlastName] = useState("")
    const [dob, setdob] = useState("");
    const [table, settable] = useState([])

    // used to fill the table on initial loading of the screen
    useEffect(() => {
        fillTable(settable);
    }, [])

    return (
        <div className="main-body" data-testid="app-1">
            <h1>Simple Birthday Tracker</h1>
            <form onSubmit={async (e) => {
                // prevent page from reloading in submit
                e.preventDefault();
                await createUser(firstName, lastName, dob);
                // reset all input fields
                setfirstName("");
                setlastName("");
                setdob("");
                const res = await getUsers();
                settable(res.data);
            }} style={{ display: "flex", flexDirection: "column" }}>
                <label>First Name:
                    <input data-testid="first-name" type="text" value={firstName} onChange={e => { setfirstName(e.target.value) }} />
                </label>
                <label>Last Name:
                    <input data-testid="last-name" type="text" value={lastName} onChange={e => { setlastName(e.target.value) }} />
                </label>
                <label>DOB:
                    <input data-testid="dob" type="date" value={dob} onChange={e => { setdob(e.target.value) }} />
                </label>
                <button type="submit">Save</button>
            </form>
            <button onClick={async () => {
                // fill the table on clicking the refresh button
                await fillTable(settable);
            }}>Refresh Table</button>
            <table className="tg">
                <thead>
                    <tr>
                        <th className="tg-c3ow">Id</th>
                        <th className="tg-c3ow">First Name</th>
                        <th className="tg-c3ow">Last Name</th>
                        <th className="tg-c3ow">DOB</th>
                        <th className="tg-c3ow">Timestamp</th>
                        <th className="tg-c3ow">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {table.map(row => {
                        const d = new Date(row.DOB);
                        const ts = new Date(row.TimeStamp);
                        return <tr key={row.TimeStamp}>
                            <td className="tg-c3ow">{row.Id}</td>
                            <td className="tg-c3ow">{row.FirstName}</td>
                            <td className="tg-c3ow">{row.LastName}</td>
                            <td className="tg-c3ow">{d.toDateString()}</td>
                            <td className="tg-c3ow">{ts.toLocaleString()}</td>
                            <td className="tg-c3ow"><button onClick={async () => {
                                await deleteUser(row.Id);
                                await fillTable(settable);
                            }}>Delete</button></td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default App;
