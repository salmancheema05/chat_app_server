import express from "express";
import { login, userLogout, signup } from "./controller/user.js";
import {
  profileImage,
  upload,
  userProfile,
} from "./controller/profileimage.js";
import {
  receiveRequest,
  acceptedrequest,
  deleteRequest,
  searchPeople,
  sendRequest,
} from "./controller/request.js";
import { allfriend } from "./controller/AllFriendsController.js";
import { fetchChats } from "./controller/ChatingSave.js";
const route = express.Router();
route.post("/api/login", login);
route.post("/api/signup", signup);
route.post("/api/logout", userLogout);
route.post("/api/profileimage", upload.single("file"), profileImage);
route.get("/api/userprofile/:id", userProfile);
route.get("/api/fetchchats/:senderid/:receiverid", fetchChats);
route.get("/api/receiverequest/:receiver_id", receiveRequest);
route.put("/api/acceptedrequest/:senderid/:receiverid", acceptedrequest);
route.delete("/api/deletedrequest/:senderid/:receiverid", deleteRequest);
route.get("/api/searchpeople/:userid/:search", searchPeople);
route.post("/api/sendrequest", sendRequest);
route.get("/api/allfriend/:id", allfriend);
route.get("/", (req, res) => {
  res.send("<h3>Chat App Server is running</h3>");
});
export default route;
