import mysql from 'mysql2/promise';
import dotenv from 'dotenv'
dotenv.config();

// start the pool for the mysql database
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD
});

// function to query the database and get all the rows
export async function getAllUserData() {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
}

// function to return the row in table with the given id
export async function getUserDataById(Id) {
  const [rows] = await pool.query(`
    SELECT *
    FROM users
    WHERE id=?
  `, [Id]);
  return rows;
}

// create a new user with the given parameters, returns the newly created row
export async function createUser(firstName, lastName, dob) {
  const [result] = await pool.query(`
    INSERT INTO users (FirstName,LastName,DOB)
    VALUES (?,?,?)
  `, [firstName, lastName, dob]);
  return getUserDataById(result.insertId);
}

// delete the entry with the given id
export async function deleteUser(id) {
  const [result] = await pool.query(`
    DELETE FROM users WHERE Id=?
  `, [id]);
  return result;
}