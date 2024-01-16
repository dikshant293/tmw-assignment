import mysql from 'mysql2/promise';
import dotenv from 'dotenv'
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD
});

export async function getAllUserData() {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
}

export async function getUserDataById(Id) {
  const [rows] = await pool.query(`
    SELECT *
    FROM users
    WHERE id=?
  `, [Id]);
  return rows[0];
}

export async function createUser(firstname, lastname, dob){
  const [result] = await pool.query(`
    INSERT INTO users (FirstName,LastName,DOB)
    VALUES (?,?,?)
  `, [firstname,lastname,dob]);
  return getUserDataById(result.insertId);
}

// const result = await createUser("Suryansh Pratap","Singh","2005-01-01");
// console.log(result);