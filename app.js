import  express  from "express";
import { connectdb } from "./ConnectionDb.js";
import { userTable } from "./createtables/usertable.js";
import { profileimagetable } from "./createtables/profileimagetable.js";
import { requesttable } from "./createtables/requestTable.js";
import route from "./route.js";
import cors from 'cors'
const app = express()
const hostName = "192.168.1.3"
const port =5000
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(route)
connectdb()
userTable()
profileimagetable()
requesttable()
app.listen(port,hostName,(error)=>{
    if(error){
        console.log(err) 
    }
    console.log(`Server is running on:http://${hostName}:${port}`)
})