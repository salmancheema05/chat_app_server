import {pool} from "../ConnectionDb.js";
import existsTable from "./existsTable.js"
export const userTable = async () =>{
    try{
        const createUserTable =`
            CREATE TABLE users(
                id SERIAL PRIMARY KEY,
                firstname TEXT NOT NULL,
                lastname TEXT NOT NULL,
                email TEXT NOT NULL,
                username TEXT NOT NULL,
                password TEXT  NOT NULL,
                loginstatus BOOLEAN NOT NULL,
                search Text NOT NULL,
                token TEXT[],
                created_at TIMESTAMP DEFAULT NOW()
            ) 
        `
        const result = await existsTable('users')
        if(result.rows[0].exists){
            console.log('Users Table already exists')
        }
        else{
            await pool.query(createUserTable)
            console.log('Users table has been created')
        }       
    }
    catch(error){
        console.log(error)
    }


}
//export default userTable