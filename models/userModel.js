import { pool } from "../ConnectionDb.js";
const user = async (data) =>{
    try{
        const getUserName = [data]
        const fetchQuery =`SELECT * FROM users WHERE "username" =  $1`
        return await pool.query(fetchQuery,getUserName)
    }
    catch(error){
        console.log(error)
    }
}
const TokenSave = async(data) =>{
    try{
       const tokenSaveQuery = `UPDATE users SET token = ARRAY_APPEND("token", $1 ) WHERE "id" = $2  RETURNING token`
       return await pool.query(tokenSaveQuery,data)
    }
    catch(error){
        console.log(error)
    }
}
export { user, TokenSave }