import  express  from "express";
import { login } from "./controller/user.js";
import { profileImage,upload, userProfile} from "./controller/profileimage.js";
profileImage
const route = express.Router()
route.post('/api/login',login )
route.post('/api/profileimage',upload.single("file"),profileImage )
route.get('/api/userprofile/:id',userProfile)
route.get('/',(req,res) =>{
    res.send("<h3>Chat App Server is running</h3>")
})
export default route