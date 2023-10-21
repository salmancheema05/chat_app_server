import { Server } from "socket.io";
import { userIsonlineOrOffine } from "../models/userModel.js";
import { fileSave, fetchFile } from "./chatServer.js";
const Sockethandle = (mainServer) => {
  const io = new Server(mainServer);
  io.on("connection", (socket) => {
    socket.on("yourFriendonline", async (data) => {
      try {
        const result = await userIsonlineOrOffine(["online", data.friendid]);
        socket.broadcast.emit("activestatus", data);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("yourFriendOffline", async (data) => {
      await userIsonlineOrOffine(["offline", data.friendid]);
      socket.broadcast.emit("inactivestatus", data);
    });
    socket.on("newMessageFromMe", async (messageData) => {
      if (messageData.type == "audiovoice" || messageData.type == "image") {
        const object = await fileSave(messageData);
        const fileObject = await fetchFile(object);
        console.log("fileObject", fileObject);
        // socket.broadcast.emit("sendMessage", fileObject);
      } else {
        socket.broadcast.emit("sendMessage", messageData);
      }
    });
  });
};
export default Sockethandle;
