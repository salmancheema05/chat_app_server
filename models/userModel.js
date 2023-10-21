import { pool } from "../ConnectionDb.js";
const user = async (data) => {
  try {
    const getUserName = [data];
    const fetchQuery = `SELECT * FROM users WHERE "username" =  $1`;
    return await pool.query(fetchQuery, getUserName);
  } catch (error) {
    console.log(error);
  }
};
const TokenSave = async (data) => {
  try {
    const tokenSaveQuery = `UPDATE users SET loginstatus=true,token = ARRAY_APPEND("token", $1 ) WHERE "id" = $2  RETURNING token`;
    return await pool.query(tokenSaveQuery, data);
  } catch (error) {
    console.log(error);
  }
};
const userIsonlineOrOffine = async (data) => {
  try {
    const updateQuery = `UPDATE users SET activestatus = $1 WHERE id =$2`;
    return await pool.query(updateQuery, data);
  } catch (error) {
    console.log(error);
  }
};
const logout = async (data) => {
  try {
    const updateQuery = `UPDATE users SET loginstatus = $1,token = array_remove("token", $2 ) WHERE id =$3`;
    return await pool.query(updateQuery, data);
  } catch (error) {
    console.log(error);
  }
};
export { user, TokenSave, userIsonlineOrOffine, logout };
