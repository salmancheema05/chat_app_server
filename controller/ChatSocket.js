import { Server } from "socket.io";
import { userIsonlineOrOffine } from "../models/userModel.js";
const chatingSocketIo = (mainServer) => {
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
      const result = await userIsonlineOrOffine(["offline", data.friendid]);
      socket.broadcast.emit("inactivestatus", data);
    });
    socket.on("newMessageFromMe", async (messageData) => {
      socket.broadcast.emit("sendMessage", messageData);
    });
  });
};
export default chatingSocketIo;
