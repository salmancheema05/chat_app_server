import { pool } from "../ConnectionDb.js";
const senderData = async (data) => {
  try {
    const receiverId = [data];
    const fetchQuery = `SELECT users.id,users.firstname,users.lastname,profileimage.image_name,	
    request.sender_id ,request.receiver_id,request.request_status FROM users JOIN request
    ON users.id = request.sender_id LEFT JOIN profileimage 
    ON users.id=profileimage.user_id where request.receiver_id =$1
    
    `;
    return await pool.query(fetchQuery, receiverId);
  } catch (error) {
    console.log(error);
  }
};
const receiveLastRequest = async (data) => {
  try {
    const fetchQuery = `SELECT users.id,users.firstname,users.lastname,profileimage.image_name,	
    request.request_status,request.receiver_id,request.sender_id  FROM users JOIN request
    ON users.id = request.sender_id LEFT JOIN profileimage 
    ON users.id=profileimage.user_id where  request.receiver_id = $1 And request.sender_id=$2
    `;
    return await pool.query(fetchQuery, data);
  } catch (error) {
    console.log(error);
  }
};
const receiverData = async (data) => {
  try {
    const fetchQuery = `SELECT users.id,users.firstname,users.lastname,profileimage.image_name,	
    request.request_status,request.receiver_id,request.sender_id  FROM users JOIN request
    ON users.id = request.receiver_id JOIN profileimage 
    ON users.id=profileimage.user_id where  request.receiver_id = $1
    `;
    return await pool.query(fetchQuery, data);
  } catch (error) {
    console.log(error);
  }
};
const accepted = async (data) => {
  try {
    const updateQuery = `UPDATE request SET request_status = $1 WHERE 
      (sender_id = $2 AND receiver_id =$3) 
      OR
      (receiver_id =$3 AND sender_id = $2) 
      RETURNING sender_id, receiver_id
      `;
    return await pool.query(updateQuery, data);
  } catch (error) {
    console.log(error);
  }
};
const send = async (data) => {
  try {
    const sendQuery = `INSERT INTO request (sender_id, receiver_id, request_status) VALUES ($1,$2,$3) RETURNING sender_id,receiver_id`;
    return await pool.query(sendQuery, data);
  } catch (error) {
    console.log(error);
  }
};

const deleted = async (data) => {
  try {
    const updateQuery = `DELETE FROM request WHERE 
      (sender_id = $1 AND receiver_id =$2) 
      OR
      (receiver_id =$2 AND sender_id = $1) 
     `;
    return await pool.query(updateQuery, data);
  } catch (error) {
    console.log(error);
  }
};
const searchQuery = async (data) => {
  try {
    const [userId, search] = data;
    const getQuery = `SELECT u.id, u.firstname, u.lastname,  dp.image_name,
    r.request_status, r.id AS request_id,r.sender_id,r.receiver_id
    FROM users u
    JOIN request r ON (u.id = r.sender_id OR u.id = r.receiver_id)
    LEFT JOIN profileimage dp ON (u.id = dp.id)
    WHERE (r.sender_id = $1 OR r.receiver_id = $1)
    AND (r.request_status = 'accept' OR r.request_status = 'pending')
    AND u.id != $1
    AND u.search LIKE $2
    
    UNION
    SELECT  users.id, users.firstname, users.lastname, NULL AS image_name,
    NULL AS request_status, NULL AS request_id, NULL AS sender_id, NULL AS receiver_id
    
    FROM users
    LEFT JOIN profileimage dp ON (users.id = dp.id)
    WHERE users.id != $1
    AND users.search LIKE $2
    AND users.id NOT IN (
        SELECT sender_id FROM request WHERE receiver_id = $1
        AND (request_status = 'accept' OR request_status = 'pending')
        UNION
        SELECT receiver_id FROM request WHERE sender_id = $1
        AND (request_status = 'accept' OR request_status = 'pending')
    )`;
    return await pool.query(getQuery, [userId, `%${search}%`]);
  } catch (error) {
    console.log(error);
  }
};
export {
  senderData,
  accepted,
  deleted,
  searchQuery,
  send,
  receiveLastRequest,
  receiverData,
};
