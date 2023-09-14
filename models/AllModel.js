import { pool } from "../ConnectionDb.js";
const AllFriendsList = async (data) =>{
    try{
        const fetchQuery =`SELECT u.id,u.firstname,u.lastname, u.loginstatus,p.image_name,u.activestatus
            FROM (
                SELECT receiver_id AS user_id
                FROM request
                WHERE sender_id = $1 AND request_status = 'accept'
                UNION
                SELECT sender_id AS user_id
                FROM request
                WHERE receiver_id = $1 AND request_status = 'accept'
            ) AS merged_ids
            JOIN users AS u ON merged_ids.user_id = u.id
            LEFT JOIN profileimage AS p ON merged_ids.user_id = p.user_id;
        `
        return await pool.query(fetchQuery,data)
    }
    catch(error){
        console.log(error)
    }
}
export { AllFriendsList}