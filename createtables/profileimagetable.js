import {pool} from "../ConnectionDb.js";
import existsTable from "./existsTable.js"
export const profileimagetable = async () =>{
    try{
        const createProfileImageTable =`
            CREATE TABLE profileimage(
                id SERIAL PRIMARY KEY,
                user_id INT UNIQUE,
                image_name TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                FOREIGN KEY (user_id) REFERENCES users (id)
            ) 
        `
        const result = await existsTable('profileimage')
        if(result.rows[0].exists){
            console.log('Profile Image Table already exists')
        }
        else{
            await pool.query(createProfileImageTable)
            console.log('Profile Image table has been created')
        }       
    }
    catch(error){
        console.log(error)
    }


}
//export default userTable