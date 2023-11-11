import { pool } from "../ConnectionDb.js";
const chatInsert = async (data) => {
  try {
    const insertQuery = `INSERT INTO chating(senderid, receiverid, chat,chatstatus)
    VALUES ($1, $2, $3, $4)`;
    return await pool.query(insertQuery, data);
  } catch (error) {
    console.log(error);
  }
};
const fetchChatsQuery = async (data) => {
  try {
    const fetachQuery = `SELECT * FROM chating 
    WHERE (senderid = $1 AND receiverid = $2) 
       OR (senderid = $2 AND receiverid = $1) ORDER BY created_at`;
    return await pool.query(fetachQuery, data);
  } catch (error) {
    console.log(error);
  }
};
const updateChatsSeen = async (data) => {
  try {
    const fetachQuery = `
      UPDATE chating SET chatstatus = 'seen' WHERE receiverid IN
      (SELECT receiverid FROM chating WHERE senderid = $2 AND receiverid = $1)
    `;
    return await pool.query(fetachQuery, data);
  } catch (error) {
    console.log(error);
  }
};
export { chatInsert, fetchChatsQuery, updateChatsSeen };
