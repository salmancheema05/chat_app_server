import { pool } from "../ConnectionDb.js";
const profileImageSave = async(data) =>{
    try{
       const saveQuery = `INSERT INTO  profileimage (user_id,image_name) VALUES($1,$2)`
       return await pool.query(saveQuery,data)
    }
    catch(error){
        console.log(error)
    }
}
const existsOrNotImage = async(data) =>{
    try{
       const existsQuery = `SELECT COUNT(*)  FROM profileimage WHERE user_id = $1`
       return await pool.query(existsQuery,data)
    }
    catch(error){
        console.log(error)
    }
}
const getImageData = async(data) =>{
    try{
       const getImageQuery = `SELECT image_name FROM profileimage WHERE user_id = $1`
       return await pool.query(getImageQuery,data)
    }
    catch(error){
        console.log(error)
    }
}
const updateProfile = async(data) =>{
    try{
       const updateImageQuery = `UPDATE profileimage SET image_name  = $1 WHERE user_id = $2`
       return await pool.query(updateImageQuery,data)
    }
    catch(error){
        console.log(error)
    }
}
const getProfile = async(data) =>{
    try{
       const getImageQuery = `SELECT * FROM profileimage WHERE user_id = $1`
       return await pool.query(getImageQuery,data)
    }
    catch(error){
        console.log(error)
    }
}

export {profileImageSave,existsOrNotImage, getImageData,updateProfile,getProfile}