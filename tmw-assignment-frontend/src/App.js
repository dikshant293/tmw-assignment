import { useState, useEffect } from "react";
import './App.css';

const apiUrl = "http://127.0.0.1:8080";

async function getUsers() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const response = await fetch(`${apiUrl}/getUsers`, requestOptions)
    return response.json()
}

async function createUser(firstName, lastName, dob) {
    const d = new Date(`${dob}T06:00:00.000Z`)
    if (firstName.length === 0 ||
        lastName.length === 0 ||
        firstName.length > 50 ||
        lastName.length === 0 ||
        /[^a-zA-Z]/.test(firstName) ||
        /[^a-zA-Z]/.test(lastName) ||
        isNaN(d) === true) {
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

async function fillTable(settable) {
    const res = await getUsers();
    settable(res.data);
}

function App() {
    const [firstName, setfirstName] = useState("")
    const [lastName, setlastName] = useState("")
    const [dob, setdob] = useState("");
    const [table, settable] = useState([])

    useEffect(() => {
        fillTable(settable);
    }, [])

    return (
        <div className="main-body" data-testid="app-1">
            <h1>Simple Birthday Tracker</h1>
            <form onSubmit={async (e) => {
                e.preventDefault();
                await createUser(firstName, lastName, dob);
                setfirstName("");
                setlastName("");
                setdob("");
                const res = await getUsers();
                settable(res.data);
            }} style={{ display: "flex", flexDirection: "column" }}>
                <label>First Name:
                    <input type="text" value={firstName} onChange={e => { setfirstName(e.target.value) }} />
                </label>
                <label>Last Name:
                    <input type="text" value={lastName} onChange={e => { setlastName(e.target.value) }} />
                </label>
                <label>DOB:
                    <input type="date" value={dob} onChange={e => { setdob(e.target.value) }} />
                </label>
                <button type="submit">Save</button>
            </form>
            <button onClick={async () => {
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
                        return <tr key={row.Id}>
                            <td className="tg-c3ow">{row.Id}</td>
                            <td className="tg-c3ow">{row.FirstName}</td>
                            <td className="tg-c3ow">{row.LastName}</td>
                            <td className="tg-c3ow">{d.toDateString()}</td>
                            <td className="tg-c3ow">{row.TimeStamp}</td>
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
