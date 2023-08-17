import {pool} from "../ConnectionDb.js";
import existsTable from "./existsTable.js"
export const requesttable = async () =>{
    try{
        const createRequestTable =`
            CREATE TABLE request(
                id SERIAL PRIMARY KEY,
                sender_id INT,
                receiver_id INT ,
                request_status TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                FOREIGN KEY (sender_id) REFERENCES users (id),
                FOREIGN KEY (sender_id) REFERENCES users (id)
            ) 
        `
        const result = await existsTable('request')
        if(result.rows[0].exists){
            console.log('Request table already exists')
        }
        else{
            await pool.query(createRequestTable )
            console.log('Request table has been created')
        }       
    }
    catch(error){
        console.log(error)
    }
}