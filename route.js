import  express  from "express";
import { login } from "./controller/user.js";
import { profileImage,upload, userProfile} from "./controller/profileimage.js";
import { receiveRequest,acceptedrequest, deleteRequest , searchPeople,sendRequest } from "./controller/request.js";
import { allfriend } from "./controller/AllFriendsController.js";
const route = express.Router()
route.post('/api/login',login )
route.post('/api/profileimage',upload.single("file"),profileImage )
route.get('/api/userprofile/:id',userProfile)
route.get('/api/receiverequest/:receiver_id',receiveRequest)
route.put('/api/acceptedrequest',acceptedrequest )
route.delete('/api/deletedRequest',deleteRequest )
route.get('/api/searchpeople/:search',searchPeople)
route.post('/api/sendrequest',sendRequest)
route.get('/api/allfriend/:id',allfriend)
route.get('/',(req,res) =>{
    res.send("<h3>Chat App Server is running</h3>")
})
export default route