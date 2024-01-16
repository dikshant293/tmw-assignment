import { useState } from "react";
import DatePicker from "react-datepicker";
import './App.css';

const apiUrl = "http://127.0.0.1:8080";

async function test(firstName,lastName,dob) {
    alert(JSON.stringify([firstName,lastName,dob]));
    return {"msg":"yoooo"}
}

async function getUsers() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const response = await fetch(`${apiUrl}/getUsers`, requestOptions)
    return response.json()
}

async function createUser(firstName,lastName,dob) {
    const d = new Date(`${dob}T06:00:00.000Z`)
    console.log(d)
    if(firstName.length==0 || lastName.length==0 || isNaN(d)==true){
        alert("invalid input")
        return {"msg":"invalid input"}
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

function App() {
    const [firstName, setfirstName] = useState("")
    const [lastName, setlastName] = useState("")
    const [dob, setdob] = useState("");
    const [table, settable] = useState([])
    return (
        <div className="main-body">
            <h1>Simple Birthday Tracker</h1>
            <form onSubmit={async (e) => {
                e.preventDefault();
                await createUser(firstName,lastName,dob);
                setfirstName("");
                setlastName("");
                setdob("");
            }} style={{display:"flex",flexDirection:"column"}}>
                <label>First Name:
                    <input type="text" value={firstName} onChange={e => {setfirstName(e.target.value)}}/>
                </label>
                <label>Last Name:
                    <input type="text" value={lastName} onChange={e => {setlastName(e.target.value)}}/>
                </label>
                <label>DOB:
                    <input type="date" value={dob} onChange={e => {setdob(e.target.value)}}/>
                </label>
                <button type="submit">Submit</button>
            </form>
            <button onClick={async () => {
                const res = await getUsers();
                settable(res.data);
            }}>Get Table</button>
            <table className="tg">
                <thead>
                    <tr>
                        <th className="tg-c3ow">Id</th>
                        <th className="tg-c3ow">First Name</th>
                        <th className="tg-c3ow">Last Name</th>
                        <th className="tg-c3ow">DOB</th>
                        <th className="tg-c3ow">Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {table.map(row => {
                        const d = new Date(row.DOB);
                        console.log(d.toDateString())
                        return <tr key={row.Id}>
                            <td className="tg-c3ow">{row.Id}</td>
                            <td className="tg-c3ow">{row.FirstName}</td>
                            <td className="tg-c3ow">{row.LastName}</td>
                            <td className="tg-c3ow">{d.toDateString()}</td>
                            <td className="tg-c3ow">{row.TimeStamp}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default App;
