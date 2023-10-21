import { pool } from "../ConnectionDb.js";
const senderData = async (data) => {
  try {
    const receiverId = [data];
    const fetchQuery = `SELECT users.id,users.firstname,users.lastname,profileimage.image_name,	
            request.request_status FROM users JOIN request
            ON users.id = request.sender_id JOIN profileimage 
            ON users.id=profileimage.user_id where request.receiver_id =$1
        `;
    return await pool.query(fetchQuery, receiverId);
  } catch (error) {
    console.log(error);
  }
};
const accepted = async (data) => {
  try {
    const updateQuery = `UPDATE request SET request_status = $1 WHERE sender_id = $2 AND receiver_id =$3`;
    return await pool.query(updateQuery, data);
  } catch (error) {
    console.log(error);
  }
};
const send = async (data) => {
  try {
    const sendQuery = `INSERT INTO request (sender_id, receiver_id, request_status) VALUES ($1,$2,$3)`;
    return await pool.query(sendQuery, data);
  } catch (error) {
    console.log(error);
  }
};

const deleted = async (data) => {
  try {
    const updateQuery = `DELETE FROM request WHERE sender_id = $1 AND receiver_id =$2 `;
    return await pool.query(updateQuery, data);
  } catch (error) {
    console.log(error);
  }
};
const searchQuery = async (search) => {
  try {
    const getQuery = `SELECT users.id, request.receiver_id,request.sender_id ,users.firstname, 
            users.lastname, users.username,users.loginstatus, profileimage.image_name, request.request_status 
            from users
            LEFT JOIN profileimage ON users.id = profileimage.user_id
            LEFT JOIN request ON users.id = request.sender_id OR users.id = request.receiver_id
            where search LIKE $1  ORDER BY search
        `;
    return await pool.query(getQuery, [`%${search}%`]);
    // console.log([`%${search}%`])
  } catch (error) {
    console.log(error);
  }
};
export { senderData, accepted, deleted, searchQuery, send };
